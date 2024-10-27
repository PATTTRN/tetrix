const BOARD_WIDTH: usize = 10;
const BOARD_HEIGHT: usize = 20;

#[derive(Clone, Copy, PartialEq)]
enum Cell {
    Empty,
    Filled(bool),
}

#[derive(Clone, Copy, PartialEq)]
enum TetrominoShape {
    L,
    Z,
    T,
    O,
    I,
}

struct Tetris {
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
        println!("  0 1 2 3 4 5 6 7 8 9");
        println!(" ┌{}┐", "──".repeat(BOARD_WIDTH));
        for (i, row) in self.board.iter().enumerate() {
            print!("{}", (b'A' + i as u8) as char);
            print!("│");
            for &cell in row {
                match cell {
                    Cell::Empty => print!("  "),
                    Cell::Filled(_) => print!("██"),
                }
            }
            print!("│");
            if i == 0 {
                println!(" Score: {}", self.score);
            } else {
                println!();
            }
        }
        println!(" └{}┘", "──".repeat(BOARD_WIDTH));
    }

    pub fn new(moves: &str) -> Self {
        Tetris {
            board: vec![vec![Cell::Empty; BOARD_WIDTH]; BOARD_HEIGHT],
            moves: moves.to_string(),
            current_piece: Tetromino::new(match moves.chars().next().unwrap_or('L') {
                'I' => TetrominoShape::I,
                'O' => TetrominoShape::O,
                'T' => TetrominoShape::T,
                'Z' => TetrominoShape::Z,
                _ => TetrominoShape::L,
            }),
            score: 0,
            state: 0,
        }
    }

    pub fn tick(&mut self) {
        if self.can_move_down() {
            self.current_piece.move_down();
        } else {
            self.lock_piece();
            self.clear_lines();
        }
    }

    fn can_move_down(&self) -> bool {
        let new_blocks: Vec<(i32, i32)> = self.current_piece.blocks.iter()
            .map(|&(x, y)| (x + 1, y))
            .collect();
        let new_tetromino = Tetromino {
            shape: self.current_piece.shape,
            blocks: new_blocks,
            position: Position { row: self.current_piece.position.row + 1, col: self.current_piece.position.col },
            rotation: self.current_piece.rotation,
        };
        self.is_valid_position(&new_tetromino)
    }

    fn lock_piece(&mut self) {
        for &(x, y) in &self.current_piece.blocks {
            let board_x = self.current_piece.position.col + x as isize;
            let board_y = self.current_piece.position.row + y as isize;
            if board_y >= 0 && board_y < BOARD_HEIGHT as isize && board_x >= 0 && board_x < BOARD_WIDTH as isize {
                self.board[board_y as usize][board_x as usize] = Cell::Filled(true);
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

        self.update_score(lines_cleared);
    }

    fn update_score(&mut self, lines_cleared: u32) {
        self.score += match lines_cleared {
            1 => 100,
            2 => 300,
            3 => 500,
            4 => 800,
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

    fn is_valid_position(&self, tetromino: &Tetromino) -> bool {
        tetromino.blocks.iter().all(|&(x, y)| {
            let board_x = tetromino.position.col + x as isize;
           let board_y = tetromino.position.row + y as isize;
            board_x >= 0 && board_x < BOARD_WIDTH as isize && 
            board_y >= 0 && board_y < BOARD_HEIGHT as isize &&
            self.board[board_y as usize][board_x as usize] == Cell::Empty
        })
    }

    pub fn play(&mut self, moves: &str) {
        for (i, c) in moves.chars().enumerate() {
            match c {
                'I' | 'O' | 'T' | 'Z' | 'L' | 'J' | 'S' => {
                    self.lock_piece();
                    self.clear_lines();
                    self.spawn_new_piece(c);
                },
                '1' => self.current_piece.move_right(),
                '2' => match self.current_piece.shape {
                    TetrominoShape::Z => {
                        match self.current_piece.rotation % 4 {
                            0 => {
                                self.current_piece.rotate();
                                self.current_piece.move_right();
                            },
                            1 => {
                                self.current_piece.rotate();
                                self.current_piece.move_right(); 
                            },
                            2 => {
                                self.current_piece.rotate();
                                self.current_piece.move_left(); 
                                self.current_piece.move_left(); 
                            },
                            _ => {
                                self.current_piece.rotate();
                            },
                        }
                    },
                    _ => self.current_piece.rotate(),
                },
                '3' => self.current_piece.move_left(),
                '4' => self.current_piece.move_down(),
                _ => {}, // Ignore invalid moves
            }

            // Simulate the piece falling until it can't move down anymore
            // while self.can_move_down() {
            //     self.tick();
            // }
            // self.lock_piece(); // Lock the piece
            self.print_board();

            // Update the game state
            self.state = i as u32 + 1;
        }
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
    rotation: u32,
}

impl Tetromino {
    fn new(shape: TetrominoShape) -> Self {
        let blocks = match shape {
            TetrominoShape::I => vec![(0,0), (0,1), (0,2), (0,3)], // I-shape: ████
            TetrominoShape::O => vec![(0,0), (1,0), (0,1), (1,1)], // O-shape: ██
                                                                   //          ██
            TetrominoShape::T => vec![(1,0), (0,1), (1,1), (2,1)], // T-shape:  █
                                                                   //          ███
            TetrominoShape::Z => vec![(0,0), (1,0), (1,1), (2,1)], // Z-shape: ██
                                                                   //           ██
            TetrominoShape::L => vec![(2,0), (0,1), (1,1), (2,1)], // L-shape:   █
                                                                   //          ███
        };
        
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
        self.blocks = self.rotated_blocks();
        self.rotation += 1;
    }

    fn rotated_blocks(&self) -> Vec<(i32, i32)> {
        self.blocks.iter().map(|&(x, y)| (-y, x)).collect()
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

fn main() {
    let moves1 = "Z22222224444444444I444O";
    let moves4 = "O444444444444444444O224444444444444444444O44444444444444433444O4444444444444444333344O4444444444444444411114O44444444444444444114O";
    let moves3 = "T44444444433333433444444444O44444344444444444444Z4414444444414434444444L441411111111444444343433333333344444O4441111411444444444444444L4444334341143444444444Z44344444444444444441414344444444444444O44111111444444444444444L44444111111141111444444444I4441411444444444444T444434333333334444444444444444434411414444444I441411111144444444444L444444444444411411111144O344444444444444444L4444443444444444T44343334141111111444444444Z444444344444444444414344444444I44343333333344444444444Z4444443334333444444I444443343144444444L444444411444444414411444444444T434344444444444I41111141111444444444O44443433333344444444I444411141444444L44433333334444444I414444444444O443443444444444Z4434434333344444I44444444444T444443344444L4141444444444Z444414111444444O44444144444443333333433333344444444343444444L44343333333444T44441144444I44444444414444T4141111144444L4444O4Z";
    let moves2 = "T44444444433333433444444444O44444344444444444444Z4414444444414434444444L441411111111444444343433333333344444O4441111411444444444444444L4444334341143444444444Z44344444444444444441414344444444444444O44111111444444444444444L44444111111141111444444444I4441411444444444444T444434333333334444444444444444434411414444444I441411111144444444444L444444444444411411111144O344444444444444444L4444443444444444T44343334141111111444444444Z444444344444444444414344444444I44343333333344444444444Z4444443334333444444I444443343144444444L444444411444444414411444444444T434344444444444I41111141111444444444O44443433333344444444I444411141444444L44433333334444444I414444444444O443443444444444Z4434434333344444I44444444444T444443344444L4141444444444Z444414111444444O44444144444443333333433333344444444343444444L44343333333444T44441144444I44444444414444T4141111144444L4444O4Z";
    let moves = "Z4411111411114444444444444444I444424343333333344444444444444L444444444444444444444444144444444444444444141444444444Z4441111411114444444444444L444433433333444444444444Z444334344444444444444I4444434444444444Z444444343333333334444444444I4444411114111114444444444O444444433333343333314111111143444444444434333333333444444444444Z444442444444444444O444111141444444444444L44444243434444444444T444414444444444444O4433333333434444444444444I4444444441144334444T443434342242144444444444T44444442144444444444O4444141111111444444444444444414111111114444444444L444424244444444444Z4444444443433333444444T44444444444444Z4444444444444444444444O44444444I4444T4444I4O";
    let mut new_game = Tetris::new(&moves1);
    new_game.play(&moves1);
}
