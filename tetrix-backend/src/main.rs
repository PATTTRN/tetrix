#![no_main]
sp1_zkvm::entrypoint!(main);

use tetrix_backend::tetrix::Tetris;
pub fn main() {
    // read the score and moves from the user
    let score = sp1_zkvm::io::read::<u32>();
    let moves = sp1_zkvm::io::read::<String>();
    let mut new_game = Tetris::new(&moves);
    let is_valid_game = if score == new_game.play(&moves) {
        true
    } else {
        false
    };
    sp1_zkvm::io::commit(&is_valid_game);
}
