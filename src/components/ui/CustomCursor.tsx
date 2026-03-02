'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const mousePos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        // Only enable on devices with a fine pointer (desktop)
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        if (!hasFinePointer) return;

        // Add cursor-none class to body
        document.body.classList.add('custom-cursor-active');

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);

            // Dot follows immediately
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        // Check if hovering over interactive elements
        const handleElementCheck = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]');
            setIsHovering(!!isInteractive);
        };

        // Smooth ring following with lerp
        const animateRing = () => {
            const speed = 0.15;
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * speed;
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * speed;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
            }

            rafRef.current = requestAnimationFrame(animateRing);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousemove', handleElementCheck);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        rafRef.current = requestAnimationFrame(animateRing);

        return () => {
            document.body.classList.remove('custom-cursor-active');
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousemove', handleElementCheck);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(rafRef.current);
        };
    }, [isVisible]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
        return null;
    }

    return (
        <>
            {/* Dot — small center point */}
            <div
                ref={dotRef}
                className="custom-cursor-dot"
                style={{
                    opacity: isVisible ? 1 : 0,
                    width: isClicking ? '6px' : '8px',
                    height: isClicking ? '6px' : '8px',
                }}
            />
            {/* Ring — follows with delay */}
            <div
                ref={ringRef}
                className="custom-cursor-ring"
                style={{
                    opacity: isVisible ? 1 : 0,
                    width: isHovering ? '56px' : isClicking ? '28px' : '36px',
                    height: isHovering ? '56px' : isClicking ? '28px' : '36px',
                    borderColor: isHovering ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: isHovering ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                }}
            />
        </>
    );
}
