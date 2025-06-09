import React from "react";

function Calorie_Meter({ goal, value }) {
  const percentage = Math.min(value / goal, 1);
  const radius = 90;
  const circumference = Math.PI * radius;
  const progress = circumference * percentage;

  let strokeColor;
  if (percentage >= 0.7) {
    strokeColor = "#ff4d4d";
  } else if (percentage < 0.5) {
    strokeColor = "#01ff0a";
  } else {
    strokeColor = "#ffeb3b";
  }

  return (
    <div className="meter-container">
      <br />
      <svg viewBox="0 0 200 120" className="arc-meter">
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="#f5aa6f"
          strokeWidth="20"
        />
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={strokeColor}
          strokeWidth="20"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <div className="meter-value">
        {value} Cal
        <br />
      </div>
    </div>
  );
}

export default Calorie_Meter;
