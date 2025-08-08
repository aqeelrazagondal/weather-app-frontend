import { useEffect, useRef, useState } from 'react';

export function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const obs = new ResizeObserver(([entry]) => {
            const cr = entry.contentRect;
            setSize({ width: cr.width, height: cr.height });
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return { ref, size };
}