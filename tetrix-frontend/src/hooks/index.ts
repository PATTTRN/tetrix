import { GameActions, GameActionTypes, GameState, GameStatus, Movement } from "@/types";
import { getInitialState, move, rotate, pause } from "@/utils";
import { useEffect, useReducer, useRef } from "react";

const initialState = getInitialState();

const gameReducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case GameActionTypes.START:
            const startState = move(state, {dx: 0, dy: 0});
            return { ...startState, status: GameStatus.PLAYING };
        case GameActionTypes.PAUSE:
            const pauseState = move(state, {dx: 0, dy: 0});
            return { ...pauseState, status: GameStatus.PAUSED };
        case GameActionTypes.RESET:
            const resetState = move(getInitialState(), {dx: 0, dy: 0});
            return { ...resetState, status: GameStatus.PLAYING };
        case GameActionTypes.ROTATE:
            return rotate(state)
        case GameActionTypes.MOVE:
            return move(state, action.payload);
        default:
            return state;
    }
}

export const useTetris = () => {
    const [state, setState] = useReducer(gameReducer, initialState);
    const gameSpeedRef = useRef(500);
    const gameStartTimeRef = useRef(0);

    const startGame = () => {
        gameStartTimeRef.current = Date.now();
        setState({
            type: GameActionTypes.START
        })
    }
    const pauseGame = () => setState({
        type: GameActionTypes.PAUSE
    })
    const resetGame = () => setState({
        type: GameActionTypes.RESET
    })
    const rotatePiece = () => setState({
        type: GameActionTypes.ROTATE
    })
    const movePiece = (m: Movement) => setState({type :GameActionTypes.MOVE, payload: m})

    const keyHandler = (e: KeyboardEvent) => {
        if (state.status !== GameStatus.PAUSED) {
            switch (e.key) {
                case 'ArrowDown':
                    movePiece({dx: 0, dy: 1})
                    break;
                case 'ArrowLeft':
                    movePiece({dx: -1, dy: 0})
                    break;
                case 'ArrowRight':
                    movePiece({dx: 1, dy: 0})
                    break;
                case 'ArrowUp':
                    rotatePiece()
                    break;
    
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', keyHandler);

        return () => window.removeEventListener('keydown', keyHandler);
    }, []);

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;

        if (state.status === GameStatus.PLAYING) {
            interval = setInterval(() => movePiece({dx: 0, dy: 1}), gameSpeedRef.current)
            const elapsedTime = Date.now() - gameStartTimeRef.current;
            if (elapsedTime >= 60000) {
                gameSpeedRef.current = Math.max(250, gameSpeedRef.current - 50);
            }
        }

        return () => clearInterval(interval)
    }, [state.status])

    return {
        board: state.board,
        status: state.status,
        score: state.score,
        nextPiece: state.nextPiece,
        startGame,
        resetGame,
        pauseGame
    }
}
