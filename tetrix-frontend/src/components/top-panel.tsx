import { Life } from "./life"

export const TopPanel = () => {
    return <div className="flex items-center justify-between relative bg-[#1D1D1D] border-[0.412px] border-[#3A3A3A] rounded-[13.183px] px-5 py-3 h-[60px] flex-shrink-0">
    <div className="flex items-center gap-2 text-white">
      <p className="font-medium uppercase text-xs">High Score:</p>
      <span className="text-2xl whitespace-nowrap">0</span>
    </div>
    <div className="flex items-center gap-1 font-medium absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white">
      <p className="uppercase text-xs">SCORE:</p>
      <p className="text-2xl">1000</p>
    </div>
        <Life />
    </div>
}