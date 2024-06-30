import { useEffect, useState } from "react";

function Game({ gameBalance, setGameBalance, withdraw, deposit, contract, account, lost, setLost }) {
  const [mineData, setMineData] = useState();
  const [hasClicked, setHasClicked] = useState(false);
  const boxes = Array(9).fill(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    setMine();
  }, []);

  const setMine = () => {
    let mines = [];

    while (mines.length < 3) {
      let tempMine = Math.floor(Math.random() * 9);
      if (!mines.includes(tempMine)) mines.push(tempMine);
    }

    setMineData(mines);
  };

  const checkBoxEntry = async (num) => {
    if (hasClicked) return;
    if (gameBalance <= 0) {
      alert("Deposit money, brokie!");
      return;
    }

    setHasClicked(true);
    if (mineData.includes(num)) {
      setLost(true);
      setGameBalance(0);
      await contract.addToHistory(account,"lost")
    } else {
      setLost(false);
      const amountWon = gameBalance * 2 - gameBalance;
      await contract.addToLeaderBoard(account, amountWon);
      await contract.addToHistory(account,"won")
      setGameBalance((prev) => prev * 2);
    }
  };

  const resetGame = () => {
    setHasClicked(false);
    setLost(null);
    setMine();
  };

  return (
    <div className="flex flex-col items-center mt-3">
      <h1 className="text-3xl font-semibold mb-2">GAME WALLET</h1>
      <h1 className="text-lg">
        Game Balance: <strong>{gameBalance}</strong>
      </h1>
      <div className="flex gap-10 mt-2 mb-4">
        <div>
          <input
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            className=" mr-2 h-12 bg-white rounded-lg text-black pl-2"
            placeholder="Enter deposit amount"
          />
          <button
            className="rounded-lg"
            onClick={async () => {
              if (depositAmount === "") return;
              const success = await withdraw(depositAmount);
              if (success) {
                setGameBalance((prev) => prev + depositAmount);
                setDepositAmount("");
              }
            }}
          >
            Deposit
          </button>
        </div>

        <div>
          <input
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            className="mr-2 h-12 bg-white rounded-lg text-black pl-2"
            placeholder="Enter withdraw amount"
          />
          <button
            className="rounded-lg"
            onClick={async () => {
              if (withdrawAmount === "") return;
              if (withdrawAmount > gameBalance) {
                alert("Insufficient funds");
                return;
              }
              const success = await deposit(withdrawAmount);
              if (success) {
                console.log(withdrawAmount);
                setGameBalance((prev) => prev - withdrawAmount);
                setWithdrawAmount("");
              }
            }}
          >
            Withdraw
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-semibold mb-2">Try your luck!</h1>
      <div className="grid grid-cols-3 border-2 p-3 rounded-md w-72 h-72 place-items-center">
        {boxes.map((_, index) => (
          <div
            key={index}
            onClick={() => checkBoxEntry(index)}
            className="h-16 w-16 bg-slate-700 rounded-sm cursor-pointer m-1"
          >
            {hasClicked && mineData.includes(index) && (
              <h1 className="text-3xl w-full h-full rounded-sm bg-red-400 flex items-center justify-center">
                💀
              </h1>
            )}
            {hasClicked && !mineData.includes(index) && (
              <h1 className="text-3xl w-full h-full rounded-sm bg-slate-500 flex items-center justify-center">
                💎
              </h1>
            )}
          </div>
        ))}
      </div>
      {lost !== null ? (
        lost === true ? (
          <h1 className="text-xl font-semibold">You lost💀</h1>
        ) : (
          <h1 className="text-xl font-semibold">You won💰</h1>
        )
      ) : (
        ""
      )}
      {hasClicked && (
        <button
          className="bg-blue-300 px-6 py-2 rounded-lg mt-2 text-black font-semibold"
          onClick={() => resetGame()}
        >
          Restart
        </button>
      )}
    </div>
  );
}

export default Game;
