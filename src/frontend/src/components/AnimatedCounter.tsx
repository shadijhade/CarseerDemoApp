import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    target: number;
    duration?: number;
    className?: string;
    formatter?: (n: number) => string;
}

export function AnimatedCounter({
    target,
    duration = 1500,
    className = "",
    formatter = (n) => n.toLocaleString(),
}: AnimatedCounterProps) {
    const [current, setCurrent] = useState(0);
    const startRef = useRef<number | null>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (target <= 0) {
            setCurrent(0);
            return;
        }

        startRef.current = null;

        const animate = (timestamp: number) => {
            if (startRef.current === null) startRef.current = timestamp;
            const elapsed = timestamp - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            // EaseOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCurrent(Math.round(eased * target));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration]);

    return <span className={className}>{formatter(current)}</span>;
}
