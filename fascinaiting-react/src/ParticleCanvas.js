
import React, { useRef, useEffect } from 'react';

function ParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        // const context = canvas.getContext('2d'); // Remove unused variable

        let animationFrameId;

        const render = () => {
            // Animation logic
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} />;
}
export default ParticleCanvas;
