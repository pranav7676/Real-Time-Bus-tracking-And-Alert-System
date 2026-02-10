import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface CustomCursorProps {
  /**
   * Elements with these data attributes will trigger cursor expansion
   * @default ['data-cursor-hover', 'button', 'a']
   */
  hoverSelectors?: string[];
  /**
   * Color of the cursor dot (uses CSS variable)
   * @default 'hsl(var(--primary))'
   */
  color?: string;
  /**
   * Whether to enable the custom cursor
   * @default true
   */
  enabled?: boolean;
}

export function CustomCursor({ 
  hoverSelectors = ['[data-cursor-hover]', 'button', 'a', 'input', '[role="button"]'],
  color = 'hsl(var(--primary))',
  enabled = true 
}: CustomCursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default to true to prevent flash
  
  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for smooth following - main cursor
  const springConfig = useMemo(() => ({ damping: 30, stiffness: 400, mass: 0.5 }), []);
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Spring physics for trailing cursor - must be called unconditionally
  const trailSpringConfig = useMemo(() => ({ damping: 20, stiffness: 200 }), []);
  const trailX = useSpring(cursorX, trailSpringConfig);
  const trailY = useSpring(cursorY, trailSpringConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
  }, [cursorX, cursorY]);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleElementHover = useCallback((e: Event) => {
    setIsHovering(e.type === 'mouseenter');
  }, []);

  // Check for touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      const isTouch = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
    };
    
    checkTouchDevice();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (isTouchDevice || !enabled) return;

    // Add global mouse listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // Add hover listeners to interactive elements
    const selector = hoverSelectors.join(', ');
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
      el.addEventListener('mouseenter', handleElementHover);
      el.addEventListener('mouseleave', handleElementHover);
    });

    // Use MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (hoverSelectors.some(sel => node.matches?.(sel))) {
              node.addEventListener('mouseenter', handleElementHover);
              node.addEventListener('mouseleave', handleElementHover);
            }
            // Check children
            const children = node.querySelectorAll?.(selector);
            children?.forEach(child => {
              child.addEventListener('mouseenter', handleElementHover);
              child.addEventListener('mouseleave', handleElementHover);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementHover);
        el.removeEventListener('mouseleave', handleElementHover);
      });
      
      observer.disconnect();
    };
  }, [enabled, isTouchDevice, hoverSelectors, handleMouseMove, handleMouseEnter, handleMouseLeave, handleElementHover]);

  // Don't render on touch devices or when disabled - but AFTER all hooks
  if (isTouchDevice || !enabled) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 3 : 1,
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: 'spring', stiffness: 400, damping: 30 },
        }}
      >
        <div
          className="w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: isHovering ? 'transparent' : color,
            border: isHovering ? `1.5px solid ${color}` : 'none',
            width: isHovering ? '2.5rem' : '0.5rem',
            height: isHovering ? '2.5rem' : '0.5rem',
            mixBlendMode: isHovering ? 'difference' : 'normal',
            transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease',
          }}
        />
      </motion.div>
      
      {/* Trailing cursor (outer ring) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailX,
          y: trailY,
        }}
        animate={{
          opacity: isVisible && !isHovering ? 0.3 : 0,
        }}
        transition={{ opacity: { duration: 0.3 } }}
      >
        <div
          className="w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: color }}
        />
      </motion.div>

      {/* Global style to hide default cursor on interactive elements */}
      <style>{`
        @media (pointer: fine) {
          body, 
          button, 
          a, 
          input,
          [role="button"],
          [data-cursor-hover] {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default CustomCursor;
