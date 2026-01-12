"use client";

export function TreezLogo({ className = "h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10C50 10 30 30 30 50C30 70 45 85 50 90C55 85 70 70 70 50C70 30 50 10 50 10Z"
        fill="#6ABF4B"
      />
      <path
        d="M40 40C45 35 55 35 60 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text
        x="90"
        y="70"
        fontFamily="Arial, sans-serif"
        fontSize="50"
        fontWeight="700"
        fill="#333333"
      >
        treez
      </text>
    </svg>
  );
}

export function TreezIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 5C50 5 20 35 20 55C20 80 42 95 50 95C58 95 80 80 80 55C80 35 50 5 50 5Z"
        fill="#6ABF4B"
      />
      <path
        d="M35 50C42 42 58 42 65 50"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text
        x="50"
        y="75"
        fontFamily="Arial, sans-serif"
        fontSize="30"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
      >
        Z
      </text>
    </svg>
  );
}
