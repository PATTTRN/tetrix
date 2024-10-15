export const Controller = () => {
    return (
        <div className="flex items-center justify-center mt-8">
            {/* Controllet */}
            <div className="inline-flex items-center justify-center gap-10 flex-shrink-0">
                <div className="w-[162.367px]">
                    <div
                        className="w-full h-12 flex items-center justify-center rounded-[6.89px] font-medium border-[1.253px] border-[#424242] text-white italic text-sm"
                        id="space-bar"
                        style={{
                            background: "linear-gradient(rgb(66, 66, 66) 0%, rgb(85, 85, 85) 100%)",
                            boxShadow: "rgb(54, 54, 54) 0px 4.307px 0px 0px"
                        }}
                    >
                        <p>SPACE</p>
                    </div>
                    <p className="text-center text-[15px] mt-5 text-[#63666C] font-medium italic">
                        Fire
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div
                        className="w-[46px] h-[42px] flex items-center justify-center rounded-[7.07px] text-sm font-medium border-[1.253px] border-[#424242] text-white italic"
                        id="up-key"
                        style={{
                            background: "linear-gradient(rgb(66, 66, 66) 0%, rgb(85, 85, 85) 100%)",
                            boxShadow: "rgb(54, 54, 54) 0px 4.307px 0px 0px"
                        }}
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 41 41"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <mask
                                id="mask0_27_11715"
                                maskUnits="userSpaceOnUse"
                                x={0}
                                y={0}
                                width={41}
                                height={41}
                                style={{ maskType: "alpha" }}
                            >
                                <rect x="0.5" y="0.380615" width={40} height={40} fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_27_11715)">
                                <path
                                    d="M6.49988 26.5474L20.4999 12.5474L34.4999 26.5474H6.49988Z"
                                    fill="white"
                                />
                            </g>
                        </svg>
                    </div>
                    <p className="text-center text-[15px] mt-5 text-[#63666C] font-medium italic">
                        Move up
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div
                        className="w-[46px] h-[42px] flex items-center justify-center rounded-[7.07px] text-sm font-medium border-[1.253px] border-[#424242] text-white italic"
                        id="down-key"
                        style={{
                            background: "linear-gradient(rgb(66, 66, 66) 0%, rgb(85, 85, 85) 100%)",
                            boxShadow: "rgb(54, 54, 54) 0px 4.307px 0px 0px"
                        }}
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 41 41"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <mask
                                id="mask0_27_11721"
                                maskUnits="userSpaceOnUse"
                                x={0}
                                y={0}
                                width={41}
                                height={41}
                                style={{ maskType: "alpha" }}
                            >
                                <rect
                                    x="40.5"
                                    y="40.3806"
                                    width={40}
                                    height={40}
                                    transform="rotate(-180 40.5 40.3806)"
                                    fill="#D9D9D9"
                                />
                            </mask>
                            <g mask="url(#mask0_27_11721)">
                                <path
                                    d="M34.5001 14.2139L20.5001 28.2139L6.50012 14.2139L34.5001 14.2139Z"
                                    fill="white"
                                />
                            </g>
                        </svg>
                    </div>
                    <p className="text-center text-[15px] mt-5 text-[#63666C] font-medium italic">
                        Move down
                    </p>
                </div>
            </div>


        </div>
    )
}