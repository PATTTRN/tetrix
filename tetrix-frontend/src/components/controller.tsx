"use client";
import { GameStatus } from "@/types";
import { useTetrisContext } from "@/context/TetrisContext";
import { Nft } from "./nft";
import { useState } from "react";

interface ControllerProps {
  onMove: (dx: number, dy: number) => void;
  onRotate: () => void;
}

const ControlButton = ({ onClick, children, className = "" }: { onClick: () => void, children: React.ReactNode, className?: string }) => (
  <button
    className={`w-[30px] h-[26px] flex items-center justify-center rounded-[5px] text-sm font-medium border-[1.253px] border-[#424242] text-white italic hover:opacity-80 active:translate-y-0.5 ${className}`}
    onClick={onClick}
    style={{
      background: "linear-gradient(rgb(66, 66, 66) 0%, rgb(85, 85, 85) 100%)",
      boxShadow: "rgb(54, 54, 54) 0px 4.307px 0px 0px",
    }}
  >
    {children}
  </button>
);

const ArrowIcon = ({ rotation = 0 }: { rotation?: number }) => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path d="M6.5 26.5L20.5 12.5L34.5 26.5H6.5Z" fill="white" />
  </svg>
);

const DownArrowIcon = () => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M34.5 14.2L20.5 28.2L6.5 14.2H34.5Z" fill="white" />
  </svg>
);
const Controls = ({ onMove, onRotate, className }: ControllerProps & { className?: string }) => (
  <div className={`flex justify-between w-full ${className}`}>
    <div className="flex flex-col items-center justify-center flex-shrink-0">
      <div className="flex flex-col items-center">
        <ControlButton onClick={onRotate}>
          <ArrowIcon />
        </ControlButton>
      </div>

      <div className="flex space-x-2 gap-8">
        <ControlButton onClick={() => onMove(-1, 0)}>
          <ArrowIcon rotation={-90} />
        </ControlButton>
        <ControlButton onClick={() => onMove(1, 0)}>
          <ArrowIcon rotation={90} />
        </ControlButton>
      </div>

      <div className="flex flex-col items-center">
        <ControlButton onClick={() => onMove(0, 1)}>
          <DownArrowIcon />
        </ControlButton>
      </div>
    </div>

    <div className="flex flex-col items-center mt-4">
      <button
        onClick={onRotate}
        className="w-12 h-12 rounded-full bg-[#1A1A1A] hover:bg-[#242424] active:bg-[#2E2E2E] border border-[#3A3A3A] transition-all duration-150 flex items-center justify-center"
      >
      </button>
    </div>
  </div>
);

const GameOverNft = ({ showDownloadButton, setShowDownloadButton }: { showDownloadButton: boolean, setShowDownloadButton: (show: boolean) => void }) => (
  <div
    className="w-full h-full flex flex-col justify-between relative cursor-pointer group"
    onMouseEnter={() => setShowDownloadButton(true)}
    onMouseLeave={() => setShowDownloadButton(false)}
  >
    <div className="transition-opacity duration-300 group-hover:opacity-70">
      <Nft />
    </div>
    {showDownloadButton && (
      <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white p-2 rounded">
        Download
      </button>
    )}
  </div>
);

export const Controller: React.FC<ControllerProps> = ({ onMove, onRotate }) => {
  const { status } = useTetrisContext();
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  return (
    <div className="flex w-full mt-2 gap-4">
      <Controls onMove={onMove} onRotate={onRotate} className="w-full" />
      
      <div className="bg-[#1A1A1A] rounded-[13.183px] border-[0.412px] border-[#3A3A3A] inline-block sm:flex-1 overflow-hidden relative">
        <div className="h-full flex flex-col justify-between">
          {status !== GameStatus.OVER ? (
            <div className="md:hidden" />
          ) : (
            <GameOverNft 
              showDownloadButton={showDownloadButton}
              setShowDownloadButton={setShowDownloadButton}
            />
          )}
        </div>
      </div>
    </div>
  );
};
