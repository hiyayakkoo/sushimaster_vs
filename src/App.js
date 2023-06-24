import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";

const App = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState("");
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const choices = ["グー", "チョキ", "パー"];

  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Ethereum ブラウザのインストールを検討してください。MetaMask を試してください!");
    }
  }, []);

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

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccounts(accounts);
    setConnected(true);
  };

  return (
      <div className="App">
        <h1>じゃんけんゲーム</h1>
          {connected ? (
              <p>接続されたアカウント: {accounts[0]}</p>
          ) : (
              <button onClick={connectWallet}>ウォレットに接続</button>
          )}
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
