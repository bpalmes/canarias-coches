"use client";

import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [curtainClosed, setCurtainClosed] = useState(false);
  const DURATION = 1.0;
  const PAUSE = 1.0;

  // Función para verificar si una ruta es de admin
  const isAdminRoute = useCallback((path: string) => {
    return path.startsWith('/admin');
  }, []);

  // Función para verificar si la transición debe estar habilitada
  const shouldEnableTransition = useCallback((path: string) => {
    return !isAdminRoute(path);
  }, [isAdminRoute]);

  // Intercept all link clicks
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const url = new URL(link.href);
        const path = url.pathname;
        
        // Solo aplicar transición si no es una ruta de admin
        if (shouldEnableTransition(path) && (path !== pathName || path === '/') && !isTransitioning) {
          console.log('Starting transition to:', path);
          setIsTransitioning(true);
          setPendingPath(path);
          setCurtainClosed(false);
        } else if (isAdminRoute(path)) {
          // Para rutas de admin, navegar directamente sin transición
          event.preventDefault();
          event.stopPropagation();
          router.push(path);
        }
      }
    };

    // Intercept browser back/forward
    const handlePopState = (event: PopStateEvent) => {
      if (isTransitioning) {
        event.preventDefault();
        return;
      }
      
      const currentPath = window.location.pathname;
      if (currentPath !== pathName) {
        // Solo aplicar transición si no es una ruta de admin
        if (shouldEnableTransition(currentPath)) {
          event.preventDefault();
          setIsTransitioning(true);
          setPendingPath(currentPath);
          setCurtainClosed(false);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    }
  }, [pathName, isTransitioning, router, shouldEnableTransition, isAdminRoute])

  // Navigate when curtain is fully closed
  useEffect(() => {
    if (curtainClosed && pendingPath) {
      console.log('Curtain closed, navigating to:', pendingPath);
      router.push(pendingPath);
      setPendingPath(null);
      setCurtainClosed(false);
    }
  }, [curtainClosed, pendingPath, router]);

  // Reset transition state after full cycle
  useEffect(() => {
    if (isTransitioning && !pendingPath && !curtainClosed) {
      const timer = setTimeout(() => {
        console.log('Ending transition');
        setIsTransitioning(false);
      }, (DURATION + PAUSE) * 1000);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, pendingPath, curtainClosed, DURATION, PAUSE]);

  // No mostrar transición si estamos en una ruta de admin
  if (isAdminRoute(pathName)) {
    return <div>{children}</div>;
  }

  return (
    <div>
      {children}
      
      {/* EXIT CURTAIN: Slides up to cover screen - COMENTADO */}
      {/* <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed top-0 left-0 w-full h-screen bg-[#0000FF] z-50 flex justify-center items-center"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: DURATION, ease: "easeInOut" }}
            onAnimationComplete={(definition) => {
              console.log('Animation complete:', definition);
              if (typeof definition === 'object' && definition && 'y' in definition && definition.y === "0%") {
                console.log('Setting curtain closed');
                setCurtainClosed(true);
              }
            }}
          >
            <Image src="/logo-200x50.png" alt="logo" width={200} height={50} />
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default TransitionProvider;
