'use client'
import { GameStatus } from "@/types"
import { useTetrisContext } from "@/context/TetrisContext"

export default function Game() {
    const { board, status } = useTetrisContext()

    return (
        <main className="flex h-[80vh] flex-col items-center justify-center">
            {/* {status === GameStatus.PLAYING && ( */}
                <div className="w-[400px] h-auto min-h-[700px] flex flex-col border-l border-t border-gray-400">
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
            {/* )} */}
        </main>
    )
}