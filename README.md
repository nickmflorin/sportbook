# Sportbook

Sportbook is a web application for managing social and competitive (non-professional) sport leagues (and everything in
between).

&copy; Nick Florin, 2023

### System Requirements

- [nvm]: A [node] version manager.
- [Node][node] v19
- [homebrew]: A MacOSX package manager.
- [postgresql] ([homebrew] package)

## 1. Getting Started

This section of the documentation outlines - at a high level - how to setup your machine for local development for the
first time. For more detailed explanations related to local development or production deployments, see the next section;
"Development".

**Note**: _This documentation describes how to setup and configure the application for local development on \_MacOSX_.
Many of the steps outlined in this section may also be applicable for a Windows/Ubuntu machine as well, but the steps
will not be exactly as they are described here.\_

### Step 1.1: Repository

Clone this repository locally and `cd` into the directory.

```bash
$ git clone git@github.com:nickmflorin/sportbook.git
```

### Step 1.2: Installing System Requirements

This section walks through how to install and configure the prerequisites (System Requirements) for this project.

#### 1.2.a [Node][node]

[Node][node] is the engine that supports the application. This project uses [node] v19.0.0. Your machine will most
likely already have a system installation of [node], but even if it does not - that is okay, we will not be using the
system installation of [node] but will rather isolate the version of [node] being used for this project to this
repository using [nvm].

**Important**: _Do not use a system installation of [node]. It will complicate your development environment. Instead,
see the next section for details about usage of [nvm]._

##### 1.2.a.i Installing [nvm]

It is strongly recommended that you use [nvm] to manage the version(s) of [node] that are being used for this project,
rather than system installations. It will allow you to more easily isolate the version of [node] being used for this
project to the project directory, avoiding conflicts with global or system installations of [node].

Instructions for installing [nvm] can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating), but are
also mentioned below for purposes of completeness:

First, simply run the install script:

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

The above command will download a script and then run it. The script it runs will first clone the [nvm] repository at
`~/.nvm` and then attempt to add the following source lines to your machine's shell profile script (which may be either
`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc` - depending on your OS):

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
changes to take effect, you need to subsequently source your shell profile script (`~/.zshrc` in this example):

```bash
$ . ~/.zshrc`
```

Finally, verify that your system recognizes the `nvm` command by running the following:

```bash
$ nvm
```

##### 1.2.a.ii Node Version

Now that [nvm] is installed, we need to use it to establish the correct version of [node], 19, that is suitable for this
project. This project's repository comes equipped with a `.nvmrc` file that automatically tells [nvm] what version of
[node] to use - but that version may still need to be installed.

First, instruct [nvm] to use the [node] version specified by the `.nvmrc` file with the following command:

```bash
$ nvm use
```

If you see an output similar to the following:

```bash
Found '/<path-to-repository>/sportbook/.nvmrc' with version <v19.0.0>
Now using node v19.0.0 (npm v8.6.0)
```

It means that the correct version of [node] that is required for this project is already installed with [nvm] and that
version of [node] is active for this project's directory. The rest of this step can be skipped and you can proceed to
the next step, "1.2.a.iii: Homebrew".

On the other hand, if you see an error similar to the following:

```bash
Found '/<path-to-repository>/sportbook/.nvmrc' with version <v19.0.0>
N/A: version "v19.0.0 -> N/A" is not yet installed.

You need to run "nvm install v19.0.0" to install it before using it.
```

It means that the correct version of [node] that is required for this project is not already installed with [nvm], and
must be installed before using it. To do this, simply run the following command from the root of the project repository:

```bash
$ nvm install
```

This command will use [nvm] to install the correct version of [node] that is required for this project, based on the
specification in the project's `.nvmrc` file.

Finally, all that is left to do is to instruct [nvm] to use this version of [node] by executing the following command -
again, from the root of the project repository;

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
$ v19.x.x
```

At this point, if [nvm] is not pointing at the correct version of [node] or is pointing at a system installation of
[node], something went awry - consult a team member before proceeding.

### 1.2.a.iii: Homebrew

If on MacOSX, you will need to install [homebrew], which is a MacOSX package manager.

### Step 1.3: Environment

#### 1.3.a ENV File

When running the application locally, there will likely be additional keys that you need to add to your environment
without committing them to source control. There are two files that are used to define environment variables that the
application relies on locally, without committing them to source control:

1. `.env.local`
2. `.env.development.local`

Both of these files will not be in the cloned repository by default (because they are not committed to source control)
and will likely need to be created. The `.env.local` file takes precedence over the `.env.development.local` file, but
both take precedence over all other `.env.*` files (when the `NODE_ENV` is `"development"`).

