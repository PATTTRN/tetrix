'use client'
import { Controller } from "@/components/controller";
import Game from "@/components/new_game";
import { SidePanel } from "@/components/side-panel";
import { TopPanel } from "@/components/top-panel";
import { useTetrisContext } from "@/context/TetrisContext"



export default function Home() {
  return (
      <div className="max-h-screen h-screen overflow-hidden flex flex-col" style={{
        opacity: 1,
        willChange: 'auto'
      }}>
        <div className="text-[#848484] px-4 sm:px-10 w-full h-full grid place-content-center flex-1">

          <div className=" bg-[#111] rounded-[19.774px] border-[0.412px] border-[#242424] p-[10px] flex flex-col sm:flex-row gap-[10px]">
            <div className="flex-1 flex flex-col">
              <TopPanel />
              <Game />
            </div>
            <SidePanel />
          </div> 
        </div>

      </div>
  );
}