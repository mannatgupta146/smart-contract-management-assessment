import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function History({ contract, account }) {
  const [history, setHistory] = useState([]);
  const [refresh, setRefresh] = useState(1);
  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await contract.getHistory(account);
        console.log(data);
        setHistory(data);
      } catch (err) {
        console.error("Error fetching History:", err);
      }
    }
    fetchHistory();
  }, [refresh]);
  return (
    <div>
      <div className="flex gap-4 items-center mb-2">
        <h1 className="text-2xl ml-28 mt-4 font-semibold">GAME HISTORY</h1>
        <button
          className="p-2 rounded-lg bg-blue-300 text-black"
          onClick={() => setRefresh((prev) => prev + 1)}
        >
          Update
        </button>
      </div>
      <ul>
        {history.map((hist, index) => (
          <li key={index} className="mb-4 border-2 w-96 p-2">
            <div>
              <p>Address: {hist.user} </p>
              <p>Result: {hist.resultType}</p>
              <p>Timestamp: {ethers.formatEther(hist.timestamp)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
