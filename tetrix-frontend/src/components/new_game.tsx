'use client'
import { GameStatus } from "@/types"
import { useTetrisContext } from "@/context/TetrisContext"
import { stringify } from "querystring";

export default function Game() {
    const { board, status, exportGameRecord, moveRecord } = useTetrisContext()
    const record = exportGameRecord();

    // const savedRecords = JSON.parse(localStorage.getItem('tetrisRecords') || '[]');

    return (
        <main className="flex h-full flex-col items-center justify-center">
            {status === GameStatus.OVER ? <p>Game Over {record.score} {moveRecord}</p>: (
                <div className="w-[400px] h-full flex flex-col border-l border-t border-gray-400">
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