"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextMaskEffect = ({
  children,
  revealText,
  className,
}: {
  children?: React.ReactNode;
  revealText?: React.ReactNode;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = isHovered ? 300 : 40;



  return (
    <motion.div
      className={cn("relative", className)}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full relative">
        {children}
      </div>
      <motion.div
        className="absolute inset-0 w-full"
        style={{
          maskImage: "url(/mask.svg)",
          maskRepeat: "no-repeat",
        }}
        animate={{
            maskSize: `${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-white" />
        <div className="w-full relative text-black">
          {revealText}
        </div>
      </motion.div>
    </motion.div>
  );
};
