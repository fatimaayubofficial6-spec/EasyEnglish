"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface SuccessCelebrationProps {
  score: number;
  onComplete?: () => void;
}

export function SuccessCelebration({ score, onComplete }: SuccessCelebrationProps) {
  const checkmarkRef = useRef<SVGPathElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Animate checkmark drawing
    if (checkmarkRef.current) {
      const pathLength = checkmarkRef.current.getTotalLength();
      checkmarkRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`;
      checkmarkRef.current.style.strokeDashoffset = `${pathLength}`;

      setTimeout(() => {
        if (checkmarkRef.current) {
          checkmarkRef.current.style.transition = "stroke-dashoffset 0.5s ease-in-out";
          checkmarkRef.current.style.strokeDashoffset = "0";
        }
      }, 300);
    }

    return () => {
      clearInterval(interval);
    };
  }, [score, onComplete]);

  const getScoreColor = () => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreMessage = () => {
    if (score >= 90) return "Outstanding!";
    if (score >= 70) return "Well Done!";
    if (score >= 50) return "Good Effort!";
    return "Keep Practicing!";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative">
        <svg
          className="h-32 w-32"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`${getScoreColor()} fill-current opacity-10`}
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`${getScoreColor()} stroke-current`}
            strokeWidth="2"
            fill="none"
          />
          <path
            ref={checkmarkRef}
            d="M25 50 L40 65 L75 30"
            className={`${getScoreColor()} stroke-current`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h2 className={`text-4xl font-bold ${getScoreColor()}`}>
          {getScoreMessage()}
        </h2>
        <p className="text-6xl font-bold gradient-text">{score}%</p>
        <p className="text-muted-foreground">Your score for this exercise</p>
      </div>
    </div>
  );
}
