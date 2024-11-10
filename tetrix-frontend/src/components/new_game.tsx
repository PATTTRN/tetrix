'use client'
import { GameStatus } from "@/types"
import { useTetrisContext } from "@/context/TetrisContext"
import { Controller } from "./controller";

export default function Game() {
    const { board, status, exportGameRecord, movePiece, rotatePiece } = useTetrisContext()
    const record = exportGameRecord();

    return (
        <div className="flex flex-col items-center justify-center p-4 w-full h-full">
            {status === GameStatus.OVER ? (
                <p className="text-center">Game Over {record.score}</p>
            ) : (
                <div className="w-[200px] h-[400px] md:w-[400px] md:h-[800px] flex flex-col border-l border-t border-zinc-800">
                    {board.map((row: {filled: boolean, color: string}[], y: number) => {
                        return (
                            <div key={y} className="w-full flex-1 flex">
                                {row.map((cell: {filled: boolean, color: string}, x: number) => {
                                    return (
                                        <div
                                            key={x}
                                            className="flex-1 h-full border-r border-b border-zinc-800"
                                            style={{backgroundColor: cell.color}}
                                        />
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            )}
            <div className="md:hidden">
                <Controller
                    onMove={(dx, dy) => movePiece({ dx, dy })}
                    onRotate={rotatePiece} />
            </div>

        </div>
    )
}