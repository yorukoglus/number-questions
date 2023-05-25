import "./NumberReader.scss";

import { useEffect, useState } from "react";
import Speech from "react-speech";

function randomGenerator(min: number, max: number, multiple: number) {
  return Math.round((Math.random() * (max - min) + min) / multiple) * multiple;
}

const NumberReader = () => {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<number>(0);
  const [answer, setAnswer] = useState<number | string>();
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const [showResult, setShowResult] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<number>(0);

  const textCreator = () => {
    let n = Math.floor(Math.random() * 2) + 1;

    let t = "";
    if (n === 1) {
      let num;
      if (difficulty === 0) {
        num = randomGenerator(0, 10000, 100);
      } else if (difficulty === 1) {
        num = randomGenerator(0, 50000, 10);
      } else {
        num = randomGenerator(0, 100000, 1);
      }

      setResult(num);
      t = num.toString();
    } else if (n === 2) {
      let firstNum;
      if (difficulty === 0) {
        firstNum = randomGenerator(1000, 5000, 100);
      } else if (difficulty === 1) {
        firstNum = randomGenerator(1000, 8000, 10);
      } else {
        firstNum = randomGenerator(1000, 10000, 1);
      }
      let secondNum;
      do {
        if (difficulty === 0) {
          secondNum = randomGenerator(0, 5000, 100);
        } else if (difficulty === 1) {
          secondNum = randomGenerator(0, 8000, 10);
        } else {
          secondNum = randomGenerator(0, 10000, 1);
        }
      } while (secondNum > firstNum);

      setResult(firstNum - secondNum);
      t = firstNum.toString() + " minus " + secondNum.toString();
    }
    setText(t);
  };

  const handleChange = (e: any) => {
    setAnswer(Number(e.target.value));

    setIsCorrect(Number(e.target.value) === result);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();
    setIsCorrect(answer === result);
  };

  useEffect(() => {
    setAnswer("");
    setIsCorrect(false);
  }, [text]); //eslint-disable-line

  useEffect(() => {
    textCreator();
  }, []); //eslint-disable-line

  return (
    <div className="number-reader">
      <div className="side left-side">
        <div className="config-element">
          <label>Show Text:</label>
          <input
            type="checkbox"
            checked={showText}
            onChange={() => setShowText((showText) => !showText)}
          />
        </div>
        <div className="config-element">
          <label>Show Result:</label>
          <input
            type="checkbox"
            checked={showResult}
            onChange={() => setShowResult((showResult) => !showResult)}
          />
        </div>
        <div className="config-element">
          <label>Difficulty:</label>
          <select
            name="difficulty"
            value={difficulty}
            onChange={(e: any) => setDifficulty(e.target.value)}>
            <option value={0}>Easy</option>
            <option value={1}>Medium</option>
            <option value={2}>Hard</option>
          </select>
        </div>
      </div>
      <div className="side right-side">
        <button className="restart-button" onClick={textCreator}>
          Restart
        </button>
        <Speech
          voice="Google UK English Female"
          displayText={text}
          text={text}
          stop
          pause
          resume>
          konus
        </Speech>
        <div className="speech-text">{showText ? text : null}</div>
        <form onSubmit={handleSubmit} className="form">
          <label>Answer:</label>
          <input
            type="number"
            placeholder="please enter"
            title="number"
            value={answer}
            onChange={handleChange}
          />
          {answer ? (
            <div className={`is-correct ${isCorrect ? "true" : "false"}`}>
              {isCorrect ? "True" : "False"}
            </div>
          ) : null}
          {showResult ? result : null}
        </form>
      </div>
    </div>
  );
};

export default NumberReader;
