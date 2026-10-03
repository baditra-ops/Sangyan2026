import React, { useEffect, useRef } from 'react';

/**
 * MagneticCursor Component.
 * High-performance custom magnetic cursor that smoothly follows the pointer with physical inertia (lerp),
 * snaps magnetically to interactive elements (buttons, inputs, cards, links),
 * and provides subtle tactile feedback.
 *
 * Runs via direct DOM manipulation in requestAnimationFrame to avoid React re-render overhead.
 */
export default function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only run on fine-pointer devices (desktop mice/trackpads)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Mouse coordinates
    let mouseX = -100;
    let mouseY = -100;

    // Trailing ring coordinates (lerped)
    let ringX = -100;
    let ringY = -100;

    // Magnetic target coordinates
    let targetX = -100;
    let targetY = -100;
    let isMagnetized = false;
    let isHovering = false;
    let isMouseDown = false;
    let isVisible = false;

    let rafId = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      // Check if hovering over an interactive element
      const target = e.target?.closest?.(
        'button, a, input, select, textarea, label, [role="button"], .cursor-pointer'
      );

      if (target) {
        isHovering = true;
        const rect = target.getBoundingClientRect();
        // Compute distance from center of target
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        const magneticRadius = Math.max(rect.width, rect.height) * 0.75 + 20;

        if (dist < magneticRadius) {
          isMagnetized = true;
          // Magnetically pull target point towards element center with gentle pull
          const pullStrength = 0.45;
          targetX = mouseX + (centerX - mouseX) * pullStrength;
          targetY = mouseY + (centerY - mouseY) * pullStrength;
        } else {
          isMagnetized = false;
          targetX = mouseX;
          targetY = mouseY;
        }
      } else {
        isHovering = false;
        isMagnetized = false;
        targetX = mouseX;
        targetY = mouseY;
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    // Animation Loop with smooth lerp
    const lerpFactor = 0.16;

    const loop = () => {
      // Direct placement for sharp inner dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${
        isMouseDown ? 0.6 : 1
      })`;

      // Smooth lag / magnetic attraction for outer aura ring
      ringX += (targetX - ringX) * lerpFactor;
      ringY += (targetY - ringY) * lerpFactor;

      let scale = 1;
      let borderColor = 'rgba(99, 102, 241, 0.45)'; // Indigo-500
      let bgColor = 'rgba(99, 102, 241, 0.08)';

      if (isMagnetized) {
        scale = 1.7;
        borderColor = 'rgba(129, 140, 248, 0.7)'; // Indigo-400
        bgColor = 'rgba(99, 102, 241, 0.18)';
      } else if (isHovering) {
        scale = 1.4;
        borderColor = 'rgba(56, 189, 248, 0.6)'; // Sky-400
        bgColor = 'rgba(56, 189, 248, 0.12)';
      }

      if (isMouseDown) {
        scale *= 0.8;
      }

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.borderColor = borderColor;
      ring.style.backgroundColor = bgColor;

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-indigo-400 pointer-events-none z-[9999] opacity-0 shadow-sm shadow-indigo-400 transition-opacity duration-150 will-change-transform"
        style={{
          boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
        }}
      />

      {/* Magnetic Trailing Aura Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-500/40 pointer-events-none z-[9998] opacity-0 backdrop-blur-[1px] transition-[opacity,border-color,background-color] duration-200 ease-out will-change-transform"
        style={{
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.2)',
        }}
      />
    </>
  );
}
