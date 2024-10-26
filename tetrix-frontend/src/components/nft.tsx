type NftProps = {
  className?: string;
}

export function Nft(props: NftProps) {
  const { className, ...svgProps } = props;
  return (
    <svg
      className={`w-full h-full flex-shrink-0 ${className || ''}`}
      viewBox="0 0 464 434"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        d="M366.295 401.371V183.352c0-16.724-12.268-30.537-27.711-30.537H131.932c-15.443 0-27.726 13.812-27.726 30.537v218.019c0 20.476 18.136 35.49 36.236 29.045l87.304-31.021s0 0 0 0a22.346 22.346 0 0115.024 0s0 0 0 0l87.29 31.021c18.114 6.444 36.235-8.569 36.235-29.045z"
        stroke="#323232"
        strokeWidth={3}
      />
      <path
        d="M224.441 385.124l.042-.015.041-.018c72.032-31.201 123.006-102.31 124.513-185.915.03-1.274.03-2.546.03-3.797v-6.314a26.44 26.44 0 00-.251-3.776c-.865-6.2-3.892-10.756-8.292-13.728-4.359-2.945-9.966-4.272-15.956-4.272H134.595c-8.687 0-15.723 7.036-15.723 15.723v7.674a28.749 28.749 0 00-.222 3.589v205.853c0 11.54 11.585 19.503 22.362 15.346l83.429-30.35z"
        stroke="#323232"
        strokeWidth={3}
      />
      <mask
        id="e"
        maskUnits="userSpaceOnUse"
        x={117}
        y={165}
        width={234}
        height={254}
        style={{
          maskType: "alpha"
        }}
      >
        <path
          d="M224.441 385.124l.042-.015.041-.018c72.032-31.201 123.006-102.309 124.513-185.915.03-1.274.03-2.546.03-3.797v-6.314a26.44 26.44 0 00-.251-3.776c-.865-6.2-3.892-10.756-8.292-13.728-4.359-2.945-9.966-4.272-15.956-4.272H134.595c-8.687 0-15.723 7.036-15.723 15.723v7.674a28.749 28.749 0 00-.222 3.589v205.853c0 11.541 11.585 19.503 22.362 15.346l83.429-30.35z"
          fill="url(#paint8_linear_27_11663)"
          stroke="url(#paint9_linear_27_11663)"
          strokeWidth={3}
        />
      </mask>
      <g mask="url(#e)">
        <path
          d="M178.469 375.957v1.5h96.353v-21.67h-37.341v-26.252c7.367-1.821 13.99-5.054 19.852-9.698 5.967-4.726 10.41-10.618 13.318-17.653 11.644-1.592 21.444-6.824 29.345-15.663 8.103-9.067 12.167-19.731 12.167-31.923v-9.335c0-5.536-1.988-10.312-5.924-14.247-3.935-3.935-8.711-5.924-14.247-5.924h-17.17v-18.67h-96.353v18.67h-17.171c-5.535 0-10.311 1.989-14.247 5.924-3.935 3.935-5.924 8.711-5.924 14.247v9.335c0 12.192 4.064 22.856 12.168 31.923 7.9 8.839 17.701 14.071 29.344 15.663 2.908 7.035 7.352 12.927 13.319 17.653 5.861 4.644 12.484 7.877 19.852 9.698v26.252h-37.341v20.17zm-15.671-129.194h15.671v31.754c-4.398-1.961-7.996-4.894-10.82-8.81-3.237-4.487-4.851-9.508-4.851-15.109v-7.835zm122.844 22.944c-2.825 3.916-6.423 6.849-10.82 8.81v-31.754h15.67v7.835c0 5.601-1.614 10.622-4.85 15.109z"
          stroke="#323232"
          strokeWidth={3}
        />
      </g>
      
      <defs>
        <linearGradient
          id="paint0_linear_27_11663"
          x1={523.357}
          y1={-131.312}
          x2={523.357}
          y2={114.988}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4E4C" />
          <stop offset={1} stopColor="#992F2E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_27_11663"
          x1={523.357}
          y1={-131.312}
          x2={523.357}
          y2={114.988}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE3F" />
          <stop offset={1} stopColor="#997C26" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_27_11663"
          x1={233.859}
          y1={-131.312}
          x2={233.859}
          y2={114.988}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4E4C" />
          <stop offset={1} stopColor="#992F2E" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_27_11663"
          x1={233.859}
          y1={-131.312}
          x2={233.859}
          y2={114.988}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE3F" />
          <stop offset={1} stopColor="#997C26" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_27_11663"
          x1={-62.1407}
          y1={-131.312}
          x2={-62.1407}
          y2={114.988}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4E4C" />
          <stop offset={1} stopColor="#992F2E" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_27_11663"
          x1={-62.1407}
          y1={-131.312}
          x2={-62.1407}
          y2={114.988}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE3F" />
          <stop offset={1} stopColor="#997C26" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_27_11663"
          x1={523.357}
          y1={168.789}
          x2={523.357}
          y2={415.09}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4E4C" />
          <stop offset={1} stopColor="#992F2E" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_27_11663"
          x1={523.357}
          y1={168.789}
          x2={523.357}
          y2={415.09}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE3F" />
          <stop offset={1} stopColor="#997C26" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_27_11663"
          x1={233.859}
          y1={168.789}
          x2={233.859}
          y2={415.09}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4E4C" />
          <stop offset={1} stopColor="#992F2E" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_27_11663"
          x1={233.859}
          y1={168.789}
          x2={233.859}
          y2={415.09}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE3F" />
          <stop offset={1} stopColor="#997C26" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_27_11663"
          x1={-62.1407}
          y1={168.789}
          x2={-62.1407}
          y2={415.09}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4E4C" />
          <stop offset={1} stopColor="#992F2E" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_27_11663"
          x1={-62.1407}
          y1={168.789}
          x2={-62.1407}
          y2={415.09}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE3F" />
          <stop offset={1} stopColor="#997C26" />
        </linearGradient>
      </defs>
    </svg>
  )
}

