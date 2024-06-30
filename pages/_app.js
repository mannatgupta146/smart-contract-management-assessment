import { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./index.css";
import WalletPage from "./components/wallet";
import Game from "./components/game";
import LeaderBoard from "./components/leaderboard";
import History from "./components/History";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const atmABI = atm_abi.abi;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameBalance, setGameBalance] = useState(0);

  const [ethWallet, setEthWallet] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [lost, setLost] = useState(null);

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.BrowserProvider(window.ethereum));
    }
  };
  const handleAccount = async (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
      getATMContract();
    } else {
      console.log("No account found");
    }
  };

  const getATMContract = async () => {
    if (ethWallet) {
      const signer = await ethWallet.getSigner();
      const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
      setATM(atmContract);
    }
  };
  const getBalance = async () => {
    if (atm) {
      try {
        const balance = await atm.getBalance();
        setBalance(Number(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const deposit = async (amount = depositAmount) => {
    if (atm) {
      try {
        const tx = await atm.deposit(amount);
        await tx.wait();
        getBalance();
        return true;
      } catch (error) {
        console.error("Error depositing:", error);
        return false;
      }
    }
  };

  const withdraw = async (amount = withdrawAmount) => {
    if (atm) {
      try {
        if (amount > balance) {
          alert("Insufficient balance");
          return;
        }
        const tx = await atm.withdraw(amount);
        await tx.wait();
        getBalance();
        return true;
      } catch (error) {
        console.error("Error withdrawing:", error);
        return false;
      }
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <>
      <WalletPage
        setIsConnected={setIsConnected}
        ethWallet={ethWallet}
        balance={balance}
        getBalance={getBalance}
        deposit={deposit}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        withdraw={withdraw}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        account={account}
        handleAccount={handleAccount}
      />
      {isConnected && (
        <div className="flex justify-between mt-2">
          <LeaderBoard contract={atm} gameBalance={gameBalance} lost={lost} />
          <Game
            gameBalance={gameBalance}
            setGameBalance={setGameBalance}
            withdraw={withdraw}
            deposit={deposit}
            contract={atm}
            account={account}
            lost={lost}
            setLost={setLost}
          />
          <History contract={atm} account={account} />
        </div>
      )}
    </>
  );
}

export default App;
