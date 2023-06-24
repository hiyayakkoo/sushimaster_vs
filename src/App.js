import React, { useState } from "react";
import './App.css';

const App = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState("");

  const choices = ["グー", "チョキ", "パー"];

  const handleClick = (choice) => {
    setUserChoice(choice);
    const randomIndex = Math.floor(Math.random() * choices.length);
    const cpuChoice = choices[randomIndex];
    setCpuChoice(cpuChoice);
    determineWinner(choice, cpuChoice);
  };

  const determineWinner = (userChoice, cpuChoice) => {
    if (userChoice === cpuChoice) {
      setResult("引き分け");
    } else if (
        (userChoice === "グー" && cpuChoice === "チョキ") ||
        (userChoice === "チョキ" && cpuChoice === "パー") ||
        (userChoice === "パー" && cpuChoice === "グー")
    ) {
      setResult("勝ち");
    } else {
      setResult("負け");
    }
  };

  return (
      <div className="App">
        <h1>じゃんけんゲーム</h1>
        <div>
          {choices.map((choice) => (
              <button key={choice} onClick={() => handleClick(choice)}>
                {choice}
              </button>
          ))}
        </div>
        <div>
          <h2>あなたの選択: {userChoice}</h2>
          <h2>CPUの選択: {cpuChoice}</h2>
        </div>
        <h2>結果: {result}</h2>
      </div>
  );
};

export default App;
