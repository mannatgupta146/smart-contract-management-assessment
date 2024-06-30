import { useState, useEffect } from "react";

export default function WalletPage({
  setIsConnected,
  ethWallet,
  balance,
  getBalance,
  deposit,
  depositAmount,
  setDepositAmount,
  withdraw,
  withdrawAmount,
  setWithdrawAmount,
  account,
  handleAccount,
}) {
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.send("eth_requestAccounts", []);
      handleAccount(accounts);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      handleAccount(accounts);
    } else {
      console.log("No account found");
      handleAccount([]);
      setIsConnected(false);
    }
  };
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return (
        <p className="p-4 bg-red-400 text-center rounded-md text-lg">
          Please install Metamask in order to use this ATM.
        </p>
      );
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button
          onClick={connectAccount}
          className="p-4 text-lg bg-gray-400 rounded-md w-full"
        >
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="flex justify-center items-center gap-5 bg-gray-500">
        <div className="flex flex-col place-items-center gap-2 bg-gray-500">
          <p className="text-xl bg-gray-500">
            Your Account: <strong className="bg-gray-500">{account}</strong>
          </p>
          <p className="text-lg bg-gray-500">
            Your Balance: <strong className="bg-gray-500">{balance} ETH</strong>
          </p>
        </div>

        <div className="flex flex-col gap-5 mt-2 bg-gray-500">
          <div className="bg-gray-500">
            <input
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className=" mr-2 p-1 bg-white rounded-lg text-black pl-2 h-12"
              placeholder="Enter deposit amount"
            />
            <button
              onClick={() => {
                depositAmount && deposit();
              }}
              className="py-[1px] bg-gray-500 rounded-lg pr-5"
            >
              Deposit
            </button>
          </div>
          <div className="bg-gray-500">
            <input
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              className="mr-2 ml-3 bg-white rounded-lg text-black pl-2 h-12"
              placeholder="Enter withdraw amount"
            />
            <button
              onClick={() => {
                withdrawAmount && withdraw;
              }}
              className="py-[1px] rounded-lg pr-5"
            >
              {" "}
              Withdraw
            </button>
          </div>
        </div>
      </div>
    );
  };

  return <main className="p-2 bg-gray-500">{initUser()}</main>;
}
