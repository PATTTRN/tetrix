'use client'
import { useTetrisContext } from "@/context/TetrisContext"
import { GameStatus } from "@/types"
import { getScore, getHighScore, reseteGame } from "@/utils"

export const TopPanel = () => {
    const { status, startGame, pauseGame, resetGame, continueGame } = useTetrisContext()
    const score = getScore()
    const highScore = getHighScore()

    return (
        <div className="w-full flex flex-row items-center justify-between relative bg-[#1D1D1D] border-[0.412px] border-[#3A3A3A] rounded-[13.183px] px-4 py-3 h-auto sm:h-[60px]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-14 text-white">
                <div className="flex items-center gap-2">
                    <p className="font-medium uppercase text-xs">High Score:</p>
                    <span className="text-xl sm:text-2xl whitespace-nowrap">{highScore}</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-white">
                    <p className="uppercase text-xs">SCORE:</p>
                    <p className="text-xl sm:text-2xl">{score}</p>
                </div>
            </div>
            {status === GameStatus.PENDING ? (
                <button onClick={startGame} className="text-white border border-gray rounded-md py-1 px-2 sm:px-4 mt-2 sm:mt-0 text-xs sm:text-base">
                    START GAME
                </button>
            ) : status === GameStatus.PLAYING ? (
                <div onClick={pauseGame} className="text-white border border-gray rounded-md py-1 px-2 sm:px-4 mt-2 sm:mt-0 text-xs sm:text-base">
                    PAUSE GAME
                </div>
            ) : status === GameStatus.PAUSED ? (
                <div onClick={continueGame} className="text-white border border-gray rounded-md py-1 px-2 sm:px-4 mt-2 sm:mt-0 text-xs sm:text-base">
                    CONTINUE
                </div>
            ) : status === GameStatus.OVER ? (
                <div className="flex items-center gap-2">
                    <button onClick={() => { resetGame(); reseteGame() }} className="text-white border border-gray rounded-md py-1 px-2 sm:px-4 text-xs sm:text-base">Reset Game</button>
                </div>
            ) : null}
        </div>
    )
}