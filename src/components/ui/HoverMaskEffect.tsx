"use client";
import { useState, useRef } from "react";

export const HoverMaskEffect = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleTextHover = () => {
    setIsHovered(true);
  };

  const handleTextLeave = () => {
    setIsHovered(false);
  };
  
  const maskSize = isHovered ? 400 : 30;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative ${className}`}
    >
        {/* The two layers are inside this container */}
        <div className="relative w-full h-full">
            {/* Background Layer (revealed) */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: 'white',
                    color: 'black',
                }}
            >
                <div 
                    className="w-full h-full"
                    style={{
                        maskImage: `url(/mask.svg)`,
                        maskRepeat: "no-repeat",
                        maskSize: `${maskSize}px`,
                        maskPosition: `${mousePosition.x - maskSize / 2}px ${
                            mousePosition.y - maskSize / 2
                        }px`,
                        WebkitMaskImage: `url(/mask.svg)`,
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: `${maskSize}px`,
                        WebkitMaskPosition: `${mousePosition.x - maskSize / 2}px ${
                            mousePosition.y - maskSize / 2
                        }px`,
                    }}
                >
                    {children}
                </div>
            </div>

            {/* Foreground Layer (default) */}
            <div 
                ref={textRef}
                onMouseEnter={handleTextHover} 
                onMouseLeave={handleTextLeave}
                className="w-full h-full"
            >
                {children}
            </div>
        </div>
    </div>
  );
};