## Developer Certificate of Origin and License

By contributing to GitLab B.V., you accept and agree to the following terms and
conditions for your present and future contributions submitted to GitLab B.V.
Except for the license granted herein to GitLab B.V. and recipients of software
distributed by GitLab B.V., you reserve all right, title, and interest in and to
your Contributions.

All contributions are subject to the Developer Certificate of Origin and license set out at [docs.gitlab.com/ce/legal/developer_certificate_of_origin](https://docs.gitlab.com/ce/legal/developer_certificate_of_origin).

_This notice should stay as the first item in the CONTRIBUTING.md file._

## Code of conduct

As contributors and maintainers of this project, we pledge to respect all people
who contribute through reporting issues, posting feature requests, updating
documentation, submitting pull requests or patches, and other activities.

We are committed to making participation in this project a harassment-free
experience for everyone, regardless of level of experience, gender, gender
identity and expression, sexual orientation, disability, personal appearance,
body size, race, ethnicity, age, or religion.

Examples of unacceptable behavior by participants include the use of sexual
language or imagery, derogatory comments or personal attacks, trolling, public
or private harassment, insults, or other unprofessional conduct.

Project maintainers have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct. Project maintainers who do not follow the
Code of Conduct may be removed from the project team.

This code of conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community.

Instances of abusive, harassing, or otherwise unacceptable behavior can be
reported by emailing contact@gitlab.com.

This Code of Conduct is adapted from the [Contributor Covenant](https://contributor-covenant.org), version 1.1.0,
available at [https://contributor-covenant.org/version/1/1/0/](https://contributor-covenant.org/version/1/1/0/).

## Getting Started

Thank you for your interest in contributing to Chronicle Core! This guide will help you get your development environment set up and walk you through the contribution process.

### Prerequisites

- Node.js (v20 or higher recommended)
- npm (v10 or higher)
- Git

### Setup

1.  **Fork and Clone the Repository:**
    - Fork the repository on GitLab.
    - Clone your fork locally:
      ```bash
      git clone <your-fork-url>
      cd chronicle-core
      ```

2.  **Install Dependencies:**
    This project uses `npm` to manage dependencies within an Nx monorepo. To install all the necessary packages, run the following command from the root of the project:
    ```bash
    npm install
    ```

## Project Structure

This repository is a monorepo managed by Nx. It contains several distinct applications and libraries. Here is a brief overview of the projects:

- `host-app`: The main desktop application that serves as the game screen.
- `mobile-app`: The React Native application for player interfaces.
- `backend`: The NestJS server that powers the game logic and state.
- `rule-engine`: A dedicated library for handling core TTRPG rules and mechanics.
- `llm-orchestrator`: Manages communication with the cloud-based LLM.
- `data-models`: Contains TypeScript interfaces and classes for core game data.
- `core-data`: Shared data and types used across multiple projects.
- `ui-shared`: Shared React components used by both `host-app` and `mobile-app`.
- `host-app-e2e`: End-to-end tests for the host application.
- `backend-e2e`: End-to-end tests for the backend server.

## Development Workflow

Nx provides powerful commands to manage the development process. For a detailed guide on all available commands and their options, see the [Development Guide](./DEVELOPMENT_GUIDE.md).

### Running Applications

- **Serve the Host App:**
  ```bash
  npx nx serve host-app
  ```
- **Run the Backend Server:**
  ```bash
  npx nx serve backend
  ```

### Running Tests

The project uses Jest for unit tests and Playwright for end-to-end (E2E) tests.

- **Run all unit tests:**
  ```bash
  npx nx test --all
  ```
- **Run unit tests for a specific project (e.g., `rule-engine`):**
  ```bash
  npx nx test rule-engine
  ```
- **Run all E2E tests:**
  ```bash
  npx nx e2e --all
  ```
- **Run E2E tests for a specific project (e.g., `host-app-e2e`):**
  ```bash
  npx nx e2e host-app-e2e
  ```

### Linting and Formatting

We use ESLint for linting and Prettier for code formatting to maintain code quality and consistency.

- **Check for linting errors:**
  ```bash
  npx nx lint --all
  ```
- **Automatically fix linting errors:**
  ```bash
  npx nx lint --all --fix
  ```
- **Check for formatting issues:**
  ```bash
  npx nx format:check
  ```
- **Apply formatting:**
  ```bash
  npx nx format:write
  ```

## Submitting Changes

1.  **Create a New Branch:**
    Create a descriptive branch name for your feature or bug fix.
    ```bash
    git checkout -b my-new-feature
    ```

2.  **Make Your Changes:**
    Make your code changes, ensuring they follow the project's coding style and conventions.

3.  **Test Your Changes:**
    Run the relevant tests to ensure your changes work as expected and do not introduce any regressions.

4.  **Commit Your Changes:**
    Follow the conventional commit message format (e.g., `feat: Add new feature`, `fix: Resolve bug`).

5.  **Push and Create a Merge Request:**
    Push your branch to your fork and open a Merge Request to the main repository. Provide a clear description of your changes in the MR.
