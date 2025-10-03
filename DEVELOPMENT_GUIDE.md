# Chronicle Core: Development and Build Guide

This guide provides a comprehensive overview of the development and build processes for the Chronicle Core project. It is intended to be a deep dive into the `nx` command-line interface (CLI) and how it is used to manage this monorepo.

For a higher-level overview of how to get started and contribute, please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## Core Nx Concepts

Nx is a powerful build system that provides tools for managing monorepos. Understanding a few core concepts is key to working effectively with this project.

-   **Projects**: The monorepo is divided into "projects," which can be applications or libraries. You can see a full list of projects by running `npx nx show projects`.
-   **Targets**: These are tasks that can be run on a project, such as `build`, `serve`, `test`, or `lint`. Targets are defined in each project's `project.json` file.
-   **Executors**: An executor is a function that performs the actions defined by a target. For example, the `@nx/jest:jest` executor runs Jest tests.

## Common Development Commands

The following commands are essential for day-to-day development.

### Running a Single Task: `nx run`

The `nx run` command (or its shorthand) is the primary way to execute a target on a specific project.

**Syntax:** `npx nx <target> <project>` or `npx nx run <project>:<target>`

**Examples:**

-   **Serve the host application for development:**
    ```bash
    npx nx serve host-app
    ```
-   **Build the backend for production:**
    ```bash
    npx nx build backend --configuration=production
    ```
-   **Run unit tests for the `rule-engine` library:**
    ```bash
    npx nx test rule-engine
    ```

### Running a Task on Multiple Projects: `nx run-many`

To run the same target on multiple projects at once, use `run-many`.

**Syntax:** `npx nx run-many --target=<target> --projects=<project1>,<project2>`

**Example:**

-   **Test both the `rule-engine` and `data-models` libraries:**
    ```bash
    npx nx run-many --target=test --projects=rule-engine,data-models
    ```

### Generating Code: `nx generate`

Nx can scaffold new projects, components, and libraries using generators.

**Syntax:** `npx nx generate <generator-name> <options>`

**Example:**

-   **Create a new library within the monorepo:**
    ```bash
    npx nx generate @nx/js:library --name=my-new-lib
    ```
-   **Generate a new component in the `ui-shared` library:**
    ```bash
    npx nx generate @nx/react:component --name=MyComponent --project=ui-shared
    ```

## Optimizing with "Affected" Commands

One of the most powerful features of Nx is its ability to identify which projects have been affected by your changes. This allows you to run tasks only on the code that needs it, which is incredibly efficient, especially in a large monorepo.

-   **Run tests on all affected projects:**
    ```bash
    npx nx affected --target=test
    ```
-   **Build all affected applications:**
    ```bash
    npx nx affected --target=build
    ```
-   **Lint all affected code:**
    ```bash
    npx nx affected --target=lint
    ```

Nx determines the "affected" projects by comparing your current `HEAD` with a baseline, which is `main` by default.

## Visualizing the Project: `nx graph`

To understand the dependencies between the projects in this monorepo, you can generate an interactive dependency graph.

-   **Open the graph in your browser:**
    ```bash
    npx nx graph
    ```
-   **Focus on a specific project:**
    You can use the graph's UI to filter and focus on specific projects to see their direct and indirect dependencies.

This is an invaluable tool for visualizing the architecture and understanding the impact of your changes.

## Caching and Performance

Nx uses a sophisticated caching system to avoid re-running tasks that have already been completed. If you run the same command twice without changing any files, the second run will be almost instantaneous because Nx will restore the results from its cache.

-   **Clearing the Cache**: If you ever need to clear the cache to ensure a fresh run, you can use the `reset` command:
    ```bash
    npx nx reset
    ```

This caching mechanism applies to all `nx` tasks and is a key factor in maintaining a fast and efficient development workflow.