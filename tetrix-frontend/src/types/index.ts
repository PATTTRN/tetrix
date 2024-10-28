export type Board = Array<Row>;
export type Row = Array<Cell>;

export interface Cell {
    color: string,
    fixed: boolean,
    filled: boolean
}

export enum GameStatus {
    PENDING,
    PLAYING,
    OVER,
    PAUSED
}

export interface GameState {
    [x: string]: string | number | GameStatus | Piece | TetrisPiece | Position | Board;
    status: GameStatus,
    piece: Piece,
    nextPiece: TetrisPiece,
    position: Position,
    board: Board,
    score: number
}

export interface Piece {
    color: string,
    shape: Array<Array<number>>;
}

export interface TetrisPiece {
    color: string,
    shape: Array<Array<number>>;
}

export interface Position {
    x: number;
    y: number;
}

export enum GameActionTypes {
    START,
    RESET,
    MOVE,
    ROTATE,
    PAUSE,
    CONTINUE
}

export interface Movement {
    dx: number;
    dy: number;
}

interface StartAction {
    type: GameActionTypes.START,
    payload?: undefined
}

interface PauseAction {
    type: GameActionTypes.PAUSE,
    payload?: undefined
}

interface ContinueAction {
    type: GameActionTypes.CONTINUE,
    payload?: undefined
}

interface ResetAction {
    type: GameActionTypes.RESET,
    payload?: undefined
}

interface RotateAction {
    type: GameActionTypes.ROTATE,
    payload?: undefined
}

interface MoveAction {
    type: GameActionTypes.MOVE,
    payload: Movement
}

export type GameActions = StartAction | ResetAction | RotateAction | MoveAction| PauseAction | ContinueAction