# Ditto CLI

![ditto-cli-init](https://user-images.githubusercontent.com/59497/91914546-33086500-ec6d-11ea-9712-56564a8bfb3f.gif)

`ditto-cli` is a tool to integrate ditto into your build process.  You can use this tool to import your copy into your codebase and integrate it into the products you are building.

## Availability

Ditto CLI is available to select paid users of the Ditto app.  For access please contact founders@dittowords.com.

## Feedback wanted

We welcome your feedback.
Let us know what kind of tooling you require or if this tool isn't meeting your needs.  We are early in development and want to build something that is useful for you.
You can submit issues or even make pull requests.

## Usage

* `ditto-cli` this will initialize your environment to work with Ditto if needed.
* `ditto-cli help` this will show you help.
* `ditto-cli pull` pull copy into working directory

### Pull

![ditto-cli-pull](https://user-images.githubusercontent.com/59497/91914557-356abf00-ec6d-11ea-867c-7d73dc95e90b.gif)

The pull command is the workhorse of `ditto-cli`:

* It pulls the text from the project defined in `.ditto/config.yml`.
* We will prompt to overwrite if a file exists (unless we have set a default).

## Build Process

We recommend using `.gitignore` for `.ditto/texts.json`.
This file is generated and potentially always changing and the commit history can be extensive and perhaps boring:

> Add updated file from Ditto

Something more meaningful is to add ditto's setup to part of your developer's environment setup.  Then update the file as build step before deployment.

## Development (of the Ditto CLI)

There's a few environment variables that might make your life easier:

* `DEBUG`: Which will show more verbose errors.
* `DITTO_API_HOST`: If you happen to work for Ditto and are developing against a development site.
* `DEMO`: puts the app into a demo mode to walk through the steps (details below)

You can run these commands like so:

```
DEBUG=true ditto-cli
DEBUG=true DITTO_API_HOST=http://localhost:1234 ditto-cli
DITTO_API_HOST=http://localhost:1234 ditto-cli
```

If you are making changes to the CLI source code, you can also run the CLI directly
using `node`:

```
node ./bin/ditto.js
```

You may also install the dev version of the CLI globally:

```
npm install -g .
```

Which will make `ditto-cli` available on your computer.

## Demo mode

Demo mode can be used to walk through the initialization.

```
DEMO=true ditto-cli
```

Demo will:

* Force the initialization of the app to collect credentials.
* Force collection of a token (and skip validation)
* Force collection of a project (from artificially generated projects)
