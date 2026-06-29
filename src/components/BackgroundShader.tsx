import React, { useEffect, useRef } from 'react';

export const BackgroundShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Orb particles floating subtly in deep navy background
    const orbs = [
      { x: 0.2, y: 0.3, r: 350, vx: 0.0003, vy: 0.0004, color: 'rgba(138, 235, 255, 0.06)' },
      { x: 0.8, y: 0.2, r: 400, vx: -0.0002, vy: 0.0003, color: 'rgba(34, 211, 238, 0.05)' },
      { x: 0.5, y: 0.7, r: 450, vx: 0.0002, vy: -0.0002, color: 'rgba(164, 201, 255, 0.05)' },
      { x: 0.1, y: 0.8, r: 300, vx: 0.0004, vy: -0.0003, color: 'rgba(138, 235, 255, 0.04)' }
    ];

    const render = () => {
      time += 0.01;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle glowing gradient background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#0c1324');
      grad.addColorStop(0.5, '#080e1a');
      grad.addColorStop(1, '#050914');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate glowing orbs
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < 0 || orb.x > 1) orb.vx *= -1;
        if (orb.y < 0 || orb.y > 1) orb.vy *= -1;

        const cx = orb.x * canvas.width;
        const cy = orb.y * canvas.height;

        const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
        radial.addColorStop(0, orb.color);
        radial.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle cyber grid overlay lines at top/bottom
      ctx.strokeStyle = 'rgba(138, 235, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      const yOffset = (time * 15) % gridSize;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = yOffset; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none" 
    />
  );
};
