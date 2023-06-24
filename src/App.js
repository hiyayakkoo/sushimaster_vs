import React, { useState, useEffect } from "react";
import Web3 from "web3";
import RatingUpdateContractABI from "./contracts/RatingUpdate.json";
import "./App.css";

// コントラクトアドレスを定数として設定（適切な値に置き換えてください）
const RATING_UPDATE_CONTRACT_ADDRESS = "0x07167774e345c22005CA50f134Fc3A148dD13dDb";


const App = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState("");
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [ratingUpdateContract, setRatingUpdateContract] = useState(null);

  const choices = ["グー", "チョキ", "パー"];

  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);

      const contractInstance = new window.web3.eth.Contract(
          RatingUpdateContractABI,
          RATING_UPDATE_CONTRACT_ADDRESS
      );
      setRatingUpdateContract(contractInstance);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // Web3やMetaMaskが無い場合はアラートを表示
      window.alert("Ethereumブラウザのインストールを検討してください。MetaMaskを試してください!");
    }
  }, []);

  const updateRating = async (winner, loser) => {
    if (ratingUpdateContract) {
      try {
        await ratingUpdateContract.methods
            .updateRatingValue(winner, loser)
            .send({ from: accounts[0] });
      } catch (err) {
        console.error("エラーが発生しました:", err);
      }
    }
  };


  const handleClick = (choice) => {
    setUserChoice(choice);
    const randomIndex = Math.floor(Math.random() * choices.length);
    const cpuChoice = choices[randomIndex];
    setCpuChoice(cpuChoice);
    determineWinner(choice, cpuChoice);
  };

  const determineWinner = (userChoice, cpuChoice) => {
    let winnerAddr = null;
    let loserAddr = null;

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

    // 勝者が決まった場合、勝敗結果をスマートコントラクトに書き込む
    if (winnerAddr && loserAddr) {
      updateRating(winnerAddr, loserAddr);
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
