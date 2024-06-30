import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

export default function LeaderBoard({ contract, lost }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [refresh, setRefresh] = useState(1);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await contract.getLeaderboard();
        console.log(data);
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    }
    fetchLeaderboard();
  }, [lost, refresh]);

  return (
    <div className="m-4">
      <div className="flex gap-4 items-center mb-2">
        <h1 className="text-2xl ml-28 mt-4 font-semibold">LEADERBOARD</h1>
        <button
          className="p-2 rounded-lg bg-blue-300 text-black"
          onClick={() => setRefresh((prev) => prev + 1)}
        >
          Update
        </button>
      </div>
      <ul>
        {leaderboard.map((player, index) => (
          <li key={index} className="mb-4 border-2 w-96 p-2">
            <div>
              <p>Address: {player.playerAddress} </p>
              <p>
                Winning: <strong>{Number(player.winning)} ETH</strong>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
