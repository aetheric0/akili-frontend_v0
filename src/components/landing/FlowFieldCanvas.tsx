import React, { useRef, useEffect } from "react";
import { PALETTES, DEVICE_IS_MOBILE, hexToRgba } from "../../utils/colorUtils";

export const FlowFieldCanvas: React.FC<{ paletteIndex?: number }> = ({ paletteIndex = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const lastResize = useRef(0);
  const palette = PALETTES[paletteIndex % PALETTES.length];

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(DPR, DPR);

    // particles
    const PARTICLE_BASE = DEVICE_IS_MOBILE ? 40 : 100;
    const particlesCount = Math.floor(PARTICLE_BASE * (Math.min(w, 1400) / 1400));
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      hueIndex: number;
      size: number;
    }[] = [];

    // initialize
    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 120,
        hueIndex: Math.floor(Math.random() * palette.length),
        size: 0.9 + Math.random() * 1.8,
      });
    }

    let t = 0;
    let colorShift = 0;

    function draw() {
      t += 0.01;
      colorShift += 0.002;

      // subtle clear with low alpha to create trails
      ctx.fillStyle = `rgba(4,6,11,${DEVICE_IS_MOBILE ? 0.55 : 0.35})`;
      ctx.fillRect(0, 0, w, h);

      // draw soft gradient overlay for depth
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, hexToRgba(palette[0], 0.06));
      g.addColorStop(0.5, hexToRgba(palette[1], 0.03));
      g.addColorStop(1, hexToRgba(palette[2], 0.04));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // flow field vector (simple curl / noise-ish)
        const angle =
          Math.sin((p.x * 0.001 + t) * (0.7 + (i % 3) * 0.12)) +
          Math.cos((p.y * 0.001 + t) * (0.9 + (i % 5) * 0.08));

        // pointer influence
        const dx = pointerRef.current.x - p.x;
        const dy = pointerRef.current.y - p.y;
        const dist2 = dx * dx + dy * dy;
        const influence = Math.max(0, 160000 - dist2) / 160000; // nearby stronger

        p.vx += Math.cos(angle) * 0.05 + (Math.random() - 0.5) * 0.03;
        p.vy += Math.sin(angle) * 0.05 + (Math.random() - 0.5) * 0.03;

        // pointer repulsion/subtle pull
        p.vx += ((dx / (Math.sqrt(dist2) + 1)) * 0.04) * influence;
        p.vy += ((dy / (Math.sqrt(dist2) + 1)) * 0.04) * influence;

        // decay
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // wrap edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // life/shimmer
        p.life += 1;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.maxLife = 80 + Math.random() * 160;
          p.hueIndex = (p.hueIndex + 1) % palette.length;
        }

        // color from palette with subtle shift
        const base = palette[p.hueIndex];
        const alpha = 0.14 + (Math.sin((p.life / p.maxLife) * Math.PI) * 0.5) * 0.8;
        const color = hexToRgba(base, alpha + 0.02 * Math.sin(colorShift + i * 0.02));

        // draw stroke path for motion feel
        ctx.beginPath();
        ctx.lineWidth = p.size;
        ctx.strokeStyle = color;
        ctx.moveTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // tiny glow dot
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(base, alpha * 0.7);
        ctx.ellipse(p.x, p.y, p.size * 0.7, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // animation loop start
    rafRef.current = requestAnimationFrame(draw);

    // handle mouse movement
    const onMove = (ev: MouseEvent | TouchEvent) => {
      if ("touches" in ev) {
        const t0 = (ev as TouchEvent).touches[0];
        pointerRef.current.x = t0.clientX;
        pointerRef.current.y = t0.clientY;
      } else {
        const e = ev as MouseEvent;
        pointerRef.current.x = e.clientX;
        pointerRef.current.y = e.clientY;
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    // resize support (debounced)
    const onResize = () => {
      const now = performance.now();
      if (now - lastResize.current < 120) return;
      lastResize.current = now;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // keep particles inside new bounds
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [palette]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-20 w-full h-full pointer-events-none" />;
};
