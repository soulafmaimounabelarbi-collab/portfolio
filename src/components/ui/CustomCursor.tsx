import { useEffect, useRef } from 'react';
import { useIsTouchDevice } from '../../hooks/useMediaQuery';

export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
      }
    };

    const hover = () => cursorRef.current?.classList.add('scale-150');
    const unhover = () => cursorRef.current?.classList.remove('scale-150');

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', hover);
      el.addEventListener('mouseleave', unhover);
    });

    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-roseDeep rounded-full pointer-events-none z-[9999] transition-transform duration-75"
        aria-hidden="true"
      />
      {/* Ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-roseSoft pointer-events-none z-[9998] transition-transform duration-200 transition-[transform,scale] ease-out"
        aria-hidden="true"
      />
    </>
  );
}