**Note:** _Sensitive keys, tokens or keys related to access control should **only** ever be added to `.env.local` or
`.env.development.local`. Other environment files (`.env`, `.env.development`, .etc) are committed to source control,
and should **never** contain sensitive information._

For this step, it is best to reach out to a team member for the additional keys that you will need in your
`.env.development.local` or `.env.local` file.

For more information regarding the environment variables, refer to section 2.5.

#### 1.3.b: Dependencies

When setting up the environment for the first time, you must do a fresh install of the dependencies.

Before installing the dependencies, you will need to be given an environment variable, `FONT_AWESOME_AUTH_TOKEN`, that
is required to install certain dependencies. Currently, this application uses a "pro" license for
[FontAwesome][fontawesome] to support the icons in the application. There are [FontAwesome][fontawesome]-related
packages in the `package.json` file that require an authenticated, "pro" license key to be in the environment when
installing the packages.

**Note**: This authentication token is only required if the [FontAwesome][fontawesome]-related packages have not already
been installed to your `./node_modules` folder - which will likely only ever be when setting up the environment for the
first time or after deleting the `./node_modules` folder manually.

Consult a team member for the `FONT_AWESOME_AUTH_TOKEN` environment variable, and add it to your `.env.local` or
`.env.development.local` file. Once that environment variable is defined, you can do a fresh install of the
dependencies:

```bash
$ npm install
```

This will install the project dependencies in the `package.json` file.

##### FontAwesome Caveat

Currently, this application uses a "pro" license for [FontAwesome][fontawesome] to support the icons in the application.
There

### Step 1.4: Database

This project uses a [postgres] database for both production and local development. First, check to see if your machine
already has [postgres] installed:

```bash
$ which postgres
```

If the result of the command is a directory (usually `/usr/local/bin/postgres`, if installed via [homebrew]), then it is
already installed and you can proceed to the next step. If not, simply install [postgres] via [homebrew]:

```bash
$ brew install postgres
```

The [postgres] installation will come equipped with [psql], which is [postgres]'s command line tool. Once [postgres] is
installed, or you have verified that your machine already has a [postgres] installation, we need to start the [postgres]
server:

```bash
$ brew services start postgresql
```

#### 1.4.a Database Environment Variables

The database connection parameters for the application are defined in the relevant `.env.*` files. In local development,
they will be defaulted in the `.env.development` file, but can be overridden in your `.env.local` or
`.env.development.local` files.

These database connection parameters are used to construct a URL connection string that points to the application
database, which is used by the [prisma] ORM (more on this later) to connect to the application database.

When defining the parameters, they can either be defined explicitly as the `DATABASE_URL`:

```bash
DATABASE_URL=postgresql://${user}:${password}@${host}:${port}/${name}
```

or each parameter in the URL connection string can be defined individually:

```bash
DATABSE_NAME="..."
DATABASE_PORT=xxxx
DATABASE_HOST="..."
DATABASE_USER="..."
DATABASE_PASSWORD="..."
```

If the `DATABASE_URL` parameter is defined in the environment, the application will connect to the database at that URL.
If it is not defined, the application will attempt to connect to a database at a URL constructed with the other
parameters.

#### 1.4.b Setting Up Application Database

The above database connection parameters defined in the `.env.development` file (or overridden in your `.env.local` or
`.env.development.local` file) will be needed to create and setup the application database from the [psql] shell. Since
the database defined by `DATABASE_NAME` or the `DATABASE_URL` may not exit yet, we will likely need to create it via the
[psql] command line. To do this, connect to the default database name `"postgres"`, that comes with the [homebrew]
installation of [postgres]:

```bash
$ psql -d postgres
```

##### 1.4.b.i Troubleshooting

It is possible (although very unlikely) that either your [postgres] installation did not come with the default
`"postgres"` database, or it was somehow removed. If this is the case, you may see an error similar to the following:

```bash
$ psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  database "postgres" does not exist
```

If you see this error, you cannot connect to the [psql] shell because there are no databases to connect to. To fix this,
simply run the following from the command line, and then reconnect to the [psql] shell:

```bash
$ createdb postgres
$ psql -d postgres
```

##### 1.4.b.ii Creating the Database

Once inside of the [psql] shell, create the appropriate [postgres] database associated with this application, based on
the configuration parameters defined in the environment:

```bash
$ CREATE DATABASE <DATABASE_NAME>;
```

Then, create the [postgres] user associated with the configuration variables defined in the environment and subsequently
grant all privileges to that user:

```bash
$ CREATE USER <DATABASE_USER> WITH PASSWORD '<DATABASE_PASSWORD>';
$ GRANT ALL PRIVILEGES ON DATABASE <DATABASE_NAME> TO <DATABASE_USER>;
```

Finally, assign the created or existing user as the owner of the created or existing database.

