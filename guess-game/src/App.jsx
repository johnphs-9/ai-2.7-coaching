import { useState } from "react";

import GameStatus from "./components/GameStatus";
import GuessInput from "./components/GuessInput";
import GuessList from "./components/GuessList";
import styles from "./App.module.css";

function getRandomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

function App() {
  const [secretNumber, setSecretNumber] = useState(getRandomNumber);
  const [guesses, setGuesses] = useState([]);
  const [score, setScore] = useState(20);
  const [status, setStatus] = useState("playing"); // "playing" | "won" | "lost"

  const lastGuess = guesses[guesses.length - 1];

  const guessHandler = (guess) => {
    const isCorrect = guess === secretNumber;
    const newScore = isCorrect ? score : Math.max(0, score - 1);

    setGuesses((prevGuesses) => [...prevGuesses, guess]);
    setScore(newScore);
    setStatus(isCorrect ? "won" : newScore === 0 ? "lost" : "playing");
  };

  const resetHandler = () => {
    setSecretNumber(getRandomNumber());
    setGuesses([]);
    setScore(20);
    setStatus("playing");
  };

  return (
    <div className={styles.game}>
      <h1>Guess the Number</h1>
      <p>I am thinking of a number between 1 and 20.</p>
      <p>Score: {score}</p>

      <GameStatus
        secretNumber={secretNumber}
        lastGuess={lastGuess}
        status={status}
      />
      <GuessInput onGuess={guessHandler} disabled={status !== "playing"} />
      {status !== "playing" && (
        <button
          type="button"
          className={styles.resetButton}
          onClick={resetHandler}
        >
          New Game
        </button>
      )}
      <GuessList guesses={guesses} secretNumber={secretNumber} />
    </div>
  );
}

export default App;
