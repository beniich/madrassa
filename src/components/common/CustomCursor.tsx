import { useEffect, useState } from 'react';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            
            document.documentElement.style.setProperty('--cursor-x', `${x}px`);
            document.documentElement.style.setProperty('--cursor-y', `${y}px`);
            
            const target = e.target as HTMLElement;
            const pointer = window.getComputedStyle(target).cursor === 'pointer';
            document.documentElement.style.setProperty('--cursor-scale', pointer ? '1.5' : '1');
        };

        window.addEventListener('mousemove', updatePosition);
        return () => window.removeEventListener('mousemove', updatePosition);
    }, []);

    return (
        <div className="electric-cursor">
            <div className="electric-cursor-dot"></div>
        </div>
    );
};
