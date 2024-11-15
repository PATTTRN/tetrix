import { BOARD_COLOR, BOARD_H, BOARD_W, PIECES } from "@/constants";
import { Board, GameState, GameStatus, Movement } from "@/types";

// Use a class to encapsulate game state and avoid global variables
class GameStateManager {
  private static instance: GameStateManager;
  private score: number = 0;
  private highScore: number = 0;

  private constructor() {
    this.initializeHighScore();
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private initializeHighScore(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tetrisHighScore');
      if (stored) {
        this.highScore = parseInt(stored, 10);
      }
    }
  }

  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public updateScore(newScore: number): void {
    this.score = newScore;
    if (newScore > this.highScore) {
      this.highScore = newScore;
      if (typeof window !== 'undefined') {
        localStorage.setItem('tetrisHighScore', newScore.toString());
      }
    }
  }

  public resetScore(): void {
    this.score = 0;
  }
}

const gameState = GameStateManager.getInstance();

const createBoard = (h = BOARD_H, w = BOARD_W): Board => {
  return Array.from(Array(h), () =>
    Array.from(Array(w), () => ({
      filled: false,
      fixed: false,
      color: BOARD_COLOR,
    }))
  );
};

const getRandomPiece = () => {
  const keys = Object.keys(PIECES);
  const key = keys[
    Math.floor(Math.random() * keys.length)
  ] as keyof typeof PIECES;
  return PIECES[key];
};

export const getInitialState = (): GameState => {
  return {
    board: createBoard(),
    piece: getRandomPiece(),
    nextPiece: getRandomPiece(),
    position: { x: 4, y: 0 },
    status: GameStatus.PENDING,
    score: 0
  };
};

const draw = (state: GameState) => {
  const { piece, board, position } = state;

  for (let y = 0; y < piece.shape.length; y++) {
    const row = piece.shape[y];
    for (let x = 0; x < row.length; x++) {
      const value = row[x];
      if (value) {
        board[y + position.y][x + position.x] = {
          filled: true,
          fixed: false,
          color: piece.color,
        };
      }
    }
  }
  return board;
};

const clear = (state: GameState) => {
  const { piece, board, position } = state;

  for (let y = 0; y < piece.shape.length; y++) {
    const row = piece.shape[y];
    for (let x = 0; x < row.length; x++) {
      const value = row[x];
      if (value) {
        board[y + position.y][x + position.x] = {
          filled: false,
          fixed: false,
          color: BOARD_COLOR,
        };
      }
    }
  }
  return board;
};

export const checkCollision = (state: GameState) => {
  const { piece, board, position } = state;

  for (let y = 0; y < piece.shape.length; y++) {
    const row = piece.shape[y];
    for (let x = 0; x < row.length; x++) {
      const value = row[x];
      const targetPosition = board[y + position.y]?.[x + position.x];
      const isFixedPosition = targetPosition?.fixed && value;

      if (!targetPosition || isFixedPosition) {
        return true;
      }
    }
  }
  return false;
};

export const getScore = (): number => {
  return gameState.getScore();
};

export const getHighScore = (): number => {
  return gameState.getHighScore();
};

export const reseteGame = (): GameState => {
  gameState.resetScore();
  const newState = getInitialState();
  newState.score = 0;
  return newState;
};

export const move = (
  state: GameState,
  movement: Movement,
  isAdd = false
): GameState => {
  const { position, board, score, nextPiece } = state;

  const newPosition = state.status === GameStatus.PAUSED ? 
    { x: position.x, y: position.y } :
    { x: position.x + movement.dx, y: position.y + movement.dy };

  if (checkCollision({ ...state, position: newPosition })) {
    if (isAdd) {
      gameState.updateScore(score);
      return { ...state, status: GameStatus.OVER };
    }
    if (movement.dy) {
      const fixedBoard = board.map(row =>
        row.map(cell => ({
          ...cell,
          filled: false,
          fixed: cell.fixed || cell.filled,
        }))
      );

      const completedRows = fixedBoard.filter(row => 
        row.every(cell => cell.fixed)
      ).length;

      const newScore = score + (completedRows * 10);
      gameState.updateScore(newScore);

      const nonFixedRows = fixedBoard.filter(
        row => !row.every(cell => cell.fixed)
      );

      const rowsToCreate = BOARD_H - nonFixedRows.length;
      const newRows = rowsToCreate ? createBoard(rowsToCreate) : [];
      const newBoard = [...newRows, ...nonFixedRows];

      return move(
        {
          ...state,
          piece: nextPiece,
          nextPiece: getRandomPiece(),
          board: newBoard,
          position: { x: 4, y: 0 },
          score: newScore
        },
        { dx: 0, dy: 0 },
        true
      );
    }
    return state;
  }

  const clearedBoard = clear(state);
  const drawnBoard = draw({ ...state, position: newPosition, board: clearedBoard });

  return {
    ...state,
    position: newPosition,
    board: drawnBoard,
  };
};

export const getNextPieceBoard = (piece: { shape: typeof PIECES[keyof typeof PIECES]['shape']; color: string; }): Board => {
  const previewBoard = createBoard(4, 4);
  
  for (let y = 0; y < piece.shape.length; y++) {
    const row = piece.shape[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x]) {
        previewBoard[y][x] = {
          filled: true,
          fixed: false,
          color: piece.color,
        };
      }
    }
  }
  
  return previewBoard;
};

export const rotate = (state: GameState) => {
  const { piece } = state;
  const transposed = piece.shape[0].map((_, colIdx) =>
    piece.shape.map(row => row[colIdx])
  );
  const rotated = transposed.map(row => row.reverse());
  const newPiece = { ...piece, shape: rotated };

  if (checkCollision({ ...state, piece: newPiece })) {
    return state;
  }

  const clearedBoard = clear(state);
  const drawnBoard = draw({ ...state, piece: newPiece, board: clearedBoard });

  return {
    ...state,
    piece: newPiece,
    board: drawnBoard,
  };
};

export const pause = (state: GameState) => {
  if (state.status === GameStatus.PAUSED) {
    return;
  }
};
