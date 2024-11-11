'use client'
import Game from "@/components/new_game";
import { SidePanel } from "@/components/side-panel";
import { TopPanel } from "@/components/top-panel";



export default function Home() {
  return (
      <div className="max-h-screen max-w-screen overflow-hidden flex flex-col w-full h-full" style={{
        opacity: 1,
        willChange: 'auto'
      }}>
        <div className="text-[#848484] w-full h-full grid place-content-center flex-1">

          <div className=" bg-[#111] rounded-[19.774px] border-[0.412px] border-[#242424] p-[10px] flex flex-col sm:flex-row gap-[10px] w-full h-full">
            <div className="flex-1 flex flex-col gap-4 w-full h-full">
              <TopPanel />
              <Game />
            </div>
            <SidePanel />
          </div> 
        </div>

      </div>
  );
}