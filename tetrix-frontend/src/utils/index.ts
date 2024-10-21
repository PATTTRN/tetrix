import { BOARD_COLOR, BOARD_H, BOARD_W, PIECES } from "@/constants";
import { Board, GameState, GameStatus, Movement } from "@/types";
// import {Tet}

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

const checkCollision = (state: GameState) => {
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

export const move = (
  state: GameState,
  movement: Movement,
  isAdd = false
): GameState => {
  const { position, board, score } = state;

  let newPosition;

  if (state.status === GameStatus.PAUSED) {
    newPosition = {
        x: position.x,
        y: position.y,
      };
}

  newPosition = {
    x: position.x + movement.dx,
    y: position.y + movement.dy,
  };

  if (checkCollision({ ...state, position: newPosition })) {
    if (isAdd) {
      return { ...state, status: GameStatus.OVER };
    }
    if (movement.dy) {
      const fixedBoard = board.map((row) =>
        row.map((cell) => ({
          ...cell,
          filled: false,
          fixed: cell.fixed || cell.filled,
        }))
      );

      const completedRows = fixedBoard.filter(
        row => row.every(cell => cell.fixed)
    ).length;

    // Calculate new score
    state.score = score + (completedRows * 10);

    const nonFixedRows = fixedBoard.filter(
    (row) => !row.every((cell) => cell.fixed)
    );

    const rowsToCreate = BOARD_H - nonFixedRows.length;

    const newRows = rowsToCreate ? createBoard(rowsToCreate) : [];

    const newBoard = [...newRows, ...nonFixedRows];

    return move(
    {
        ...state,
        piece: getRandomPiece(),
        board: newBoard,
        position: { x: 4, y: 0 },
    },
    { dx: 0, dy: 0 },
    true
    );
    }
    return state;
  }

  const cBoard = clear(state);

  const dBoard = draw({ ...state, position: newPosition, board: cBoard });

  return {
    ...state,
    position: newPosition,
    board: dBoard,
  };
};

export const rotate = (state: GameState) => {
  const { piece } = state;

  const transposed = piece.shape[0].map((_, colidx) =>
    piece.shape.map((row) => row[colidx])
  );

  const rotated = transposed.map((row) => row.reverse());

  const newPiece = {
    ...piece,
    shape: rotated,
  };

  if (checkCollision({ ...state, piece: newPiece })) {
    return state;
  }

  const cBoard = clear(state);

  const dBoard = draw({ ...state, piece: newPiece, board: cBoard });

  return {
    ...state,
    piece: newPiece,
    board: dBoard,
  };
};

export const pause = (state: GameState) => {
    if (state.status === GameStatus.PAUSED) {
        return; // Don't process keyboard inputs while paused
    }
}
