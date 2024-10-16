"use client"
import React, { useEffect, useState, useRef } from 'react';

export const Game: React.FC = () => {
    const [score, setScore] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);
    const miniGridRef = useRef<HTMLDivElement>(null);
    const scoreDisplayRef = useRef<HTMLSpanElement>(null);
    const startBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!gridRef.current || !miniGridRef.current || !scoreDisplayRef.current || !startBtnRef.current) return;

        const grid = gridRef.current;
        let squares = Array.from(grid.querySelectorAll('div'));
        const scoreDisplay = scoreDisplayRef.current;
        const startBtn = startBtnRef.current;
        const width = 10;
        let timerId: NodeJS.Timeout | null = null;
        let nextRandom = 0;
        const colors = ['orange', 'blue', 'purple', 'red', 'green'];

        // Tetromino shapes
        const lTetromino = [
            [1, width+1, width*2+1, 2],
            [width, width+1, width+2, width*2+2],
            [1, width+1, width*2+1, width*2],
            [width, width*2, width*2+1, width*2+2]
        ];
        const zTetromino = [
            [0, width, width+1, width*2+1],
            [width+1, width+2, width*2, width*2+1],
            [0, width, width+1, width*2+1],
            [width+1, width+2, width*2, width*2+1]
        ];
        const tTetromino = [
            [1, width, width+1, width+2],
            [1, width+1, width+2, width*2+1],
            [width, width+1, width+2, width*2+1],
            [1, width, width+1, width*2+1]
        ];
        const oTetromino = [
            [0, 1, width, width+1],
            [0, 1, width, width+1],
            [0, 1, width, width+1],
            [0, 1, width, width+1]
        ];
        const iTetromino = [
            [1, width+1, width*2+1, width*3+1],
            [width, width+1, width+2, width+3],
            [1, width+1, width*2+1, width*3+1],
            [width, width+1, width+2, width+3]
        ];

        const theTetrominos = [lTetromino, zTetromino, tTetromino, iTetromino, oTetromino];

        let currentPosition = 4;
        let currentRotation = 0;
        let random = Math.floor(Math.random()*theTetrominos.length);
        let current = theTetrominos[random][currentRotation];

        // Functions
        function draw() {
            current.forEach(index => {
                squares[currentPosition + index].classList.add('tetromino');
                squares[currentPosition + index].style.backgroundColor = colors[random];
            });
        }

        function undraw() {
            current.forEach(index => {
                squares[currentPosition + index].classList.remove('tetromino');
                squares[currentPosition + index].style.backgroundColor = '';
            });
        }

        function control(e: KeyboardEvent) {
            if (e.keyCode === 37) {
                moveLeft();
            } else if (e.keyCode === 38) {
                rotate();
            } else if (e.keyCode === 39) {
                moveRight();
            } else if (e.keyCode === 40) {
                moveDown();
            }
        }

        function freeze() {
            if (current.some(index => squares[currentPosition + index + width].classList.contains('taken')) || 
                current.some(index => currentPosition + index >= squares.length - width)) {
                current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        
                random = nextRandom;
                nextRandom = Math.floor(Math.random() * theTetrominos.length);
                current = theTetrominos[random][currentRotation];
                currentPosition = 4;
                draw();
                displayShape();
                addScore();
                gameOver();
            }
        }

        function displayShape() {
            const displaySquares = Array.from(miniGridRef.current!.querySelectorAll('div'));
            const displayWidth = 4;
            const displayIndex = 0;
            const upNextTetrominoes = [
                [1, displayWidth+1, displayWidth*2+1, 2], // lTetromino
                [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetromino
                [1, displayWidth, displayWidth+1, displayWidth+2], // tTetromino
                [0, 1, displayWidth, displayWidth+1], // oTetromino
                [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetromino
            ];

            displaySquares.forEach(square => {
                square.classList.remove('tetromino');
                square.style.backgroundColor = '';
            });
            upNextTetrominoes[nextRandom].forEach(index => {
                displaySquares[displayIndex + index].classList.add('tetromino');
                displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
            });
        }
        
        function moveDown() {
            undraw();
            currentPosition += width;
            draw();
            freeze();
        }
    
        function moveLeft() {
            undraw();
            const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    
            if (!isAtLeftEdge) {
                currentPosition -= 1;
            }
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition += 1;
            }
            draw();
        }
    
        function moveRight() {
            undraw();
            const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    
            if (!isAtRightEdge) currentPosition += 1;
    
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition -= 1;
            }
            draw();
        }
        
        function rotate() {
            undraw();
            currentRotation++;
            if (currentRotation === current.length) { // if the current rotation gets to 4, make it go back to 0
                currentRotation = 0;
            }
            current = theTetrominos[random][currentRotation];
            draw();
        }

        function addScore() {
            for (let i = 0; i < 199; i += width) {
                const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
                if (row.every(index => squares[index].classList.contains('taken'))) {
                    setScore(prevScore => prevScore + 10);
                    scoreDisplay.innerHTML = (score + 10).toString();
        
                    // Remove the filled row from the DOM
                    row.forEach(index => {
                        squares[index].classList.remove('taken');
                        squares[index].classList.remove('tetromino');
                        squares[index].style.backgroundColor = '';
                    });
        
                    // Move down all the rows above the cleared row
                    const squaresRemoved = squares.splice(i, width);
                    squares = squaresRemoved.concat(squares);
                    squares.forEach(cell => grid.appendChild(cell));
                }
            }
        }
        
        function gameOver() {
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                scoreDisplay.innerHTML = 'Game Over';
                if (timerId) clearInterval(timerId);
            }
        }

        // Event listeners
        document.addEventListener('keyup', control);
        startBtn.addEventListener('click', () => {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            } else {
                draw();
                timerId = setInterval(moveDown, 500);
                nextRandom = Math.floor(Math.random() * theTetrominos.length);
                displayShape();
            }
        });

        // Cleanup
        return () => {
            document.removeEventListener('keyup', control);
            if (timerId) clearInterval(timerId);
        };
    }, [score]); // Add score to the dependency array

    return (
        <div className="bg-[#2E2E2E] mt-[10px] rounded-[13.183px] flex flex-col overflow-hidden relative h-[612px] border-[0.824px] border-[#444] p-5">
            <div className="flex justify-between mb-5">
                <h3 className="text-white text-[20px]">Score: <span ref={scoreDisplayRef} id="score">0</span></h3>
                <button ref={startBtnRef} id="start-button" className="text-white text-[20px] bg-[#444] px-3 py-1 rounded">Start/Pause</button>
            </div>
            <div className="grid container flex flex-row gap-[50px]">
                <div ref={gridRef} className="w-[200px] h-[400px] flex flex-wrap bg-[#111]">
                    {Array(200).fill(null).map((_, index) => (
                        <div key={index} className="w-[20px] h-[20px]"></div>
                    ))}
                    {Array(10).fill(null).map((_, index) => (
                        <div key={`taken-${index}`} className="h-5 w-5 taken"></div>
                    ))}
                </div>
                <div>
                    <h4 className="text-white mb-2">Next:</h4>
                    <div ref={miniGridRef} className="mini-grid w-[80px] h-[80px] flex flex-wrap bg-[#111]">
                        {Array(16).fill(null).map((_, index) => (
                            <div key={index} className="w-[20px] h-[20px]"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
