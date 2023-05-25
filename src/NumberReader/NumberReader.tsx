import "./NumberReader.scss";

import { useEffect, useState } from "react";
import Speech from "react-speech";

const NumberReader = () => {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<number>(0);
  const [answer, setAnswer] = useState<number | string>();
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const [showResult, setShowResult] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);

  const textCreator = () => {
    let n = Math.floor(Math.random() * 2) + 1;

    let t = "";
    if (n === 1) {
      const num = Math.floor(Math.random() * 100000);

      setResult(num);
      t = num.toString();
    } else if (n === 2) {
      const firstNum = Math.floor(Math.random() * 9000) + 1000;
      let secondNum;
      do {
        secondNum = Math.floor(Math.random() * 10000);
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
  }, []);

  return (
    <div className="number-reader">
      <div className="side left-side">
        <div>
          <label>Show Text:</label>
          <input
            type="checkbox"
            checked={showText}
            onChange={() => setShowText((showText) => !showText)}
          />
        </div>
        <div>
          <label>Show Result:</label>
          <input
            type="checkbox"
            checked={showResult}
            onChange={() => setShowResult((showResult) => !showResult)}
          />
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
