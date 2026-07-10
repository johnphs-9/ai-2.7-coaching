import { useState } from "react";
import styles from "./GuessInput.module.css";

function GuessInput({ onGuess, disabled }) {
  const [inputValue, setInputValue] = useState("");

  const inputChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const guess = parseInt(inputValue, 10);
    if (isNaN(guess)) return;

    onGuess(guess);
    setInputValue("");
  };

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
