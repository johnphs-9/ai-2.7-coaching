# Coaching Session 2.7: Refactoring the Guess Game with useReducer and useContext

## Overview

- **Duration:** ~3 hours (30 min Q&A, ~2 hours activity, 30 min debrief)
- **Prerequisites:** Lessons 2.4 (Guess Game), 2.5, and 2.6 (Context API and Reducers)

## Session Objectives

By the end of this session, you will be able to:

1. **Refactor** existing `useState` logic into a `useReducer` to centralise game state
2. **Create** a React Context to share reducer state and dispatch across components without prop drilling

## Introduction

In Coaching 2.4, you built a number guessing game from scratch using `useState` and props. In Lesson 2.6, you learned two more powerful tools: `useReducer` for managing complex, related state in one place, and the Context API for sharing state across a component tree without threading props through every level.

This session gives you the chance to apply both tools to a problem you already know. You will start by refactoring the game's state logic into a reducer, then lift that reducer into a context so its state and dispatch function can be read by any component in the tree without being passed down as props.

> **Note:** The Guess Game's component tree is shallow, so passing props down is not actually a problem here. The point of Part 2B is to practise the mechanics of Context, so you are ready to reach for it later, on a component tree deep enough that prop drilling is a real problem.

---

## Part 1: Q&A (30 minutes)

Before the activity begins, the floor is open for questions about anything from Lessons 2.5 and 2.6.

Come prepared with questions on topics you found unclear, patterns you want to understand better, or anything from the CRM exercises that did not quite make sense.

---

## Part 2: Activity (~2 hours)

### Starting Point

Use the `guess-game` starter project provided alongside this lesson. It already includes everything you built in Coaching 2.4, plus scoring:

- A secret number generated randomly between 1 and 20
- A score that starts at 20 and decreases by 1 with each wrong guess
- A status that transitions to "won" when the player guesses correctly, or "lost" when the score reaches 0
- A "New Game" button that only appears after the game has ended, not during an active game

All of this is currently managed with `useState` in `App.jsx`.

> **Game rules:** The game starts at 20 points. Each wrong guess subtracts 1 point. The game ends when the player guesses correctly (won) or the score reaches 0 (lost). The "New Game" button only appears after the game has ended. Resetting mid-game is not allowed.

---

### Part 2A: Refactor State Logic with useReducer

The starter uses four separate `useState` calls (`secretNumber`, `guesses`, `score`, `status`), each updated independently inside `guessHandler` and `resetHandler`. Your task is to replace these with a single `useReducer` so that all game state transitions are defined in one place.

The input field inside `GuessInput.jsx` can remain as its own `useState` — it is local UI state and does not belong in the reducer.

#### Task

Refactor `App.jsx` so that the game state (secret number, guesses, score, and status) is managed by a single reducer function. `guessHandler` and `resetHandler` should only dispatch actions; the transition logic should live entirely inside the reducer.

#### Hints

1. A reducer receives the current state and an action object, and returns the next state. Start by identifying the two actions this game needs: one for submitting a guess, and one for starting a new game.
2. Your guess action will need to carry the guessed value. Pass it as `action.payload`.
3. Move all the score and status logic that currently lives inside `guessHandler` into the reducer's case for the guess action.
4. `useReducer` returns `[state, dispatch]`. Replace calls to `setSecretNumber`, `setGuesses`, `setScore`, and `setStatus` with a single `dispatch({ type: "...", payload: ... })`.
5. Pass `state.secretNumber`, `state.guesses`, `state.score`, and `state.status` down to `GameStatus`, `GuessInput`, and `GuessList` in place of the separate variables.

<details>
<summary>Reference solution</summary>

Create `src/reducers/gameReducer.js`:

```js
// src/reducers/gameReducer.js
export function getInitialState() {
  return {
    secretNumber: Math.floor(Math.random() * 20) + 1,
    guesses: [],
    score: 20,
    status: "playing", // "playing" | "won" | "lost"
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "SUBMIT_GUESS": {
      const guess = action.payload;
      const isCorrect = guess === state.secretNumber;
      const newScore = isCorrect ? state.score : Math.max(0, state.score - 1);
      const newStatus = isCorrect ? "won" : newScore === 0 ? "lost" : "playing";

      return {
        ...state,
        guesses: [...state.guesses, guess],
        score: newScore,
        status: newStatus,
      };
    }
    case "NEW_GAME":
      return getInitialState();
    default:
      return state;
  }
}
```

