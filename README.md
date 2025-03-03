# Ditto CLI

The Ditto CLI helps teams integrate [Ditto](https://dittowords.com/) into their development workflows and build processes.

## Getting Started

You can install the CLI from npm:

```bash
# as a dev dependency (recommended)
npm install --save-dev @dittowords/cli

# as a global package
npm install --global @dittowords/cli
```

The installed binary is named `ditto-cli`. You can execute it directly in `node_modules/.bin/ditto-cli` or using [npx](https://www.npmjs.com/package/npx) (with or without installation) like `npx @dittowords/cli`.

The first time you run the CLI, you'll be asked to provide an API key (found at [https://beta.dittowords.com/account/user](https://beta.dittowords.com/account/user) under **API Keys**):

```
$ npx @dittowords/cli

┌──────────────────────────────────┐
│                                  │
│   Welcome to the Ditto CLI.      │
│                                  │
│   We're glad to have you here.   │
│                                  │
└──────────────────────────────────┘

What is your API key? > xxx-xxx-xxx

Thanks for authenticating.
We'll save the key to: /Users/{username}/.config/ditto
```

Once you've successfully authenticated, you'll be asked to configure the CLI with an initial project from your workspace:

```
Looks like there are no Ditto projects selected for your current directory.

? Choose the project you'd like to sync text from:
- Ditto Component Library https://beta.dittowords.com/components/all
- NUX Onboarding Flow https://beta.dittowords.com/doc/609e9981c313f8018d0c346a
...
```

After selecting a project, a configuration file will automatically be created at the path `./ditto/config.yml`, relative to your current working directory. The CLI will attempt to read from this file every time a command is executed. See the [documentation on config.yml](#files) further down in this README for a full reference of how the CLI can be configured.

Once you've successfully authenticated and a config file has been created, you’re ready to start fetching copy! You can set up the CLI in multiple directories by running `ditto-cli` and choosing an initial project to sync from.

## API Keys

The CLI will not prompt for an API key if a value is provided in the environment variable `DITTO_API_KEY`.

If the `DITTO_API_KEY` environment variable is not set, then the CLI will attempt to parse a token from a file at the
path `~/.config/ditto`. If this file does not exist or does not contain a valid API key, then the CLI will prompt
for one.

We don't recommend editing the file manually; if you need to remove a saved API key and put another one in its place,
it's better to fully delete the file and then re-run the CLI so that a new key is prompted for.

## Commands

### `pull`

**Usage:** `ditto-cli pull`

**Action:** Pulls text data from projects linked in `config.yml` and stores it in the `ditto/` folder.

The data will be stored in JSON files according to the `format` property specified in `config.yml`. If no format is specified, the default structured format will be used. Every time text is pulled, the existing text data is removed before new data is generated and stored.

For more details on files generated by the `pull` command, see [JSON Files](#json-files).

### `project add`

**Usage:** `ditto-cli project add`

**Action:** Adds a project to the list of Ditto projects stored in `config.yml`. Running this will allow you to select from a list of projects in your workspace that have developer mode enabled.

### `project remove`

**Usage:** `ditto-cli project remove`

**Action:** Removes a project from the list of Ditto projects stored in `config.yml`.

## Files

### `ditto/`

This folder houses the configuration file (`ditto/config.yml`) used by the CLI and is also the write destination for any files the CLI generates.

If you run the CLI in a directory that does not contain a `ditto/` folder, the folder and a `config.yml` file will be automatically created.

- #### config.yml

  This is the source of truth for a given directory about how the CLI should fetch and store data from Ditto. It includes information about which Ditto projects the CLI should pull text from and in what format the text should be stored.

  This file is managed by the `project add` / `project remove` commands, but can also be updated by manually editing it.

  **Supported properties**

  ##### `projects`

  A list of project names and ids to pull text from. 

  Required if `components: true` is not specified.

  **Note**: the `name` property is used for display purposes when referencing a project in the CLI, but does not have to be an
  exact match with the project name in Ditto.

  ```yml
  projects:
    - name: Landing Page Copy
      id: 61b8d26105f8f400e97fdd14
    - name: User Settings
      id: 606cb89ac55041013d552f8b
  ```

  ##### `components`

  If included with a value of `true`, data from the component library will be fetched and included in the CLI's output.

  Required if `projects` is not specified with a valid list of projects.

  ```yml
  components: true
  ```

  ##### `variants`

  If included with a value of `true`, variant data will be pulled for the specified projects and/or the component library.

  Defaults to `false`.

  ```yml
  variants: true
  ```

  ##### `format`

  The format the specified projects should be stored in. Acceptable values are `structured` or `flat`.

  If not specified, the default format containing block and frame data will be used.

  ```yml
  format: flat
  ```

  **Full Example**

  ```yml
  projects:
    - name: Landing Page Copy
      id: 61b8d26105f8f400e97fdd14
    - name: User Settings
      id: 606cb89ac55041013d552f8b
  components: true
  variants: true
  format: flat
  ```

- #### JSON Files

  The copy pulled from your Ditto projects is saved to JSON files in the `ditto/` folder.

  The number of files present and the convention with which they're named will vary according to the options specified in `config.yml`:

  - If the `variants` and `format` options are unset, all data will be stored in a single file: `text.json`
  - If the `variants` option is `true` and the `format` option is unset, files will be written on a per-variant basis; `base.json` will contain all base (non-variant) text and all other files will follow the pattern `[variant-api-id].json`.
  - If the `variants` option is unset and the `format` open is `flat` or `structured`, files will be written on a per-project basis following the pattern `[project-id].json`.
  - If the `variants` option is `true` and the `format` option is `flat` or `structured`, files will be written on a per-project per-variant basis following the pattern `[project-id__variant-api-id].json`. These files will NOT contain the top-level `projects` and `project_xyz` keys.

- #### `index.js`

  An automatically generated driver file that simplifies the process of passing text data to Ditto JavaScript SDKs. This file has a standardized format that is always the same independent of the CLI configuration used to generate it.

  **Since this file is designed to be consumed by other internal Ditto libraries, it is not recommended that you depend on it - its format may change between major releases.**

  ```ts
  interface DriverFile {
    [projectId: string]: {
      // non-variant text is represented via an apiId of 'base'
      [variantApiId: string]: {
        [id: string]: Frame | { text: string } | string;
      };
    };
  }

  interface Frame {
    blocks: {
      [blockId: string]: {
        [textApiId: string]: StructuredText;
      };
    };
    otherText: {
      [textId: string]: StructuredText;
    };
  }

  interface StructuredText {
    text: string;
  }
  ```

  ```js
  module.exports = {
    ditto_component_library: {
      base: require("./ditto_component_library__base.json"),
      spanish: require("./ditto_component_library__spanish.json"),
    },
    project_1234: {
      base: require("./example-project__base.json"),
      spanish: require("./example-project__spanish.json"),
    },
  };
  ```

  Example usage:

  ```jsx
  import source from "./ditto";

  const App = () => <DittoProvider source={source}>...</DittoProvider>;
  ```

### `~/.config/ditto`

Your API key is saved to this file in your **home directory**. Changing an API key currently requires opening this file and manually replacing the existing key.

## SDKs

Our SDKs make it easy to integrate the copy pulled from the Ditto CLI into your applications.

- [Ditto React](https://www.npmjs.com/package/ditto-react) - easily integrate Ditto into your React project; includes support for localization using variants.

## Feedback

Have feedback? We’d love to hear it! Message us at [support@dittowords.com](mailto:support@dittowords.com).
