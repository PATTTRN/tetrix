use tetrix_backend::tetrix::Tetris;

fn main() {
    let moves = "Z44234334344444444444444I4444444243344444444443334333333334O14114144444444444444444T4442424144444444444444T44444";
    let mut new_game = Tetris::new(&moves);
    new_game.play(&moves);
    new_game.print_board();
}
