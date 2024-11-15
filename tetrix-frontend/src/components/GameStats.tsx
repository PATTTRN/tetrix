import React, { useState } from 'react';
import GameDetails from './GameDetails';

const GameList = () => {
  // Sample data - replace with your actual games data
  const games = [
    {
      id: 1,
      timestamp: "2024-11-09 15:30:45",
      score: 12500,
      level: "medium",
      verificationStatus: "Pending"
    },
    {
      id: 2,
      timestamp: "2024-11-09 14:20:30",
      score: 9800,
      level: "easy",
      verificationStatus: "Verified"
    },
    {
      id: 3,
      timestamp: "2024-11-09 13:15:22",
      score: 15200,
      level: "difficult",
      verificationStatus: "Pending"
    },
  ];

  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const handleVerify = (gameId: number) => {
    // Add your verification logic here
    console.log('Verifying game:', gameId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Game History</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Score</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Level</th>
                  <th className="py-3 px-6 text-right text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-800">{game.timestamp}</td>
                    <td className="py-4 px-6 text-sm text-gray-800">{game.score}</td>
                    <td className="py-4 px-6 text-sm text-gray-800">{game.level}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {game.verificationStatus === 'Pending' && (
                        <button
                          onClick={() => handleVerify(game.id)}
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedGame(game.id)}
                        className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {selectedGame && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Game Details</h2>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <GameDetails />
                {/* <GameDetails gameId={selectedGame} /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameList;