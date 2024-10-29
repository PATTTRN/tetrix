const BOARD_WIDTH: usize = 10;
const BOARD_HEIGHT: usize = 20;

#[derive(Clone, Copy, PartialEq)]
enum Cell {
    Empty,
    Filled,
    Locked,
}

#[derive(Clone, Copy, PartialEq)]
enum TetrominoShape {
    L,
    Z,
    T,
    O,
    I,
    Null
}   

pub struct Tetris {
    board: Vec<Vec<Cell>>,
    moves: String,
    state: u32,
    current_piece: Tetromino,
    score: u32,
}

#[derive(Clone)]
struct Position {
    row: isize,
    col: isize,
}

impl Tetris {
    pub fn print_board(&self) {
        println!("   0 1 2 3 4 5 6 7 8 9");
        println!("  ┌{}┐", "──".repeat(BOARD_WIDTH));
        for (i, row) in self.board.iter().enumerate() {
            print!("{:02}", i);
            print!("│");
            for &cell in row {
                match cell {
                    Cell::Empty => print!("  "),
                    Cell::Filled => print!("xx"),
                    Cell::Locked => print!("██"),
                }
            }
            print!("│");
            if i == 0 {
                println!(" Score: {}", self.score);
            } else {
                println!();
            }
        }
        println!("  └{}┘", "──".repeat(BOARD_WIDTH));
    }

    pub fn new(moves: &str) -> Self {
        Tetris {
            board: vec![vec![Cell::Empty; BOARD_WIDTH]; BOARD_HEIGHT],
            moves: moves.to_string(),
            current_piece: Tetromino::new(match moves.chars().next().unwrap_or('N') {
                'I' => TetrominoShape::I,
                'O' => TetrominoShape::O,
                'T' => TetrominoShape::T,
                'Z' => TetrominoShape::Z,
                'L' => TetrominoShape::L,
                _ => TetrominoShape::Null,
            }),
            score: 0,
            state: 0,
        }
    }

    pub fn tick(&mut self) {
        if self.can_move_down() {
            self.current_piece.move_down();
            self.fill_piece();
        } else {
            self.lock_piece();
            self.clear_lines();
        }
    }

    fn can_move_down(&self) -> bool {
        let new_blocks: Vec<(i32, i32)> = self.current_piece.blocks.iter()
            .map(|&(x, y)| (x, y + 1))
            .collect();
        let new_tetromino = Tetromino {
            shape: self.current_piece.shape,
            blocks: new_blocks,
            position: Position { row: self.current_piece.position.row, col: self.current_piece.position.col },
            rotation: self.current_piece.rotation,
        };
        self.is_valid_position(&new_tetromino)
    }

    fn lock_piece(&mut self) {
        // First clear the filled cells
        self.fill_piece();

        for &(x, y) in &self.current_piece.blocks {
            let board_x = self.current_piece.position.col + x as isize;
            let board_y = self.current_piece.position.row + y as isize;
            if board_y >= 0 && board_y < BOARD_HEIGHT as isize && board_x >= 0 && board_x < BOARD_WIDTH as isize {
                self.board[board_y as usize][board_x as usize] = Cell::Locked;
            }
        }
    }

    fn fill_piece(&mut self) {
        // First clear any previously filled cells
        for row in self.board.iter_mut() {
            for cell in row.iter_mut() {
                if *cell == Cell::Filled {
                    *cell = Cell::Empty;
                }
            }
        }

        // Then fill the current piece's position
        for &(x, y) in &self.current_piece.blocks {
            let board_x = self.current_piece.position.col + x as isize;
            let board_y = self.current_piece.position.row + y as isize;
            if board_y >= 0 && board_y < BOARD_HEIGHT as isize && board_x >= 0 && board_x < BOARD_WIDTH as isize {
                self.board[board_y as usize][board_x as usize] = Cell::Filled;
            }
        }
    }

    fn clear_lines(&mut self) {
        let mut lines_cleared = 0;
        self.board.retain(|row| {
            let full = row.iter().all(|&cell| cell != Cell::Empty);
            if full {
                lines_cleared += 1;
            }
            !full
        });

        while self.board.len() < BOARD_HEIGHT {
            self.board.insert(0, vec![Cell::Empty; BOARD_WIDTH]);
        }
        let null_piece = Tetromino{
            shape: TetrominoShape::Null,
            blocks: vec![],
            position: Position { row: 0, col: 0 },
            rotation: 0,
        };
        self.current_piece = null_piece;

        self.update_score(lines_cleared);
    }

    fn update_score(&mut self, lines_cleared: u32) {
        self.score += match lines_cleared {
            1 => 10,
            2 => 20,
            3 => 30,
            4 => 40,
            _ => 0,
        };
    }

    pub fn move_left(&mut self) {
        let new_position: Vec<(i32, i32)> = self.current_piece.blocks.iter().map(|&(x, y)| (x - 1, y)).collect();
        if self.is_valid_position(&self.current_piece.with_blocks(new_position)) {
            self.current_piece.move_left();
        }
    }

    pub fn move_right(&mut self) {
        let new_position: Vec<(i32, i32)> = self.current_piece.blocks.iter().map(|&(x, y)| (x + 1, y)).collect();
        if self.is_valid_position(&self.current_piece.with_blocks(new_position)) {
            self.current_piece.move_right();
        }
    }
    


    pub fn rotate(&mut self) {
        let rotated_blocks = self.current_piece.blocks.iter().map(|&(x, y)| (-y, x)).collect::<Vec<_>>();
        if self.is_valid_position(&self.current_piece.with_blocks(rotated_blocks)) {
            self.current_piece.rotate();
        }
    }

