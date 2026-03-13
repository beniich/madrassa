import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

/**
 * TopBarProgress Component
 * Displays a thin progress bar at the top of the viewport during navigation.
 * Uses CSS custom properties to drive progress width without inline styles.
 */
export const TopBarProgress = () => {
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (navigation.state === 'loading') {
            setIsVisible(true);
            setProgress(30);

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return 90;
                    return prev + (90 - prev) * 0.1;
                });
            }, 200);

            return () => clearInterval(interval);
        } else {
            setProgress(100);
            const timeout = setTimeout(() => {
                setIsVisible(false);
                setProgress(0);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [navigation.state]);

    if (!isVisible) return null;

    return (
        <div
            className="top-bar-progress-container"
            role="progressbar"
            aria-label="Page loading"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className={`top-bar-progress-bar ${navigation.state === 'loading' ? 'top-bar-progress-bar--loading' : 'top-bar-progress-bar--done'}`}
                style={{ '--progress': `${progress}%` } as React.CSSProperties}
            />
        </div>
    );
};
