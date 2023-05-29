import "./NumberReader.scss";

import { useEffect, useState } from "react";
import Speech from "react-speech";
import { convertNumberToWords } from "../utils/numberToWord";

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
  const [game, setGame] = useState<number>(-1);
  const [order, setOrder] = useState<number>(1);

  function speakMessage(message: string, PAUSE_MS = 500, splitter?: string) {
    try {
      const messageParts = message.split(splitter || ",");

      let currentIndex = 0;
      const speak = (textToSpeak: string) => {
        const msg = new SpeechSynthesisUtterance();
        const voices = window.speechSynthesis.getVoices();
        msg.voice =
          voices.find(({ name }) => name === "Google UK English Female") ||
          voices[0];
        msg.volume = 1; // 0 to 1
        msg.rate = 1; // 0.1 to 10
        msg.pitch = 1; // 0 to 2
        msg.text = textToSpeak;
        msg.lang = "en-US";

        msg.onend = function () {
          currentIndex++;
          if (currentIndex < messageParts.length) {
            setTimeout(() => {
              speak(messageParts[currentIndex]);
            }, PAUSE_MS);
          }
        };
        speechSynthesis.speak(msg);
      };
      speak(messageParts[0]);
    } catch (e) {
      console.error(e);
    }
  }
  function findSecondLargestElem(arr: number[]) {
    let first = -1,
      second = -1;

    for (let i = 0; i <= arr.length - 1; i++) {
      if (arr[i] > first) {
        second = first;
        first = arr[i];
      } else if (arr[i] > second && arr[i] !== first) {
        second = arr[i];
      }
    }
    return second;
  }

  const textCreator = () => {
    let n = game === -1 ? Math.floor(Math.random() * 3) + 1 : game;

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
    } else if (n === 3 || n === 4) {
      const numbers = [];
      if (difficulty === 0) {
        for (let i = 0; i < 4; i++) {
          numbers.push(randomGenerator(10, 100, 5));
        }
      } else if (difficulty === 1) {
        for (let i = 0; i < 5; i++) {
          numbers.push(randomGenerator(10, 100, 1));
        }
      } else {
        for (let i = 0; i < 7; i++) {
          numbers.push(randomGenerator(10, 100, 1));
        }
      }
      setResult(
        order === 1 ? Math.max(...numbers) : findSecondLargestElem(numbers)
      );
      const predicator = n === 3 ? "largest" : "smallest";
      t =
        "Which one is the " +
        (order === 1 ? predicator : "second " + predicator) +
        " number? " +
        numbers.map(convertNumberToWords).join("  ");
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
  }, [difficulty, game, order]); //eslint-disable-line

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
            onChange={(e: any) => setDifficulty(Number(e.target.value))}>
            <option value={0}>Easy</option>
            <option value={1}>Medium</option>
            <option value={2}>Hard</option>
          </select>
        </div>
        <div className="config-element">
          <label>Select Game:</label>
          <select
            name="game"
            value={game}
            onChange={(e: any) => setGame(Number(e.target.value))}>
            <option value={-1}>Random</option>
            <option value={1}>5 digit</option>
            <option value={2}>Substraction</option>
            <option value={3}>Largest</option>
            <option value={4}>Smallest</option>
          </select>

          {[3, 4].includes(game) && (
            <span style={{ marginLeft: "10px" }}>
              <label>Order:</label>
              <select
                name="order"
                value={order}
                onChange={(e: any) => setOrder(Number(e.target.value))}>
                <option value={1}>First</option>
                <option value={2}>Second</option>
              </select>
            </span>
          )}
        </div>
      </div>
      <div className="side right-side">
        <button className="restart-button" onClick={textCreator}>
          Restart
        </button>
        {[3, 4].includes(game) ? (
          <button
            style={{ height: "40px" }}
            onClick={() => speakMessage(text, 1000, "  ")}>
            Start
          </button>
        ) : (
          <Speech
            voice="Google UK English Female"
            displayText={text}
            text={text}
            stop
            pause
            resume>
            konus
          </Speech>
        )}
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
