"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import React, { useRef, useState } from "react";
import Image from "next/image";

// --- Interfaces ---
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  isBlue?: boolean;
  /**
   * When true, the navbar body/mobile nav shrink with rounded corners and blur on scroll.
   * Set to false to keep a full-width, square, non-blurred header at all times.
   */
  shrinkOnScroll?: boolean;
}
interface NavElementProps {
  visible?: boolean;
  isBlue?: boolean;
}
interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
  isBlue?: boolean;
}
interface NavItemsProps {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
  isBlue?: boolean;
}
interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
  isBlue?: boolean;
}
interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}
interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}
interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
  isBlue?: boolean;
}

// --- Componente Principal ---
export const Navbar = ({ children, className, isBlue, shrinkOnScroll = true }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  const effectiveVisible = shrinkOnScroll ? visible : false;

  return (
    <motion.div ref={ref} className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<NavElementProps>, { visible: effectiveVisible, isBlue })
          : child
      )}
    </motion.div>
  );
};

// --- Barra de Navegación (Escritorio) ---
export const NavBody = ({ children, className, visible, isBlue }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        width: visible ? "80%" : "100%",
        borderRadius: visible ? "9999px" : "0px",
        y: visible ? 20 : 0,
        backdropFilter: visible ? "blur(10px)" : "none",
        backgroundColor: visible ? "#0C689a" : "transparent",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      className={cn(
        "relative z-[60] hidden lg:flex",
        visible ? "mx-auto" : "mx-0",
        'bg-transparent',
        className
      )}
    >
      <div className="flex w-full items-center justify-between max-w-7xl mx-auto px-4 py-2">
        {children}
      </div>
    </motion.div>
  );
};

// --- Items del Menú ---
export const NavItems = ({ items, className, onItemClick, isBlue }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex",
        isBlue ? "text-white" : "text-white",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className={cn(
                "absolute inset-0 h-full w-full rounded-full",
                isBlue ? "bg-white/10" : "bg-white/10"
              )}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

// --- Barra de Navegación (Móvil) ---
export const MobileNav = ({ children, className, visible, isBlue }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        width: visible ? "90%" : "100%",
        borderRadius: visible ? "2rem" : "0px",
        y: visible ? 20 : 0,
        backdropFilter: visible ? "blur(10px)" : "none",
        backgroundColor: visible ? "#0C689a" : "transparent",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-50 flex w-full flex-col items-center justify-between px-4 py-2 lg:hidden",
        visible && "mx-auto",
        'bg-transparent',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// --- Subcomponentes (sin cambios de lógica) ---
export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
  return (
    <div className={cn("flex w-full flex-row items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen }: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-lg dark:bg-neutral-950",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick, isBlue }: MobileNavToggleProps) => {
  return isOpen ? (
    <IconX className={cn(isBlue ? "text-white" : "text-white")} onClick={onClick} />
  ) : (
    <IconMenu2 className={cn(isBlue ? "text-white" : "text-white")} onClick={onClick} />
  );
};

export const NavbarLogo = () => (
  <a href="#" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal">
    <Image src="https://assets.aceternity.com/logo-dark.png" alt="logo" width={30} height={30} />
    <span className="font-medium text-black dark:text-white">Startup</span>
  </a>
);

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (React.ComponentPropsWithoutRef<"a"> | React.ComponentPropsWithoutRef<"button">)) => {
  const baseStyles = "px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";
  const variantStyles = {
    primary: "bg-white text-black shadow-lg",
    secondary: "bg-transparent shadow-none dark:text-white",
    dark: "bg-black text-white shadow-lg",
    gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg",
  };
  return (
    <Tag href={href || undefined} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </Tag>
  );
};