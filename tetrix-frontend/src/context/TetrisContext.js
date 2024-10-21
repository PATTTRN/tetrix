'use client'
import { createContext, useContext, useState } from 'react'
import { useTetris } from "@/hooks"
// import { GameStatus } from "@/types"

// Define the type for the context value
// type TetrisContextType = {
//     board: Array<Array<{color: string}>>;
//     status: GameStatus;
//     startGame: () => void;
//     resetGame: () => void;
// }

// Create the context with an initial undefined value
const TetrisContext = createContext()

export const TetrisProvider = ({ children }) => {
    const { board, status, startGame, resetGame, pauseGame } = useTetris()
    const [scoree, setScoree] = useState(0);
    
    return (
        <TetrisContext.Provider value={{board, status, startGame, resetGame, pauseGame, scoree, setScoree}}>
            {children}
        </TetrisContext.Provider>
    )
}

// Custom hook to use the tetris context
export function useTetrisContext() {
    const context = useContext(TetrisContext)
    if (context === undefined) {
        throw new Error('useTetrisContext must be used within a TetrisProvider')
    }
    return context
}