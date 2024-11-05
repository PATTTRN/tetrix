'use client'
import NextPiecePreview from "./preview";
import { GameStatus } from "@/types"
import { useTetrisContext } from "@/context/TetrisContext"
import { Nft } from "./nft";
import { useState } from "react";
import { LevelIndicator } from "./level-indicator";

export const SidePanel = () => {
  const { status, score } = useTetrisContext();
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  return <div className="w-[200px] flex-shrink-0 flex flex-col gap-[10px]">
    {/* Game Level */}
    <LevelIndicator/>

    {/* Game Score */}
    <div className="bg-[#1A1A1A] rounded-[13.183px] border-[0.412px] border-[#3A3A3A] flex-1 overflow-hidden relative">
      <div className="h-full flex flex-col justify-between">
        {
          
        }
        {status === GameStatus.PLAYING && <NextPiecePreview />}
        {/* NFT Here */}
        {/* <Nft /> */}

        {/* NFT Image */}
        {status === GameStatus.OVER && <div className="w-full h-full flex flex-col justify-between relative cursor-pointer group"
             onMouseEnter={() => setShowDownloadButton(true)}
             onMouseLeave={() => setShowDownloadButton(false)}>
            <div className="transition-opacity duration-300 group-hover:opacity-70">
              <Nft />
            </div>
            {showDownloadButton && (
              <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white p-2 rounded">
                Download
              </button>
            )}
        </div>}

        <div className="pb-3 px-[14px] flex items-center justify-between uppercase">
          <div className="text-[#ffffff] font-medium">
            <p className="text-[8px]">POINTS:</p>
            <p className="text-base">{score}</p>
          </div>
          <div className="text-[#ffffff] font-medium text-right space-y-1">
            <p className="text-[8px]">level:easy</p>
            <p className="text-[8px]">14 Sep,3:54pm</p>
          </div>
        </div>
      </div>
      <div className="h-full">
      </div>

    </div>
  </div>
};