```bash
$ ALTER DATABASE <DATABASE_NAME> OWNER TO <DATABASE_USER>;
```

##### 1.4.b.iii Assigning Permissions to Create Database

In the above section, a database with name `<DATABASE_NAME>` was created and the appropriate permissions on that
database were assigned to the database user, `<DATABASE_USER>`. However, we still need to allow the `<DATABASE_USER>` to
create new databases (versus just modifying the existing database). This is required for [prisma] migrations to properly
function.

To do this, simply give the database user, `<DATABASE_USER>`, the required permissions to create databases so [prisma]
migrations can function properly:

```bash
$ ALTER USER <DATABASE_USER> CREATEDB;
```

Now, the database user, `<DATABASE_USER>`, will be able to create databases in the [postgres] service and [prisma]
migrations will properly function.

You can now quit the [psql] shell:

```bash
$ \q
```

The application should now be ready to connect to the database for local development.

## 2. Development

This section of the documentation describes various interactions that you will need to understand in order to properly
work with this application locally. This section assumes that you have already completed the steps outlined in the prior
section, "Getting Started".

### 2.1 IDE

This project is optimized for development using the [VSCode][vscode] IDE. While other IDEs may also work in this
repository, you must take steps to ensure that our editor configurations (like trimmed whitespace, indentation, and
`prettyprint` with [Prettier][prettier]) that are applied to this repository while using [VSCode][vscode] are also
consistently applied in your IDE. This ensures that your commits will conform to the established repository style.

### 2.2 Running Locally

After pulling down the latest state of the repository, the development server can be started by running the following
command:

```bash
$ npm run dev
```

**Note**: If changes were made to the `package.json` file, you may need to install the dependencies via `npm install`.

### 2.3 Building

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

You can also accomplish this via the `build-local` command, which is defined in the `package.json` file:

```bash
$ npm run build-local
```

**Note**: [NextJS][nextjs] will also automatically perform linting checks during the `build` process - any linting
errors will result in the build failing automatically but linting warnings will not. This includes linting performed by
[ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier].

### 2.4 Linting

This project uses [ESLint][eslint] to lint files that are not CSS or SCSS based, [Stylelint][stylelint] to lint files
that are CSS or SCSS based, and [Prettier][prettier] inside of the [ESLint][eslint] configuration which is responsible
for formatting files of all types. Both [ESLint][eslint] and [Stylelint][stylelint] are configured to automatically
format the file when the file is saved (a configuration that is defined in `./vscode/settings.json`). If that is not
desirable, you can easily turn that setting off in yoru local [VSCode][vscode] settings.

#### 2.4.a Formatting & Code Style

The philosophy that the project has in regard to formatting and/or code styles can be summarized as follows:

> There is usually not a right or wrong answer, but it is better to choose than to not.

In other words, many formatting rules were not chosen for a specific reason other than having a decision. It is better
to rely on the available formatting tools to remove as much ambiguity as possible, rather than spending time debating or
arguing the rules themselves.

#### 2.4.b Performing Linting Checks

[NextJS][nextjs] will automatically perform linting checks during the `build` process, but it is desired that they be
performed independently without performing the entire `build` process, use the following command:

```bash
$ npm run lint
```

This will run [ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier] (via [ESLint][eslint]) on the project.

With that being said, the project's [Jest][jest] testing suite is configured to perform linting and formatting checks
via [ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier] as well. This is the recommended way to perform
the checks, because the output is much, much more suitable for debugging and the hot reloading feature of [Jest][jest]
will save you a lot of time.

This can be done simply as:

```bash
$ npm run test
```

For more information related to [Jest][jest] and the linting checks it performs, please see the section further down in
this documentation, "Testing".

#### 2.4.c Automatically Fixing [ESLint][eslint] Violations

Some [ESLint][eslint] violations can be automatically fixed by [ESLint][eslint] itself. This can be performed via the
`eslint-fix` command, which is defined in the `package.json` file:

```bash
$ npm run eslint-fix
```

This command will automatically fix and format all [ESLint][eslint] and [Prettier][prettier] violations in the
repository that are capable of being auto-fixed.

### 2.5 Environment

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

#### 2.5.a Local Overrides

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

### 2.6 Testing

This documentation is intended to outline configurations, patterns and methodologies that are used to test the Console
application.

## [Jest](https://jestjs.io/docs/getting-started) Testing Suite

