# Sportbook

&copy; Nick Florin, 2023

### System Requirements

- [nvm]: A [node] version manager.
- [Node][node] v18
- [homebrew]: A MacOSX package manager.
- [postgresql] ([homebrew] package)

## Getting Started

This section of the documentation outlines - at a high level - how to setup your machine for local development for the
first time. For more detailed explanations related to local development or production deployments, see the next section;
"Development".

**Note**: This documentation describes how to setup and configure the application for local development on _MacOSX_.
Many of the steps outlined in this section may also be applicable for a Windows/Ubuntu machine as well, but the steps
will not be exactly as they are described here.

### Step 1: Repository

Clone this repository locally and `cd` into the directory.

```bash
$ git clone git@github.com:nickmflorin/sportbook.git
```

### Step 2: Environment

This section walks through how to install and configure the prerequisites (System Requirements) for this project.

#### 2.a Node

[Node][node] is the engine that supports the application. This project uses [node] v18.0.0. Your machine will most
likely already have a system installation of [node], but even if it does not - that is okay. We will not be using a
system installation of [node] but will rather isolate the version of [node] to this repository, using [nvm].

**Important**: Do not use a system installation of [node]. It will complicate your development environment. Instead, see
the next section for details about usage of [nvm].

##### 2.a.i Installing [nvm]

It is recommended that you use [nvm] to manage [node] versions as it relates to this project. It will allow you to
isolate the version of [node] being used for this project to the project directory, avoiding conflicts with global or
system installations of [node].

Instructions for installing [nvm] can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating), but are
also mentioned below for purposes of completeness:

First, simply run the install script:

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

The above command will download a script and then run it. The script first clones the [nvm] repository at `~/.nvm` and
then attempts to add the following source lines to your machine's shell profile script (`~/.bash_profile`, `~/.zshrc`,
`~/.profile`, or `~/.bashrc`):

```bash
$ export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

**Note**: _This installation will automatically make changes to your shell profile script. The exact file will depend on
the type of machine you are running as well as the period of time in which the machine was created. Most likely, your
shell profile script will be `~/.zshrc` - which is the shell profile used for Mac's created since the introduction of
the M1 processor._

Since the [nvm] installation involved making changes to your shell profile script behind the scenes, in order for those
changes to take effect you need to source your `~/.zshrc` (or whatever shell script your system uses):

```bash
$ . ~/.zshrc`
```

Finally, verify that your system recognizes the `nvm` command by running the following:

```bash
$ nvm
```

##### 2.a.ii Node Version

You now need to establish the correct version of [node], 18, that will be used for this project. This project comes
equipped with a `.nvmrc` file that automatically tells [nvm] what version of [node] to use - but that version may still
need to be installed.

First, instruct [nvm] to use the [node] version specified by the `.nvmrc` file with the following command:

```bash
$ nvm use
```

If you see an output similar to the following:

```bash
Found '/<path-to-repository>/sportbook/.nvmrc' with version <v18.0.0>
Now using node v18.0.0 (npm v8.6.0)
```

It means that the correct version of [node] that is required for this project is already installed with [nvm] and that
version of [node] is active for this project's directory. The rest of this step can be skipped and you can proceed to
the next step, "Dependencies".

On the other hand, if you see an error similar to the following:

```bash
Found '/<path-to-repository>/sportbook/.nvmrc' with version <v18.0.0>
N/A: version "v18.0.0 -> N/A" is not yet installed.

You need to run "nvm install v18.0.0" to install it before using it.
```

It means that the correct version of [node] that is required for this project is not already installed with [nvm], and
must be installed before using it. To do this, simply run the following command:

```bash
$ nvm install
```

This command will use [nvm] to install the correct version of [node] that is required for this project, based on the
specification in the project's `.nvmrc` file.

Finally, all that is left to do is to instruct [nvm] to use this version of [node] by executing the following command:

```bash
$ nvm use
```

For a sanity check, confirm that [nvm] is pointing to the correct version of [node] in the project directory by
executing the following command:

```bash
$ nvm current
```

