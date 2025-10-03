# Chronicle Core: System Architecture

This document provides a high-level overview of the Chronicle Core system architecture. It is intended for developers who want to understand the structure of the project, the responsibilities of each module, and how they interact.

## Core Architectural Principles

The design of Chronicle Core is guided by a set of core principles that ensure a robust, scalable, and maintainable system.

-   **Modularity**: The system is divided into distinct, loosely coupled modules with well-defined responsibilities. This is managed within an Nx monorepo, which allows for clear separation of concerns while maintaining a unified codebase.
-   **Separation of Concerns**: There is a strict separation between the **narrative AI** and the **deterministic game engine**.
    -   The **LLM Orchestrator** manages the creative, narrative aspects of the game (plot, descriptions, NPC dialogue).
    -   The **Rule Engine** handles all deterministic game mechanics (dice rolls, combat math, physics). The LLM's outputs must conform to the rules enforced by this engine.
-   **Data-Driven Design**: Game content, including rules, lore, and assets, is loaded from external `content_packs/`. This allows for easy modding and content updates without changing the source code.
-   **Cross-Platform User Interfaces**: The frontend is split between a main `host-app` (for a large screen display) and a `mobile-app` (for player input), both sharing components via a `ui-shared` library.

## Module Breakdown

The monorepo is organized into the following key projects (applications and libraries):

### Applications

-   `host-app`: This is the main frontend application, built with React. It serves as the primary display for the game world, maps, and narrative text, intended to be shown on a TV or large monitor.
-   `mobile-app`: A React Native application that provides each player with a personal interface on their mobile device. Players use this to manage their character, make decisions, and take actions.
-   `backend`: A NestJS application that serves as the central server. It manages the game state, facilitates communication between the host app and mobile clients via WebSockets, and orchestrates the other backend modules.

### Backend and Core Logic Libraries

-   `rule-engine`: A critical library responsible for executing all deterministic game mechanics. It handles combat calculations, skill checks, dice rolls, and enforces the core rule set. It is designed to be completely independent of the LLM to ensure fairness and prevent rule "hallucinations."
-   `llm-orchestrator`: This module is responsible for all interactions with the external Large Language Model (LLM). It constructs prompts, sends them to the AI, and processes the narrative responses. It queries other modules (like `data-models`) for context to ground the LLM's outputs in the established game world.
-   `game-session`: Manages the lifecycle of a game session, including loading and saving game state, tracking player progress, and coordinating the overall flow of the game.
-   `data-models`: Defines the core data structures and TypeScript interfaces for the entire application (e.g., `Player`, `Character`, `Item`, `Quest`). It also includes validation schemas for the data loaded from `content_packs/`.
-   `core-data`: A library for shared constants, enums, and static data that is used across multiple projects.

### Shared UI and Testing

-   `ui-shared`: A library of shared React components used by both the `host-app` and `mobile-app` to ensure a consistent user experience.
-   `host-app-e2e`: Contains Playwright end-to-end tests specifically for the `host-app`.
-   `backend-e2e`: Contains end-to-end tests for the `backend` server API.

## Data and Communication Flow

1.  **Player Action**: A player initiates an action through the `mobile-app`.
2.  **WebSocket Communication**: The action is sent to the `backend` server via a WebSocket connection.
3.  **Action Processing**: The `backend` receives the action and forwards it to the `game-session` module.
4.  **Rule Engine Invocation**: If the action requires a rules check (e.g., a skill check or attack), the `game-session` invokes the `rule-engine`, which returns a deterministic outcome.
5.  **LLM Orchestration**: For narrative actions, the `game-session` instructs the `llm-orchestrator` to generate a description of the outcome. The orchestrator may pull data from `data-models` to provide the LLM with the necessary context.
6.  **State Update**: The `game-session` updates the game state based on the outcome.
7.  **Broadcast to Clients**: The `backend` broadcasts the updated game state and narrative text to the `host-app` and all connected `mobile-app` clients.
8.  **UI Update**: The `host-app` and `mobile-app` update their interfaces to reflect the new game state.

This architecture ensures that the creative, unpredictable nature of the AI is balanced with a fair and consistent set of rules, providing a unique and robust TTRPG experience.