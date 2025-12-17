"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/utils/cn";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  onAnimationComplete,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  onAnimationComplete?: () => void;
}) => {
  const [scope, animate] = useAnimate();
  const [isClient, setIsClient] = useState(false);
  const wordsArray = words.split(" ");

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient) return;
    
    const animateText = async () => {
      await animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration,
          delay: stagger(0.05),
        }
      );
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    };
    animateText();
  }, [animate, duration, filter, onAnimationComplete, isClient]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={`${word}-${idx}`}
              className="dark:text-white text-black opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  if (!isClient) {
    return (
      <div className={cn("font-bold", className)}>
        <div className="mt-4">
          <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
            {words}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};