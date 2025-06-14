import React, { useEffect, useRef, useState } from "react";

function Calorie_Meter({ goal, value }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    let start = null;
    const duration = 1000;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easedProgress = Math.min(progress / duration, 1);
      setAnimatedValue(easedProgress * value);

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    setAnimatedValue(0);
    requestAnimationFrame(animate);
  }, [inView, value]);

  const percentage = Math.min(animatedValue / goal, 1);
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
    <div ref={ref} className="meter-container">
      <svg viewBox="0 0 200 120" className="arc-meter">
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="#f5bbbb"
          strokeWidth="20"
        />
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={strokeColor}
          strokeWidth="20"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke 0.3s" }}
        />
      </svg>
      <div className="meter-value">{Math.round(animatedValue)} Cal</div>
    </div>
  );
}

export default Calorie_Meter;
