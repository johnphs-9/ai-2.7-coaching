# Coaching Session 2.7: Refactoring the Guess Game with useReducer and useContext

## Overview

- **Duration:** ~3 hours (30 min Q&A, ~2 hours activity, 30 min debrief)
- **Prerequisites:** Lessons 2.4 (Guess Game), 2.5, and 2.6 (Context API and Reducers)

## Session Objectives

By the end of this session, you will be able to:

1. **Refactor** existing `useState` logic into a `useReducer` to centralise game state
2. **Create** a React Context to share data across components without prop drilling
3. **Connect** reducer-managed state to a context so that multiple components can read shared history

## Introduction

In Coaching 2.4, you built a number guessing game from scratch using `useState` and props. In Lesson 2.6, you learned two more powerful tools: `useReducer` for managing complex, related state in one place, and the Context API for sharing state across a component tree without threading props through every level.

This session gives you the chance to apply both tools to a problem you already know. You will start by refactoring the game's state logic into a reducer, then lift the score history into a context so it can be read by any component in the tree.

---

## Part 1: Q&A (30 minutes)

Before the activity begins, the floor is open for questions about anything from Lessons 2.5 and 2.6.

Come prepared with questions on topics you found unclear, patterns you want to understand better, or anything from the CRM exercises that did not quite make sense.

---

## Part 2: Activity (~2 hours)

### Starting Point

Open your Guess Game project from Coaching 2.4. Before writing any new code, make sure your game has the following features in place:

- A secret number generated randomly between 1 and 20
- A score that starts at 20 and decreases by 1 with each wrong guess
- A status that transitions to "won" when the player guesses correctly, or "lost" when the score reaches 0
- A "New Game" button that only appears after the game has ended, not during an active game

If your version from Coaching 2.4 is missing any of these, add them now before moving on.

> **Game rules:** The game starts at 20 points. Each wrong guess subtracts 1 point. The game ends when the player guesses correctly (won) or the score reaches 0 (lost). The "New Game" button only appears after the game has ended. Resetting mid-game is not allowed.

---

### Part 2A: Refactor State Logic with useReducer

The baseline uses `useState` with a state object and manual spread updates scattered across handler functions. Your task is to replace this with a `useReducer` so that all game state transitions are defined in one place.

The `input` field can remain as a separate `useState` - it is local UI state and does not belong in the reducer.

#### Task

Refactor `App.jsx` so that the game state (secret number, guesses, score, and status) is managed by a single reducer function. The component's handler functions should only dispatch actions; the transition logic should live entirely inside the reducer.

#### Hints

1. A reducer receives the current state and an action object, and returns the next state. Start by identifying the two actions this game needs: one for submitting a guess, and one for starting a new game.
2. Your guess action will need to carry the guessed value. Pass it as `action.payload`.
3. Move all the score and status logic that currently lives inside `handleGuess` into the reducer's case for the guess action.
4. `useReducer` returns `[state, dispatch]`. Replace calls to `setState(...)` with `dispatch({ type: "...", payload: ... })`.


**Check:** After refactoring, the game should behave identically to the baseline. The "New Game" button should not appear during an active game.

---

### Part 2B: Share Score History with useContext

Now that the game's score is managed by the reducer, you will lift the score history into a React Context so that any component in the tree can read it, without needing props to be passed down.

#### The Goal

Create a `ScoreHistoryContext` that accumulates the final score from each completed game. When a game ends (either won or lost), the final score is recorded in the context. A new `ScoreHistory` component will read from the context and display the list of past scores.

The score is only saved when a game is fully completed. It is not saved if the page is refreshed mid-game.

#### Task

1. Create `src/contexts/ScoreHistoryContext.jsx` that provides a list of past scores and a function to add a new score.
2. Wrap the `App` component with the provider in `src/main.jsx`.
3. In `App.jsx`, detect when a game has just ended and call the context's add function to save the final score.
4. Create a `ScoreHistory` component that reads from the context and renders the list of past scores.

#### Hints

1. The context value should expose two things: the `scoreHistory` array and an `addScore` function. Use `useState` inside the provider to hold the array.
2. In `App.jsx`, you need to call `addScore` at the moment the game transitions to "won" or "lost". A `useEffect` that watches `state.status` is a clean way to trigger this — think carefully about when you want it to fire.
3. The `ScoreHistory` component only needs to call `useContext` to get the history. It does not need any props.
4. If `scoreHistory` is empty, render a message such as "No games played yet." instead of an empty list.


**Check:** Play two or three games. After each game ends, the score history list below the game should grow by one entry.

---

## Part 3: Bonus Challenge - Player Credits (Optional)

This bonus challenge is independent of Part 2B. Attempt it after completing both parts above.

Create a `PlayerContext` that tracks a credit balance across games.

**Rules:**

- The player starts with 100 credits.
- Starting a new game costs 10 credits. The balance is deducted when the player clicks "New Game".
- If the player does not have enough credits (balance below 10), the "New Game" button is disabled and a message explains why.
- The credit balance is visible at all times, ideally in a persistent header above the game.

No reference solution is provided. Design the context shape, provider, and component structure yourself.

---

## Part 4: Debrief (30 minutes)

### Learner Presentations

Two volunteers will share their screen and walk through their solution. As you watch, consider:

- How did they structure the reducer's actions and state shape?
- Where did they place the `useEffect` that saves the score, and why?
- How did they structure their context provider?

### Instructor Walkthrough

After the presentations, the instructor will walk through the reference solution covering:

1. The reducer's state shape and the two action types
2. Why `getInitialState` is passed as an initialiser function rather than a value
3. The `ScoreHistoryProvider` pattern: what lives in the context versus what stays local
4. How `useContext` is used to consume the context in `App.jsx` and `ScoreHistory`
5. Why `useEffect` is used to trigger `addScore` rather than calling it during dispatch

---

## Summary

Here is what you practised today:

- **`useReducer`**: centralising related game state and all update logic into a single reducer function
- **Action design**: describing state changes as plain action objects with a `type` and optional `payload`
- **Context API**: sharing score history across the component tree without prop drilling
- **`useEffect` for side effects**: triggering a context update in response to a state transition, not during render

In the next lesson (2.8), you will learn React Router and use it to add multi-page navigation to the CRM app.