We use [Jest](https://jestjs.io/docs/getting-started) to handle integration and unit testing in the Console. The entire
test suite can be run with the following command:

```bash
$ npm run test
```

#### 2.6.a Projects

Originally, there was only one configuration file for the testing suite, `jest.config.ts`. However, due to the
complexities of some of the tests that have to be run, the configuration had to be split up into
[projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig), such that certain tests can use
different sets of configuration parameters that would not otherwise be possible with a single configuration.

The [Jest](https://jestjs.io/docs/getting-started) testing suite is broken down into 6
[projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig):

1. **Functional Unit Tests**: Unit tests that are run against functional utilities or logic in `src/lib`.
2. **Component Tests**: Both unit tests & snapshot tests that are run against components in `src/components`.
3. **Prettier**: Prettier checks that are performed against relevant files in the project.
4. **ESLint**: ESLint checks that are performed against non `.scss` files in the project.
5. **Stylelint**: Stylelint checks that are performed against `scss` files in the project.

The following table describes the various aspects of each individual [Jest](https://jestjs.io/docs/getting-started)
project in the application:

|        Project        |              Config File              |       Files Tested        |       Test Files Located        |
| :-------------------: | :-----------------------------------: | :-----------------------: | :-----------------------------: |
| Functional Unit Tests |    `src/tests/unit/jest.config.ts`    |           `.ts`           |        `!src/components`        |
|    Component Tests    | `src/tests/components/jest.config.ts` |          `.tsx`           |        `src/components`         |
|       Prettier        |       `jest.config.prettier.ts`       |       All Relevant        |               N/A               |
|        ESLint         |        `jest.config.eslint.ts`        | All Relevant, non `.scss` |               N/A               |
|       Stylelint       |      `jest.config.stylelint.ts`       |          `.scss`          | `src/styles` & `src/components` |

#### 2.6.b Linting

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

### 2.7 Database

This section of the documentation outlines how to manage the application database as it relates to this application.

#### [postgres]

When developing locally, it is important that the [postgres] server is running. This service can be started via
[homebrew] as follows:

```bash
$ brew services start postgresql
```

Restarting the [postgres] service can be done as follows:

```bash
$ brew services restart postgresql
```

Stopping the [postgres] service can be done as follows:

```bash
$ brew services stop postgresql
```

#### 2.7.a Prisma

This application uses [Prisma][prisma], an ORM that that maps records in the database to typescript objects while
exposing a database client that can be used to interact with those records. To properly use this client, a developer
must understand how this ORM works.

##### 2.7.a.i Schema

The database structure for the application is defined in a [prisma] `*.schema` file. This application's `*.schema` file
is located at [`src/prisma/schema.prisma`](./src/prisma/schema.prisma). The [prisma] ORM uses the definitions in that
file to properly construct, update and manage the [postgres] database.

When updates are made to the [prisma] schema file, migrations must be run such that [prisma] can digest those changes
and make the appropriate updates to the database structure. This can be done as follows:

```bash
$ npx prisma migrate dev
```

This command will prompt [prisma] to update the database structure if changes were detected. If [prisma] detects
changes, it will prompt you for a name that should be assigned to the accompanied migration file (stored
[here](./src/prisma/migrations/)). The name of the migration file should be a snake-cake name that is indicative of the
changes that were made (i.e. "add_updated_at_field_to_user").

If it is desired that just the migration file is created (without actually updating the database), the `--create-only`
flag can be used:

```bash
$ npx prisma migrate dev --create-only
```

This will create the migration file, but will not apply it.

##### 2.7.a.ii `PrismaClient`

The [`PrismaClient`](./src/server/db/index.ts) is what the application uses to communicate with the database. This
client ([`prisma`](./src/server/db/index.ts)) relies on type bindings that are dynamically generated by [prisma] based
on the existing schema file. This means that whenever the schema file changes, the types for the
[`PrismaClient`](./src/server/db/index.ts) will be incorrect until the [`PrismaClient`](./src/server/db/index.ts) is
regenerated.

This can be done as follows:

```bash
$ npx prisma db push
```

Note that when running the `reset` command (discussed below), the [`PrismaClient`](./src/server/db/index.ts) is
automatically updated.

##### 2.7.a.iii Seeding

The application comes equipped with a databae seed file [`./src/prisma/seed.ts](./src/prisma/seed.ts). This file is used
to populate the database with dummy data/fixtures for development. This script can be run as:

```bash
$ npx prisma db seed
```

That being said, this seed process _only_ works when the database state is empty - if the database state is not empty,
unique constraint violations will be triggered when adding data to the database. Therefore, in order to run the
[`./src/prisma/seed.ts](./src/prisma/seed.ts) script, it must be done as a part of [prisma]'s `reset` flow:

```bash
$ npx prisma migrate reset
```

This command will wipe the current database, run all migrations and _then_ run the
[`./src/prisma/seed.ts](./src/prisma/seed.ts) script.

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
[prisma]: https://www.prisma.io/
[fontawesome]: https://fontawesome.com/docs
