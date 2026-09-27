import { useEffect, useRef } from "react";

const DEFAULT_EFFECT_OPTIONS = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [12, 80],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3,
  },
};

function Hyperspeed({ effectOptions = {}, ...restProps }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      ...DEFAULT_EFFECT_OPTIONS,
      ...effectOptions,
      colors: {
        ...DEFAULT_EFFECT_OPTIONS.colors,
        ...(effectOptions.colors || {}),
      },
    };

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrame = 0;

    const buildParticles = () => {
      particles = [];
      const laneCount = Math.max(12, config.length / 18);

      for (let i = 0; i < laneCount; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.2 + Math.random() * 1.2,
          speed: 1.5 + Math.random() * 2.8,
          alpha: 0.2 + Math.random() * 0.8,
          width: 10 + Math.random() * 25,
          hue: i % 3 === 0 ? 300 : i % 2 === 0 ? 190 : 260,
        });
      }
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth || 1000;
      height = canvas.clientHeight || 600;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildParticles();
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `#${(config.colors.background || 0).toString(16).padStart(6, "0")}`;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.y += p.speed * (config.speedUp || 1.8);
        p.x += Math.sin((time * 0.001) + i) * 0.7;

        if (p.y > height + 50) {
          p.y = -50;
          p.x = Math.random() * width;
        }

        const perspective = 1 + (p.y / height) * 2.5;
        const xPos = cx + (p.x - cx) / perspective;
        const lineWidth = p.width / perspective;
        const alpha = p.alpha / perspective;

        ctx.beginPath();
        ctx.moveTo(xPos, p.y);
        ctx.lineTo(xPos + lineWidth, p.y + 80 * perspective);
        ctx.strokeStyle = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
        ctx.lineWidth = Math.max(1, lineWidth * 0.6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xPos - 8, p.y + 18);
        ctx.lineTo(xPos + 8, p.y + 18 + 70 * perspective);
        ctx.strokeStyle = `hsla(${p.hue + 35}, 92%, 74%, ${alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < 12; i += 1) {
        const x = cx + Math.sin((i * 2 + time * 0.0015) * 1.7) * 160;
        const y = height * (0.22 + i * 0.065);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.stroke();

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    animationFrame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [effectOptions]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "#000000",
      }}
      {...restProps}
    />
  );
}

export default Hyperspeed;
