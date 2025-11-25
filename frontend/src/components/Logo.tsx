import * as React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 80, className = '' }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const textRadius = size * 0.36;

  // Create a proper circular path for text (full circle)
  const textPath = `M ${centerX},${centerY - textRadius} A ${textRadius},${textRadius} 0 1,1 ${centerX},${centerY + textRadius} A ${textRadius},${textRadius} 0 1,1 ${centerX},${centerY - textRadius}`;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for background */}
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#ffedd5" />
        </linearGradient>
        
        {/* Circular path for text */}
        <path
          id="textPath"
          d={textPath}
          fill="none"
        />
      </defs>

      {/* Background circle with gradient */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size * 0.48}
        fill="url(#logoGradient)"
        stroke="#8b7355"
        strokeWidth="0.5"
      />

      {/* Circular text - wraps around the circle */}
      <text
        fontSize={size * 0.095}
        fill="#10b981"
        fontWeight="bold"
        fontFamily="Pacifico, serif"
        letterSpacing="0.5"
      >
        <textPath
          href="#textPath"
          startOffset="50%"
          textAnchor="middle"
        >
          NATURADIVINEBEAUTE
        </textPath>
      </text>

      {/* Center icon - stylized flower/plant */}
      <g transform={`translate(${centerX}, ${centerY})`}>
        {/* Main center dot */}
        <circle
          cx="0"
          cy="-1"
          r={size * 0.06}
          fill="#8b7355"
        />
        {/* Top petal */}
        <ellipse
          cx="0"
          cy={-size * 0.1}
          rx={size * 0.028}
          ry={size * 0.06}
          fill="#8b7355"
        />
        {/* Bottom left petal */}
        <ellipse
          cx={-size * 0.06}
          cy={size * 0.05}
          rx={size * 0.028}
          ry={size * 0.06}
          fill="#8b7355"
          transform={`rotate(-45 ${-size * 0.06} ${size * 0.05})`}
        />
        {/* Bottom right petal */}
        <ellipse
          cx={size * 0.06}
          cy={size * 0.05}
          rx={size * 0.028}
          ry={size * 0.06}
          fill="#8b7355"
          transform={`rotate(45 ${size * 0.06} ${size * 0.05})`}
        />
        {/* Left petal */}
        <ellipse
          cx={-size * 0.08}
          cy={-size * 0.01}
          rx={size * 0.028}
          ry={size * 0.06}
          fill="#8b7355"
          transform={`rotate(-90 ${-size * 0.08} ${-size * 0.01})`}
        />
        {/* Right petal */}
        <ellipse
          cx={size * 0.08}
          cy={-size * 0.01}
          rx={size * 0.028}
          ry={size * 0.06}
          fill="#8b7355"
          transform={`rotate(90 ${size * 0.08} ${-size * 0.01})`}
        />
      </g>
    </svg>
  );
};

export default Logo;