Update `src/App.jsx`:

```jsx
// src/App.jsx
import { useReducer } from "react";

import GameStatus from "./components/GameStatus";
import GuessInput from "./components/GuessInput";
import GuessList from "./components/GuessList";
import { gameReducer, getInitialState } from "./reducers/gameReducer";
import styles from "./App.module.css";

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  const lastGuess = state.guesses[state.guesses.length - 1];

  const guessHandler = (guess) => {
    dispatch({ type: "SUBMIT_GUESS", payload: guess });
  };

  const resetHandler = () => {
    dispatch({ type: "NEW_GAME" });
  };

  return (
    <div className={styles.game}>
      <h1>Guess the Number</h1>
      <p>I am thinking of a number between 1 and 20.</p>
      <p>Score: {state.score}</p>

      <GameStatus
        secretNumber={state.secretNumber}
        lastGuess={lastGuess}
        status={state.status}
      />
      <GuessInput onGuess={guessHandler} disabled={state.status !== "playing"} />
      {state.status !== "playing" && (
        <button
          type="button"
          className={styles.resetButton}
          onClick={resetHandler}
        >
          New Game
        </button>
      )}
      <GuessList guesses={state.guesses} secretNumber={state.secretNumber} />
    </div>
  );
}

export default App;
```

> **Why pass `getInitialState` as the third argument to `useReducer`?** When you pass a function as the third argument (the initialiser), React calls it once on mount to compute the initial state. Writing `useReducer(gameReducer, getInitialState())` instead would call `getInitialState()` on every render, even though the result is only used on the first one.

</details>

**Check:** After refactoring, the game should behave identically to the starter. The "New Game" button should still only appear once the game has ended.

---

### Part 2B: Share the Reducer with useContext

`GameStatus`, `GuessInput`, and `GuessList` currently receive `state` values and handler functions as props from `App`. In this part, you will move the reducer itself into a Context, so these components can read `state` and `dispatch` directly, without `App` passing anything down.

#### Task

1. Create `src/contexts/GameContext.jsx` that creates a context and a `GameProvider` component. The provider should call `useReducer` (moving it out of `App.jsx`) and expose `{ state, dispatch }` as the context value.
2. Wrap the game tree with `GameProvider`, either in `main.jsx` or inside `App.jsx`.
3. Update `GameStatus`, `GuessInput`, and `GuessList` to read `state` and `dispatch` via `useContext(GameContext)` instead of receiving them as props.
4. `App.jsx` should no longer call `useReducer` directly, and should no longer pass `state` or handler props to its children.

#### Hints

1. `createContext` needs a default value. You can pass `null`, since the component tree is always wrapped in the provider.
2. Each consuming component will need to import both `useContext` and the `GameContext` object, then call `const { state, dispatch } = useContext(GameContext);` at the top of the component.
3. `guessHandler` and `resetHandler` can now live inside `GuessInput` and `App` respectively, calling `dispatch` directly from the context, since there is no longer a prop to pass them through.
4. `GuessItem` does not need the context. It only needs the two props it already receives from `GuessList`; leave it as it is.

<details>
<summary>Reference solution</summary>

Create `src/contexts/GameContext.jsx`:

```jsx
// src/contexts/GameContext.jsx
import { createContext, useReducer } from "react";

import { gameReducer, getInitialState } from "../reducers/gameReducer";

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
```

Update `src/main.jsx` to wrap the app with the provider:

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GameProvider } from "./contexts/GameContext";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
```

Update `src/App.jsx`:

```jsx
// src/App.jsx
import { useContext } from "react";

import GameStatus from "./components/GameStatus";
import GuessInput from "./components/GuessInput";
import GuessList from "./components/GuessList";
import { GameContext } from "./contexts/GameContext";
import styles from "./App.module.css";

function App() {
  const { state, dispatch } = useContext(GameContext);

  const resetHandler = () => {
    dispatch({ type: "NEW_GAME" });
  };

  return (
    <div className={styles.game}>
      <h1>Guess the Number</h1>
      <p>I am thinking of a number between 1 and 20.</p>
      <p>Score: {state.score}</p>

      <GameStatus />
      <GuessInput />
      {state.status !== "playing" && (
        <button
          type="button"
          className={styles.resetButton}
          onClick={resetHandler}
        >
          New Game
        </button>
      )}
      <GuessList />
    </div>
  );
}

export default App;
```

Update `src/components/GameStatus.jsx`:

```jsx
// src/components/GameStatus.jsx
import { useContext } from "react";