    // Checks if a tetromino's position is valid:
    // 1. All blocks must be within board boundaries
    // 2. All blocks must occupy empty cells
    fn is_valid_position(&self, tetromino: &Tetromino) -> bool {
        tetromino.blocks.iter().all(|&(x, y)| {
            let board_x = tetromino.position.col + x as isize;
            let board_y = tetromino.position.row + y as isize;
            if board_x >= 0 && board_x < BOARD_WIDTH as isize && 
            board_y >= 0 && board_y < BOARD_HEIGHT as isize {
                self.board[board_y as usize][board_x as usize] == Cell::Empty ||
                self.board[board_y as usize][board_x as usize] == Cell::Filled
            } else {
                false
            }
        })
    }

    pub fn play(&mut self, moves: &str) -> u32 {
        for (i, c) in moves.chars().enumerate() {
            match c {
                'I' | 'O' | 'T' | 'Z' | 'L' | 'J' | 'S' => {
                    self.spawn_new_piece(c);
                },
                '1' => self.move_right(),
                '2' => match self.current_piece.shape {
                    TetrominoShape::T => {
                        match self.current_piece.rotation % 4 {
                            0 => {
                                self.rotate();
                            },
                            1 => {
                                self.rotate();
                            },
                            2 => {
                                self.rotate();
                            },
                            _ => {
                                self.rotate();
                            },
                        }
                    },  
                    TetrominoShape::Z => {
                        match self.current_piece.rotation % 4 {
                            0 => {
                                self.rotate();
                            },
                            1 => {
                                self.rotate();
                            },
                            2 => {
                                self.rotate();
                            },
                            _ => {
                                self.rotate();
                            },
                        }
                    },
                    _ => self.rotate(),
                },
                '3' => self.move_left(),
                '4' => self.tick(),
                _ => {}, // Ignore invalid moves
            }

            // Simulate the piece falling until it can't move down anymore
            // while self.can_move_down() {
            //     self.tick();
            // }
            // self.lock_piece(); // Lock the piece
            // self.print_board();

            // Update the game state
            self.state = i as u32 + 1;
        }
        self.score
    }

    fn spawn_new_piece(&mut self, shape: char) {
        self.current_piece = Tetromino::new(match shape {
            'I' => TetrominoShape::I,
            'O' => TetrominoShape::O,
            'T' => TetrominoShape::T,
            'Z' => TetrominoShape::Z,
            'L' => TetrominoShape::L,
            'J' => TetrominoShape::L, // Assuming J is treated as L
            'S' => TetrominoShape::Z, // Assuming S is treated as Z
            _ => TetrominoShape::L,   // Default to L for invalid shapes
        });
    }
}

#[derive(Clone)]
pub struct Tetromino {
    shape: TetrominoShape,
    blocks: Vec<(i32, i32)>,
    position: Position,
    rotation: usize,
}

impl Tetromino {
    fn new(shape: TetrominoShape) -> Self {
        let blocks = Self::get_blocks(shape, 0);
        
        Tetromino {
            shape,
            blocks,
            position: Position { 
                row: 0, 
                col: 4 as isize 
            },
            rotation: 0,
        }
    }

    fn get_blocks(shape: TetrominoShape, rotation: usize) -> Vec<(i32, i32)> {
        let width = BOARD_WIDTH as i32;
        match shape {
            TetrominoShape::L => match rotation % 4 {
                0 => vec![(0, 0), (0, 1), (0, 2), (1, 2)], // └
                1 => vec![(0, 1), (1, 1), (2, 1), (0, 2)], // ┘
                2 => vec![(0, 0), (1, 0), (1, 1), (1, 2)], // ┐
                3 => vec![(2, 0), (0, 1), (1, 1), (2, 1)], // ┌
                _ => unreachable!(),
            },
            TetrominoShape::Z => match rotation % 4 {
                0 | 2 => vec![(0, 0), (1, 0), (1, 1), (2, 1)],
                1 | 3 => vec![(0, 1), (1, 0), (1, 1), (0, 2)],
                _ => unreachable!(),
            },
            TetrominoShape::T => match rotation % 4 {
                0 => vec![(0, 0), (1, 0), (2, 0), (1, 1)],
                1 => vec![(1, 0), (1, 1), (0, 1), (1, 2)],
                2 => vec![(0, 1), (1, 1), (2, 1), (1, 0)],
                3 => vec![(0, 0), (1, 1), (0, 1), (0, 2)],
                _ => unreachable!(),
            },
            TetrominoShape::O => vec![(0, 0), (1, 0), (0, 1), (1, 1)],
            TetrominoShape::I => match rotation % 4 {
                0 | 2 => vec![(0, 0), (0, 1), (0, 2), (0, 3)],
                1 | 3 => vec![(0, 1), (1, 1), (2, 1), (3, 1)],
                _ => unreachable!(),
            },
            TetrominoShape::Null => vec![]
        }
    }

    fn move_down(&mut self) {
        self.position.row += 1;
    }

    fn move_left(&mut self) {
        self.position.col -= 1;
    }

    fn move_right(&mut self) {
        self.position.col += 1;
    }

    fn rotate(&mut self) {
        self.rotation = (self.rotation + 1) % 4;
        self.blocks = Self::get_blocks(self.shape, self.rotation);
    }

    fn with_blocks(&self, new_blocks: Vec<(i32, i32)>) -> Self {
        Tetromino {
            shape: self.shape,
            blocks: new_blocks,
            position: self.position.clone(),
            rotation: self.rotation,
        }
    }
}

fn replay_tetris(moves: &str, up_to: Option<usize>) -> u32 {
    let mut game = Tetris::new(moves);

    // Use the play method instead of reimplementing the logic
    let moves_to_play = if let Some(limit) = up_to {
        &moves[..limit.min(moves.len())]
    } else {
        moves
    };

    game.play(moves_to_play);
    game.score
}
