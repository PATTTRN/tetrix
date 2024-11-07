'use client'
import { GameStatus } from "@/types"
import { useTetrisContext } from "@/context/TetrisContext"

export default function Game() {
    const { board, status, exportGameRecord } = useTetrisContext()
    const record = exportGameRecord();

    return (
        <main className="flex h-full flex-col items-center justify-center">
            {status === GameStatus.OVER ? (
                <p className="text-center">Game Over {record.score}</p>
            ) : (
                <div className="w-full max-w-[400px] h-full flex flex-col border-l border-t border-gray-400">
                    {board.map((row: {filled: boolean, color: string}[], y: number) => {
                        return (
                            <div key={y} className="w-full flex-1 flex">
                                {row.map((cell: {filled: boolean, color: string}, x: number) => {
                                    return (
                                        <div
                                            key={x}
                                            className="flex-1 h-full border-r border-b border-gray-400"
                                            style={{backgroundColor: cell.color}}
                                        />
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            )}
        </main>
    )
}