The output of this command should be similar to the following:

```bash
$ v18.x.x
```

At this point, if [nvm] is not pointing at the correct version of [node] or is pointing at a system installation of
[node], something went awry - consult a team member before proceeding.

#### 2.a.iii: Dependencies

When setting up the environment for the first time, you must do a fresh install of the dependencies:

```bash
$ npm install
```

This will install the project dependencies in the `package.json` file.

#### 2.a.iv ENV File

When running the application locally, there are two files that are used to define environment variables that the
application relies on:

1. `.env.local`
2. `.env.development`

The `.env.development` file is committed to source control, and its contents should not be changed unless the intention
is to commit the change to the application codebase. On the other hand, `.env.local` is not committed to source control,
and any environment variables placed in `.env.local` will override those in `.env.development` (or `.env.production` if
in a production environment).

In certain cases you will need to create this `.env.local` file (in the project root) that defines or overrides
environment variables that the application relies on. In other cases, a `.env.local` file will not be needed, as the
environment variables defined in `.env.development` are suitable.

For environment variables that need to be specified in the `.env.local` file - if there are any - please reach out to a
team member when you reach this step. For more information, please refer to the below section in this documentation,
"Environment".

### Step 3: Homebrew

If on MacOSX, you will need to install [homebrew], which is a MacOSX package manager.

### Step 4: Database

This project uses a [postgres] database for both production and local development. First, check to see if your machine
already has [postgres] installed:

```bash
$ which postgres
```

If the result of the command is a directory (usually `/usr/local/bin/postgres`), then it is already installed and you
can proceed to the next step. If not, simply install [postgres]:

```bash
$ brew install postgres
```

The [postgres] installation will come equipped with [psql], which is [postgres]'s command line tool. Once [postgres] is
installed, or you have verified that your machine already has a [postgres] installation, we need to start the [postgres]
server:

```bash
$ brew services start postgresql
```

#### 4.a Setting Up Application Database

The database configuration parameters can be overridden in a `.env` file, but locally they default to the following if
not present in the `.env` file:

