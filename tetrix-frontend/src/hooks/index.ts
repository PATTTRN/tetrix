import { GameActions, GameActionTypes, GameState, GameStatus, Movement, Position } from "@/types";
import { getInitialState, move, rotate, checkCollision } from "@/utils";
import { useCallback, useEffect, useReducer, useRef } from "react";
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
    for (const [key, refPiece] of Object.entries(PIECES)) {
        if (JSON.stringify(piece.shape) === JSON.stringify(refPiece.shape) && 
            piece.color === refPiece.color) {
            return key;
        }
    }
    return 'O'; // Fallback to a valid piece type if no match found
};

// Type guard for Position
const isPosition = (value: unknown): value is Position => {
    return Boolean(value) && 
           typeof value === 'object' && 
           value !== null &&
           'x' in value && 
           'y' in value && 
           typeof value.x === 'number' && 
           typeof value.y === 'number';
};

// Helper function to check if a move would be valid
const wouldMoveBeValid = (state: GameState, movement: Movement): boolean => {
    if (!isPosition(state.position)) {
        return false;
    }

    const newPosition = {
        x: state.position.x + movement.dx,
        y: state.position.y + movement.dy,
    };

    // Check if the move would cause a collision
    return !checkCollision({ ...state, position: newPosition });
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
            return { ...resetState, status: GameStatus.PLAYING, moveRecord: identifyPieceType(resetState.piece) };
            
        case GameActionTypes.ROTATE:
            const beforeRotateState = { ...state };
            const rotatedState = rotate(state);
            
            // Check if rotation was successful by comparing states
            const wasRotationSuccessful = JSON.stringify(beforeRotateState.piece.shape) !== 
                                        JSON.stringify(rotatedState.piece.shape);
            
            if (wasRotationSuccessful) {
                return {
                    ...rotatedState,
                    moveRecord: state.moveRecord + MOVE_MAPPING.up
                };
            }
            return { ...rotatedState, moveRecord: state.moveRecord };
            
        case GameActionTypes.MOVE:
            const { dx, dy } = action.payload;
            
            // First check if the move would be valid
            if (wouldMoveBeValid(state, action.payload)) {
                const movedState = move(state, action.payload);
                let moveCode = '';
                
                if (dx === 1) moveCode = MOVE_MAPPING.right;
                else if (dx === -1) moveCode = MOVE_MAPPING.left;
                else if (dy === 1) moveCode = MOVE_MAPPING.down;

                // If piece has landed and new piece appeared
                const hasNewPiece = movedState.piece !== state.piece;
                const newPieceRecord = hasNewPiece ? identifyPieceType(movedState.piece) : '';
                
                return {
                    ...movedState,
                    moveRecord: state.moveRecord + moveCode + newPieceRecord
                };
            }
            
            // If move would be invalid, just return current state with move
            const movedState = move(state, action.payload);
            return { ...movedState, moveRecord: state.moveRecord };
            
        default:
            return state;
    }
}

export const useTetris = () => {
    const [tetrisState, setTetrisState] = useReducer(gameReducer, initialState);
    const gameSpeedRef = useRef(500);
    const gameStartTimeRef = useRef(0);
    const gameLevel = useRef("easy")

    const startGame = () => {
        gameStartTimeRef.current = Date.now();
        setTetrisState({
            type: GameActionTypes.START
        })
    }

    const continueGame = useCallback(() => setTetrisState({
        type: GameActionTypes.CONTINUE
    }), [])
    const pauseGame = useCallback(() => setTetrisState({
        type: GameActionTypes.PAUSE
    }), [])
    const resetGame = useCallback(() => setTetrisState({
        type: GameActionTypes.RESET
    }), [])
    const rotatePiece = useCallback(() => setTetrisState({
        type: GameActionTypes.ROTATE
    }), [])
    const movePiece = useCallback((m: Movement) => setTetrisState({
        type :GameActionTypes.MOVE,
        payload: m
    }), [])

    // Export game record
    const exportGameRecord = useCallback(() => {
        return tetrisState.moveRecord;
    }, [tetrisState.moveRecord])

     // Save game record to localStorage
    const saveGameRecord = useCallback(() => {
        const records = [];
        records.push({
            timestamp: Date.now(),
            record: tetrisState.moveRecord,
            score: tetrisState.score
        });
        localStorage.setItem('tetrisRecords', JSON.stringify(records));
    }, [tetrisState.moveRecord, tetrisState.score]);

    const keyHandler = useCallback((e: KeyboardEvent) => {
        if (tetrisState.status === GameStatus.PLAYING) {
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
    }, [tetrisState.status, movePiece, rotatePiece]);

    useEffect(() => {
        window.addEventListener('keydown', keyHandler);

        return () => window.removeEventListener('keydown', keyHandler);
    }, [tetrisState.status, keyHandler]);

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;

        if (tetrisState.status === GameStatus.PLAYING) {
            // Adjust game speed based on score
            if (tetrisState.score >= 2000) {
                gameSpeedRef.current = 200; // Fastest speed
                gameLevel.current = "hard";
            } else if (tetrisState.score >= 1000) {
                gameSpeedRef.current = 300; // Medium speed
                gameLevel.current = "medium";
            } else {
                gameSpeedRef.current = 500; // Base speed
                gameLevel.current = "easy";
            }

            interval = setInterval(() => movePiece({dx: 0, dy: 1}), gameSpeedRef.current);
        }

        return () => clearInterval(interval)
    }, [tetrisState.status, tetrisState.score, movePiece])

     // Save record when game is over
     useEffect(() => {
        if (tetrisState.status === GameStatus.OVER) {
            saveGameRecord();
        }
    }, [tetrisState.status, saveGameRecord]);

    return {
        board: tetrisState.board,
        status: tetrisState.status,
        score: tetrisState.score,
        nextPiece: tetrisState.nextPiece,
        moveRecord: tetrisState.moveRecord,
        exportGameRecord,
        startGame,
        resetGame,
        pauseGame,
        continueGame,
        gameLevel,
        movePiece,
        rotatePiece
    }
}
