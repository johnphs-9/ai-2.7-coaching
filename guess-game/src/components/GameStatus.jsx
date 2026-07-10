import styles from "./GameStatus.module.css";

function GameStatus({ secretNumber, lastGuess, status }) {
  let message = "Make your first guess!";
  if (status === "won") {
    message = `Correct! The number was ${secretNumber}.`;
  } else if (status === "lost") {
    message = `Game over! The number was ${secretNumber}.`;
  } else if (lastGuess !== undefined) {
    message = lastGuess > secretNumber ? "Too high!" : "Too low!";
  }

  return (
    <p className={status === "won" ? styles.won : styles.status}>{message}</p>
  );
}

export default GameStatus;