```bash
DATABASE_NAME=postgres_sportbook
DATABASE_USER=sportbook
DATABASE_PASSWORD=''
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

## Development

### IDE

This project is optimized for development using the [VSCode][vscode] IDE. While other IDEs may also work in this
repository, you must take steps to ensure that our editor configurations (like trimmed whitespace, indentation, and
`prettyprint` with [Prettier][prettier]) that are applied to this repository while using [VSCode][vscode] are also
consistently applied in your IDE. This ensures that your commits will conform to the established repository style.

### Running Locally

After pulling down the latest state of the repository, the development server can be started by running the following
command:

```bash
$ npm run dev
```

**Note**: If changes were made to the `package.json` file, you may need to install the dependencies via `npm install`.

Once the development server is running, you should start your work.

### Building

Before committing any changes you have made, you must ensure that you validate your work by ensuring that you can
successfully build the project:

```bash
$ npm run build
```

This is required because [NextJS][nextjs] does not perform type checks while the development server is running. Only the
`build` command will compile the code and run all type checks.

Sometimes, you may get misleading results from the local build. For instance, you might notice that the build is failing
due to errors that you had just fixed, but were not picked up in the subsequent build. This can happen because
[NextJS][nextjs] will cache part of the build. To fix this, or as as a general sanity-check, clear the cache before
running the build:

```bash
$ rm -rf ./.next
$ npm run build
```

**Note**: [NextJS][nextjs] will also automatically perform linting checks during the `build` process - any linting
errors will result in the build failing automatically but linting warnings will not. This includes linting performed by
[ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier].

### Linting

This project uses [ESLint][eslint] to lint files that are not CSS or SCSS based, [Stylelint][stylelint] to lint files
that are CSS or SCSS based, and [Prettier][prettier] inside of the [ESLint][eslint] configuration which will format and
lint files of all types.

[NextJS][nextjs] will automatically perform linting checks during the `build` process, but it is desired that they be
performed independently without performing the entire `build` process, use the following command:

```bash
$ npm run lint
```

This will run [ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier] on the project.

With that being said, the project's [Jest][jest] testing suite is configured to perform linting and formatting checks
via [ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier] as well. This is the recommended way to perform
the checks, because the output is much, much more suitable for debugging and the hot reloading feature of [Jest][jest]
will save you a lot of time.

This can be done simply as:

```bash
$ npm run test
```

**Note**: The `npm run lint` command is actually not run during the build and is excluded from the `JenkinsFile`.
Instead, the linting checks are performed indirectly via the [Jest][jest] testing suite, which will also perform unit
tests and other checks not related to linting. For more information, please refer to the
[Testing Documentation](src/docs/TESTING.md).

#### Formatting & Code Style

The philosophy that the project has in regard to formatting and/or code styles can be summarized as follows:

> There is usually not a right or wrong answer, but it is better to choose than to not.

In other words, many formatting rules were not chosen for a specific reason other than having a decision. It is better
to rely on the available formatting tools to remove as much ambiguity as possible, rather than spending time debating or
arguing the rules themselves.

### Environment

There are 3 distinct environments that the application runs in, with the current environment being dictated by the
`NODE_ENV` environment variable:

| Environment (`NODE_ENV`) | Default Environment File | Override Environment File | Overridden by `.env.local` |
| :----------------------: | :----------------------: | :-----------------------: | :------------------------: |
|      `development`       |    `.env.development`    | `.env.development.local`  |            Yes             |
|       `production`       |    `.env.production`     |  `.env.production.local`  |            Yes             |
|          `test`          |       `.env.test`        |            N/A            |             No             |

Additionally, there is a third environment file, `.env`, that contains environment variables that define environment
variables for _all_ environments.

For each environment the default environment file specifies defaults that the environment variable will have for the
file's associated environment. These files should _always_ be committed to source control.

When the environment is `development`, the default environment variables will be loaded from `.env.development`.
Similarly, when the environment is `production`, the default environment variables will be loaded from
`.env.production`. Finally, when the environment is `test`, the default environment variables will be loaded from
`.env.test`. In each case, any environment variables defined in the environment specific file, `.env.${NODE_ENV}`, will
override those defined in the global environment variable file, `.env`.

#### Local Overrides

It is often necessary that the environment variables for any given environment be overridden, either locally in
development or on a server. When overriding the default environment variables for a given environment is required, a
`.env.local` file is used. The environment variables defined in this file will override the default environment
variables _only when in a `production` or `development` environment_. If the environment is `test`, the environment
variables in `.env.local` will not be loaded.

Note that if you would like to override the environment variables for just a single environment, a corresponding
`.env.development.local` or `.env.production.local` file can be used. Each of these files will be given precedence over
the `.env.local` file.

For further documentation regarding the environment configuration, please see the
[NextJS Documentation](https://nextjs.org/docs/basic-features/environment-variables).

### Testing

This documentation is intended to outline configurations, patterns and methodologies that are used to test the Console
application.

## [Jest](https://jestjs.io/docs/getting-started) Testing Suite

We use [Jest](https://jestjs.io/docs/getting-started) to handle integration and unit testing in the Console. The entire
test suite can be run with the following command:

```bash
$ npm run test
```

#### Projects

Originally, there was only one configuration file for the testing suite, `jest.config.ts`. However, due to the
complexities of some of the tests that have to be run, the configuration had to be split up into
[projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig), such that certain tests can use
different sets of configuration parameters that would not otherwise be possible with a single configuration.

The [Jest](https://jestjs.io/docs/getting-started) testing suite is broken down into 6
[projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig):

1. **SASS Unit Tests**: Unit tests that are run against [SASS](https://sass-lang.com/) mixins and functions.
2. **Functional Unit Tests**: Unit tests that are run against functional utilities or logic in `src/lib`.
3. **Component Tests**: Both unit tests & snapshot tests that are run against components in `src/components`.
4. **Prettier**: Prettier checks that are performed against relevant files in the project.
5. **ESLint**: ESLint checks that are performed against non `.scss` files in the project.
6. **Stylelint**: Stylelint checks that are performed against `scss` files in the project.

The following table describes the various aspects of each individual [Jest](https://jestjs.io/docs/getting-started)
project in the application:

|        Project        |                Config File                |       Files Tested        |       Test Files Located        | Included in Coverage |
| :-------------------: | :---------------------------------------: | :-----------------------: | :-----------------------------: | :------------------: |
|    SASS Unit Tests    |   `src/styles/__tests__/jest.config.ts`   |          `.scss`          |          `src/styles`           |          No          |
| Functional Unit Tests |    `src/__tests__/unit/jest.config.ts`    |           `.ts`           |            `src/lib`            |         Yes          |
|    Component Tests    | `src/__tests__/components/jest.config.ts` |          `.tsx`           |        `src/components`         |         Yes          |
|       Prettier        |         `jest-prettier-config.ts`         |       All Relevant        |               N/A               |          No          |
|        ESLint         |          `jest-eslint-config.ts`          | All Relevant, non `.scss` |               N/A               |          No          |
|       Stylelint       |        `jest-stylelint-config.ts`         |          `.scss`          | `src/styles` & `src/components` |          No          |

#### Linting

Linting checks from [ESLint](https://eslint.org/), [Stylelint](https://stylelint.io/), and
[Prettier](https://prettier.io/) can be performed both via the `npm run lint` command or simply the command that runs
the test suite:

```bash
$ npm run test
```

However, it is highly recommended that the [Jest](https://jestjs.io/docs/getting-started) test suite is used when
performing linting checks locally, because [Jest](https://jestjs.io/docs/getting-started) does a phenomenal job
providing clearer, more detailed and more readable debugging information when the checks fail. Additionally,
[Jest](https://jestjs.io/docs/getting-started) provides the benefit of "watch mode" - which allows you to dynamically
make the changes and immediately see the checks pass as a result of the changes that were made.

### Database

#### Prisma

The Auth Server DB uses the [Prisma](https://www.prisma.io/) ORM that maps records in the database to typescript objects
while exposing a database client that can be used to interact with those records. To properly use this client, a
developer must understand how this ORM works.

##### Connect to Default Postgres Database

Since we do not know whether or not the database we are concerned with has been created yet, we connect to the default
database `postgres` since we can still run commands for other databases from that entry point.

```bash
$ psql -d postgres
```

###### Create the Database

If the database was not already created, we need to create it.

```bash
$ CREATE DATABASE <DATABASE_NAME>;
```

###### Create the Database User

If the user does not already exist, we need to create one in Postgres. Note that if different databases are using the
same user, the user may already have been created.

```bash
$ CREATE USER <DATABASE_USER> WITH PASSWORD '';
```

###### Grant Privileges to Database User

If the database was just created, or the user was just created, we need to grant access to the created or existing
database to the created or existing user.

```bash
$ GRANT ALL PRIVILEGES ON DATABASE <DATABASE_NAME> TO <DATABASE_USER>;
```

###### Assign User as Owner of Database

If the database was just created, or the user was just created, we need to assign the created or existing user as the
owner of the created or existing database.

```bash
$ ALTER DATABASE <DATABASE_NAME> OWNER TO <DATABASE_USER>;
```

###### Quit the Postgres Shell

```bash
$ \q
```

[psql]: https://www.postgresql.org/docs/current/app-psql.html
[homebrew]: https://brew.sh/
[postgresql]: https://www.postgresql.org/docs/current/app-psql.html
[nvm]: https://github.com/nvm-sh/nvm
[node]: https://nodejs.org/en/
[postgres]: https://www.postgresql.org/
[homepage]: ./ReadMe.md
[react]: https://reactjs.org/
[nextjs]: https://nextjs.org/
[prettier]: https://prettier.io/
[vscode]: https://code.visualstudio.com/
[stylelint]: https://stylelint.io/
[eslint]: https://eslint.org/
[jest]: https://jestjs.io/docs/getting-started
[sass]: https://sass-lang.com/
