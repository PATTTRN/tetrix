'use client'
import { Life } from "./life"
import { useTetrisContext } from "@/context/TetrisContext"
import { GameStatus } from "@/types"

export const TopPanel = () => {
    const { status, startGame, resetGame, pauseGame, scoree } = useTetrisContext()

    return (
        <div className="flex items-center justify-between relative bg-[#1D1D1D] border-[0.412px] border-[#3A3A3A] rounded-[13.183px] px-5 py-3 h-[60px] flex-shrink-0">
            <div className="flex items-center gap-2 text-white">
                <p className="font-medium uppercase text-xs">High Score:</p>
                <span className="text-2xl whitespace-nowrap">0</span>
            </div>
            <div className="flex items-center gap-1 font-medium absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white">
                <div className="flex items-center gap-2">
                    <p className="uppercase text-xs">SCORE:</p>
                    <p className="text-2xl">{scoree}</p>
                </div>
                {/* )} */}
            </div>
            {/* <Life /> */}
            {status === GameStatus.PENDING ? (
                    <button onClick={startGame} className="text-white border border-gray rounded-md py-2 px-4">
                        START GAME
                    </button>
                ) : status === GameStatus.PLAYING ? (
                    <div onClick={pauseGame} className="text-white border border-gray rounded-md py-2 px-4">
                        PAUSE GAME
                    </div>
                ) : status === GameStatus.PAUSED ? (
                    <div onClick={startGame} className="text-white border border-gray rounded-md py-2 px-4">
                        CONTINUE
                    </div>
                ) : status === GameStatus.OVER ? (
                    <div className="flex items-center gap-2">
                        <p>Game Over</p>
                        <button onClick={resetGame} className="text-white border border-gray rounded-md py-2 px-4">Reset Game</button>
                    </div>
                ) : null}
        </div>
    )
}