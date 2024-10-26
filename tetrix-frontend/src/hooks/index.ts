import { GameActions, GameActionTypes, GameState, GameStatus, Movement } from "@/types";
import { getInitialState, move, rotate, pause, getNextPieceBoard } from "@/utils";
import { useEffect, useReducer, useRef } from "react";
import { PIECES } from "@/constants";

// Add mapping for moves and shapes
const MOVE_MAPPING = {
    right: '1',
    up: '2',
    left: '3',
    down: '4'
};

// Helper function to identify piece shape
const identifyPieceType = (piece: { shape: Array<Array<number>>, color: string }): string => {
    // Compare the current piece with each piece in PIECES constant
    for (const [key, refPiece] of Object.entries(PIECES)) {
        if (JSON.stringify(piece.shape) === JSON.stringify(refPiece.shape) && 
            piece.color === refPiece.color) {
            return key;
        }
    }
    return 'O'; // Fallback to a valid piece type if no match found
};

const SHAPE_MAPPING: { [key: string]: string } = {
    'L': 'L',
    'I': 'I',
    'O': 'O',
    'T': 'T',
    'Z': 'Z',
};

interface ExtendedGameState extends GameState {
    moveRecord: string;
}

const initialState: ExtendedGameState = {
    ...getInitialState(),
    moveRecord: ''
};

const gameReducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case GameActionTypes.START:
            const startState = move(state, {dx: 0, dy: 0});
            const initialPieceType = identifyPieceType(state.piece);
            return { ...startState, status: GameStatus.PLAYING, moveRecord: initialPieceType };
        case GameActionTypes.PAUSE:
            const pauseState = move(state, {dx: 0, dy: 0});
            return { ...pauseState, status: GameStatus.PAUSED, moveRecord: state.moveRecord };
        case GameActionTypes.CONTINUE:
            const continueState = move(state, {dx: 0, dy: 0});
            return { ...continueState, status: GameStatus.PLAYING, moveRecord: state.moveRecord };
        case GameActionTypes.RESET:
            const resetState = move(getInitialState(), {dx: 0, dy: 0}) as ExtendedGameState;
            // const initialPieceType = identifyPieceType(resetState.piece);
            return { ...resetState, status: GameStatus.PLAYING, moveRecord: identifyPieceType(resetState.piece) };
        case GameActionTypes.ROTATE:
            const rotatedState = rotate(state);
            return {
                ...rotatedState,
                moveRecord: state.moveRecord + MOVE_MAPPING.up
            };
        case GameActionTypes.MOVE:
            const { dx, dy } = action.payload;
            let moveCode = '';
            if (dx === 1) moveCode = MOVE_MAPPING.right;
            else if (dx === -1) moveCode = MOVE_MAPPING.left;
            else if (dy === 1) moveCode = MOVE_MAPPING.down;

            const movedState = move(state, action.payload);

            // If piece has landed and new piece appeared, record the new piece
            const hasNewPiece = movedState.piece !== state.piece;
            const newPieceRecord = hasNewPiece ? identifyPieceType(movedState.piece) : '';
            
            return {
                ...movedState,
                moveRecord: state.moveRecord + moveCode + newPieceRecord
            };
        default:
            return state; //O444444I444434344414144444444L4343444444444
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

    const continueGame = () => setState({
        type: GameActionTypes.CONTINUE
    });
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

    // Export game record
    const exportGameRecord = () => {
        return state.moveRecord;
    };

     // Save game record to localStorage
    const saveGameRecord = () => {
        const records = [];
        records.push({
            timestamp: Date.now(),
            record: state.moveRecord,
            score: state.score
        });
        localStorage.setItem('tetrisRecords', JSON.stringify(records));
    };

    const keyHandler = (e: KeyboardEvent) => {
        // if (state.status !== GameStatus.PAUSED) {
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
        // }
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

     // Save record when game is over
     useEffect(() => {
        if (state.status === GameStatus.OVER) {
            saveGameRecord();
        }
    }, [state.status]);

    return {
        board: state.board,
        status: state.status,
        score: state.score,
        nextPiece: state.nextPiece,
        moveRecord: state.moveRecord,
        exportGameRecord,
        startGame,
        resetGame,
        pauseGame,
        continueGame
    }
}