import { GameContext } from "../contexts/GameContext";
import styles from "./GameStatus.module.css";

function GameStatus() {
  const { state } = useContext(GameContext);
  const lastGuess = state.guesses[state.guesses.length - 1];

  let message = "Make your first guess!";
  if (state.status === "won") {
    message = `Correct! The number was ${state.secretNumber}.`;
  } else if (state.status === "lost") {
    message = `Game over! The number was ${state.secretNumber}.`;
  } else if (lastGuess !== undefined) {
    message = lastGuess > state.secretNumber ? "Too high!" : "Too low!";
  }

  return (
    <p className={state.status === "won" ? styles.won : styles.status}>
      {message}
    </p>
  );
}

export default GameStatus;
```

Update `src/components/GuessInput.jsx`:

```jsx
// src/components/GuessInput.jsx
import { useContext, useState } from "react";

import { GameContext } from "../contexts/GameContext";
import styles from "./GuessInput.module.css";

function GuessInput() {
  const { state, dispatch } = useContext(GameContext);
  const [inputValue, setInputValue] = useState("");

  const inputChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const guess = parseInt(inputValue, 10);
    if (isNaN(guess)) return;

    dispatch({ type: "SUBMIT_GUESS", payload: guess });
    setInputValue("");
  };

  const disabled = state.status !== "playing";

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <label htmlFor="guess-input">Enter a number between 1 and 20</label>
      <div className={styles.controls}>
        <input
          id="guess-input"
          className={styles.input}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={inputChangeHandler}
          disabled={disabled}
        />
        <button className={styles.button} type="submit" disabled={disabled}>
          Guess
        </button>
      </div>
    </form>
  );
}

export default GuessInput;
```

Update `src/components/GuessList.jsx`:

```jsx
// src/components/GuessList.jsx
import { useContext } from "react";

import { GameContext } from "../contexts/GameContext";
import GuessItem from "./GuessItem";
import styles from "./GuessList.module.css";

function GuessList() {
  const { state } = useContext(GameContext);

  if (state.guesses.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Past Guesses</h2>
      <ul className={styles.list}>
        {state.guesses.map((guess, index) => (
          <GuessItem key={index} guess={guess} secretNumber={state.secretNumber} />
        ))}
      </ul>
    </div>
  );
}

export default GuessList;
```

`GuessItem.jsx` does not change — it still receives `guess` and `secretNumber` as props from `GuessList`.

</details>

**Check:** The game should behave exactly as it did after Part 2A. Nothing about what the player sees or does should change; only where the state and dispatch function live has changed.

---

## Part 3: Bonus Challenge - Give Up (Optional)

Attempt this after completing both parts above.

Add a "Give Up" button that is visible only while the game is in progress (`status === "playing"`). Clicking it should immediately end the game as a loss and reveal the secret number, without waiting for the score to reach 0.

**Hints:**

- Add a third action type to `gameReducer`, for example `GIVE_UP`, that sets `status` to `"lost"` and leaves `score` and `secretNumber` unchanged.
- Dispatch it from a new button in `App.jsx`, using the same `dispatch` you already read from `useContext(GameContext)`.
- No new context or state shape is needed. This challenge is about extending an existing reducer with a new action, not adding new state.

No reference solution is provided. Use the reducer's existing `switch` statement as your model.

---

## Part 4: Debrief (30 minutes)

### Learner Presentations

Two volunteers will share their screen and walk through their solution. As you watch, consider:

- How did they structure the reducer's actions and state shape?
- What did they name their context?
- Which components did they update to read from context, and did they miss any?

### Instructor Walkthrough

After the presentations, the instructor will walk through the reference solution covering:

1. The reducer's state shape and the two action types
2. Why `getInitialState` is passed as an initialiser function rather than a value
3. The `GameProvider` pattern: moving `useReducer` out of `App` and into the provider
4. Calling `useContext(GameContext)` directly in each consuming component
5. Why the Guess Game does not strictly need Context, and when a component tree would

---

## Summary

Here is what you practised today:

- **`useReducer`**: centralising related game state and all update logic into a single reducer function
- **Action design**: describing state changes as plain action objects with a `type` and optional `payload`
- **Context API**: sharing reducer state and dispatch across the component tree without prop drilling, using `useContext` directly in each consuming component

In the next lesson (2.8), you will learn React Router and use it to add multi-page navigation to the CRM app.
