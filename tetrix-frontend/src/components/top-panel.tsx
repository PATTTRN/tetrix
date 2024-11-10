'use client'
import { useTetrisContext } from "@/context/TetrisContext"
import { GameStatus } from "@/types"
import { getScore, getHighScore, reseteGame } from "@/utils"
import NumberFlow from "@number-flow/react"

const ScoreDisplay = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-2">
    <p className="font-medium uppercase text-xs ">{label}:</p>
    <NumberFlow value={value} className="text-2xl sm:text-2xl" />
  </div>
)

const GameButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className="text-white border border-gray rounded-md py-1 px-2 sm:px-4 mt-2 sm:mt-0 text-xs sm:text-base"
  >
    {children}
  </button>
)

export const TopPanel = () => {
    const { status, startGame, pauseGame, resetGame, continueGame } = useTetrisContext()
    const score = getScore()
    const highScore = getHighScore()

    const renderGameButton = () => {
        switch (status) {
            case GameStatus.PENDING:
                return <GameButton onClick={startGame}>START GAME</GameButton>
            case GameStatus.PLAYING:
                return <GameButton onClick={pauseGame}>PAUSE GAME</GameButton>
            case GameStatus.PAUSED:
                return <GameButton onClick={continueGame}>CONTINUE</GameButton>
            case GameStatus.OVER:
                return (
                    <div className="flex items-center gap-2">
                        <GameButton onClick={() => { resetGame(); reseteGame() }}>
                            Reset Game
                        </GameButton>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="w-full flex flex-row items-center justify-between relative bg-[#1D1D1D] border-[0.412px] border-[#3A3A3A] rounded-[13.183px] px-4 py-3 h-auto">
            <div className="flex flex-col text-white">
                <ScoreDisplay label="High Score" value={highScore} />
                <ScoreDisplay label="Score" value={score} />
            </div>
            {renderGameButton()}
        </div>
    )
}