import React from 'react';

const GameDetails = () => {
  // Sample data - replace with your actual game data
  const gameData = {
    score: 12500,
    duration: "12:34",
    level: 8,
    linesCleared: 45,
    verificationStatus: "Verified",
    timestamp: "2024-11-09 15:30:45",
    moves: "LJTSZI...", // Abbreviated move history
    pieceStats: {
      L: 12,
      T: 8,
      Z: 7,
      I: 9,
      O: 5
    }
  };

  return (
    <div className="h-screen p-6 overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Main Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Game Statistics</h2>
            <span className={`px-3 py-1 text-sm rounded-full ${
              gameData.verificationStatus === "Verified" 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {gameData.verificationStatus}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">🏆</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-xl font-bold text-gray-800">{gameData.score}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">⏱️</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-xl font-bold text-gray-800">{gameData.duration}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Level</p>
                <p className="text-xl font-bold text-gray-800">{gameData.level}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lines Cleared</p>
                <p className="text-xl font-bold text-gray-800">{gameData.linesCleared}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Piece Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Piece Distribution</h2>
          <div className="grid grid-cols-7 gap-2">
            {Object.entries(gameData.pieceStats).map(([piece, count]) => (
              <div key={piece} className="text-center">
                <div className="text-2xl font-bold text-gray-800">{piece}</div>
                <div className="text-sm text-gray-500">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Move History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Move History</h2>
          <div className="p-3 font-mono text-sm bg-gray-100 rounded-lg overflow-x-auto">
            {gameData.moves}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Timestamp: {gameData.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;