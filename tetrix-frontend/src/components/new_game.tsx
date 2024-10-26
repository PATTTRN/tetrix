'use client'
import { GameStatus } from "@/types"
import { useTetrisContext } from "@/context/TetrisContext"
import {useTetris} from "@/hooks/index"

export default function Game() {
    const { board, status, moveRecord, exportGameRecord } = useTetrisContext()
    const record = exportGameRecord();

    const savedRecords = JSON.parse(localStorage.getItem('tetrisRecords') || '[]');
    console.log("records", record, savedRecords)
    console.log("saved records", savedRecords)

    return (
        <main className="flex h-full flex-col items-center justify-center">
            {status === GameStatus.OVER ? <p>Game Over</p>: (
                <div className="w-[400px] h-full flex flex-col border-l border-t border-gray-400">
                    {board.map((row: any[], y: number) => {
                        return (
                            <div key={y} className="w-full flex-1 flex">
                                {row.map((cell: any, x: number) => {
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