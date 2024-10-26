"use client"
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';

export const Game: React.FC = () => {
    const [score, setScore] = useState(0);
    const [squares, setSquares] = useState<string[]>(Array(200).fill(''));
    const [displaySquares, setDisplaySquares] = useState<string[]>(Array(16).fill(''));
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Game constants
    const width = 10;
    const colors = useMemo(() => ['orange', 'blue', 'purple', 'red', 'green'], []);
    
    // Refs for game state
    const currentPositionRef = useRef(4);
    const currentRotationRef = useRef(0);
    const randomRef = useRef(Math.floor(Math.random() * 5));
    const nextRandomRef = useRef(Math.floor(Math.random() * 5));
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);

    const tetrominoes = useMemo(() => {
        return {
            L: [
                [1, width + 1, width * 2 + 1, 2],
            [width, width + 1, width + 2, width * 2 + 2],
            [1, width + 1, width * 2 + 1, width * 2],
            [width, width * 2, width * 2 + 1, width * 2 + 2]
        ],
        Z: [
            [0, width, width + 1, width * 2 + 1],
            [width + 1, width + 2, width * 2, width * 2 + 1],
            [0, width, width + 1, width * 2 + 1],
            [width + 1, width + 2, width * 2, width * 2 + 1]
        ],
        T: [
            [1, width, width + 1, width + 2],
            [1, width + 1, width + 2, width * 2 + 1],
            [width, width + 1, width + 2, width * 2 + 1],
            [1, width, width + 1, width * 2 + 1]
        ],
        O: [
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1]
        ],
        I: [
            [1, width + 1, width * 2 + 1, width * 3 + 1],
            [width, width + 1, width + 2, width + 3],
            [1, width + 1, width * 2 + 1, width * 3 + 1],
            [width, width + 1, width + 2, width + 3]
            ]
        };
    }, []) ;

    const theTetrominos = useMemo(() => [
        tetrominoes.L,
        tetrominoes.Z,
        tetrominoes.T,
        tetrominoes.O,
        tetrominoes.I
    ], [tetrominoes]);

    const getCurrentTetromino = useCallback(() => {
        return theTetrominos[randomRef.current][currentRotationRef.current];
    }, [theTetrominos]);

    const draw = useCallback(() => {
        setSquares(prev => {
            const newSquares = [...prev];
            getCurrentTetromino().forEach(index => {
                const position = currentPositionRef.current + index;
                if (position >= 0 && position < 200) {
                    if (!newSquares[position].includes('taken')) {
                        newSquares[position] = colors[randomRef.current];
                    }
                }
            });
            return newSquares;
        });
    }, [getCurrentTetromino, colors]);

    const undraw = useCallback(() => {
        setSquares(prev => {
            const newSquares = [...prev];
            getCurrentTetromino().forEach(index => {
                const position = currentPositionRef.current + index;
                if (position >= 0 && position < 200) {
                    if (!newSquares[position].includes('taken')) {
                        newSquares[position] = '';
                    }
                }
            });
            return newSquares;
        });
    }, [getCurrentTetromino]);

    const isValidMove = useCallback((newPosition: number) => {
        return getCurrentTetromino().every(index => {
            const position = newPosition + index;
            // Check bounds
            if (position >= 200) return false;
            if (position < 0) return false;
            
            // Check if position is taken
            if (squares[position]?.includes('taken')) return false;
            
            // Check row crossing
            const currentCol = currentPositionRef.current % width;
            const newCol = newPosition % width;
            const pieceCol = (newPosition + index) % width;
            
            // Prevent wrapping around edges
            if (currentCol < newCol && pieceCol < newCol) return false;
            if (currentCol > newCol && pieceCol > newCol) return false;
            
            return true;
        });
    }, [getCurrentTetromino, squares]);

    const checkGameOver = useCallback(() => {
        // Check if any squares in the top row are taken
        return squares.slice(0, width).some(square => square.includes('taken'));
    }, [squares]);

    const updateDisplayShape = useCallback(() => {
        const displayWidth = 4;
        const upNextTetrominoes = [
            [1, displayWidth + 1, displayWidth * 2 + 1, 2],
            [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
            [1, displayWidth, displayWidth + 1, displayWidth + 2],
            [0, 1, displayWidth, displayWidth + 1],
            [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
        ];

        setDisplaySquares(Array(16).fill('').map((_, index) => {
            if (upNextTetrominoes[nextRandomRef.current].includes(index)) {
                return colors[nextRandomRef.current];
            }
            return '';
        }));
    }, [colors]);

    const checkRows = useCallback(() => {
        for (let i = 0; i < 200; i += width) {
            const row = Array.from({length: width}, (_, j) => i + j);
            
            if (row.every(index => squares[index].includes('taken'))) {
                // Increase the score
                setScore(prev => prev + 10);
                
                // Remove the row and add empty row at top
                setSquares(prev => {
                    const newSquares = [...prev];
                    row.forEach(index => newSquares[index] = '');
                    
                    // Move all rows above down
                    for (let k = i; k >= width; k -= width) {
                        for (let j = 0; j < width; j++) {
                            newSquares[k + j] = newSquares[k - width + j];
                        }
                    }
                    // Clear top row
                    for (let j = 0; j < width; j++) {
                        newSquares[j] = '';
                    }
                    return newSquares;
                });
            }
        }
    }, [squares]);

    const moveDown = useCallback(() => {
        if (!isPlaying || gameOver) return false;

        undraw();
        const newPosition = currentPositionRef.current + width;
        
        if (isValidMove(newPosition)) {
            currentPositionRef.current = newPosition;
            draw();
            return true;
        } else {
            draw(); // Redraw at current position
            
            // Freeze the piece
            setSquares(prev => {
                const newSquares = [...prev];
                getCurrentTetromino().forEach(index => {
                    const position = currentPositionRef.current + index;
                    if (position >= 0 && position < 200) {
                        newSquares[position] = colors[randomRef.current] + ' taken';
                    }
                });
                return newSquares;
            });

            // Check for game over
            if (checkGameOver()) {
                setGameOver(true);
                setIsPlaying(false);
                if (timerIdRef.current) {
                    clearInterval(timerIdRef.current);
                    timerIdRef.current = null;
                }
                return false;
            }

            // Start new piece
            currentPositionRef.current = 4;
            currentRotationRef.current = 0;
            randomRef.current = nextRandomRef.current;
            nextRandomRef.current = Math.floor(Math.random() * 5);
            
            checkRows();
            updateDisplayShape();
            draw();
            return false;
        }
    }, [draw, undraw, getCurrentTetromino, isValidMove, isPlaying, gameOver, checkGameOver, checkRows, updateDisplayShape, colors]);

    const moveLeft = useCallback(() => {
        if (!isPlaying || gameOver) return;
        
        undraw();
        const newPosition = currentPositionRef.current - 1;
        if (isValidMove(newPosition)) {
            currentPositionRef.current = newPosition;
        }
        draw();
    }, [draw, undraw, isValidMove, isPlaying, gameOver]);

    const moveRight = useCallback(() => {
        if (!isPlaying || gameOver) return;
        
        undraw();
        const newPosition = currentPositionRef.current + 1;
        if (isValidMove(newPosition)) {
            currentPositionRef.current = newPosition;
        }
        draw();
    }, [draw, undraw, isValidMove, isPlaying, gameOver]);

    const rotate = useCallback(() => {
        if (!isPlaying || gameOver) return;
        
        undraw();
        const nextRotation = (currentRotationRef.current + 1) % 4;
        const currentTetromino = theTetrominos[randomRef.current][nextRotation];
        
        // Check if rotation is valid
        const isValidRotation = currentTetromino.every(index => {
            const position = currentPositionRef.current + index;
            return position >= 0 && 
                   position < 200 && 
                   !squares[position]?.includes('taken') &&
                   Math.floor((currentPositionRef.current + index) / width) === 
                   Math.floor((currentPositionRef.current + currentTetromino[0]) / width);
        });

        if (isValidRotation) {
            currentRotationRef.current = nextRotation;
        }
        draw();
    }, [draw, undraw, squares, isPlaying, gameOver, theTetrominos]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying || gameOver) return;

            switch(e.key) {
                case 'ArrowLeft': 
                    moveLeft();
                    break;
                case 'ArrowRight': 
                    moveRight();
                    break;
                case 'ArrowDown': 
                    moveDown();
                    break;
                case 'ArrowUp': 
                    rotate();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, gameOver, moveLeft, moveRight, moveDown, rotate]);

    useEffect(() => {
        if (isPlaying && !gameOver) {
            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
            }
            timerIdRef.current = setInterval(() => {
                moveDown();
            }, 500);

            // Initial draw
            draw();
            updateDisplayShape();
        }

        return () => {
            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
                timerIdRef.current = null;
            }
        };
    }, [isPlaying, gameOver, moveDown, draw, updateDisplayShape, timerIdRef]);

    const togglePlay = () => {
        if (gameOver) {
            // Reset game
            setSquares(Array(200).fill(''));
            setScore(0);
            setGameOver(false);
            currentPositionRef.current = 4;
            currentRotationRef.current = 0;
            randomRef.current = Math.floor(Math.random() * 5);
            nextRandomRef.current = Math.floor(Math.random() * 5);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="bg-[#2E2E2E] mt-[10px] rounded-[13.183px] flex flex-col overflow-hidden relative h-[612px] border-[0.824px] border-[#444] p-5">
            <div className="flex justify-between mb-5">
                <h3 className="text-white text-[20px]">
                    Score: <span>{gameOver ? 'Game Over' : score}</span>
                </h3>
                <button 
                    onClick={togglePlay}
                    className="text-white text-[20px] bg-[#444] px-3 py-1 rounded"
                >
                    {isPlaying ? 'Pause' : gameOver ? 'New Game' : 'Start'}
                </button>
            </div>
            <div className="grid container flex gap-[50px]">
                <div className="w-[200px] h-[400px] flex flex-wrap bg-[#111]">
                    {squares.map((color, index) => (
                        <div 
                            key={index} 
                            className="w-[20px] h-[20px]"
                            style={{
                                backgroundColor: color.includes('taken') 
                                    ? color.split(' ')[0] 
                                    : color
                            }}
                        />
                    ))}
                </div>
                <div>
                    <h4 className="text-white mb-2">Next:</h4>
                    <div className="mini-grid w-[80px] h-[80px] flex flex-wrap bg-[#111]">
                        {displaySquares.map((color, index) => (
                            <div 
                                key={index} 
                                className="w-[20px] h-[20px]"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};