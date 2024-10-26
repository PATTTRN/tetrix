import React from 'react';
import { useTetrisContext } from '@/context/TetrisContext';


const NextPiecePreview: React.FC = () => {
  const { nextPiece } = useTetrisContext();
  const previewSize = 4;

  const createEmptyPreviewBoard = () => 
    Array.from(Array(previewSize), () =>
      Array.from(Array(previewSize), () => ({
        filled: false,
        fixed: false,
        color: '#1a1a1a'
      }))
    );

  const previewBoard = createEmptyPreviewBoard();
  if (nextPiece?.shape) {
    // Calculate offsets to center the piece
    const offsetX = Math.floor((previewSize - nextPiece.shape[0].length) / 2);
    const offsetY = Math.floor((previewSize - nextPiece.shape.length) / 2);

    // Draw the piece
    nextPiece.shape.forEach((row: string[], y: number) => {
      row.forEach((value, x) => {
        if (value) {
          const previewX = x + offsetX;
          const previewY = y + offsetY;
          if (previewX >= 0 && previewX < previewSize && previewY >= 0 && previewY < previewSize) {
            previewBoard[previewY][previewX] = {
              filled: true,
              fixed: false,
              color: nextPiece.color
            };
          }
        }
      });
    });
  }

  return (
    <div className="next-piece-preview min-h-[20vh] h-[20vh] p-4">
      <h3>Next Piece</h3>
      <div className="w-full h-full flex flex-col border-l border-t border-gray-400">
            {previewBoard.map((row, y) => (
                    <div key={y} className="w-full flex-1 flex">
                        {row.map((cell, x) => (
                                <div
                                    key={x}
                                    className="flex-1 h-full border-r border-b border-gray-400"
                                    style={{backgroundColor: cell.color}}
                                />
                            )
                        )}
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default NextPiecePreview;