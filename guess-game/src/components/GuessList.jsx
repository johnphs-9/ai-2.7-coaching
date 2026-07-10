import GuessItem from "./GuessItem";
import styles from "./GuessList.module.css";

function GuessList({ guesses, secretNumber }) {
  // If there are no guesses, don't render the list at all.
  if (guesses.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Past Guesses</h2>
      <ul className={styles.list}>
        {guesses.map((guess, index) => (
          <GuessItem key={index} guess={guess} secretNumber={secretNumber} />
        ))}
      </ul>
    </div>
  );
}

export default GuessList;
