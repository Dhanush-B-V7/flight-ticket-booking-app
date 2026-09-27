import { useMemo } from "react";

function AeroShards({
  backgroundColor = "#120F17",
  shardColor = "#896ABD",
  accentColor = "#A855F7",
  placement = "full",
  flow = "stream",
  material = "pearl",
  detail = "balanced",
  effect = "none",
  scale = 1,
  spread = 1,
  depth = 1,
  speed = 1,
  spin = 1,
  interaction = "repel",
  density = 1.5,
  shardSize = 1.1,
  stretch = 1,
  turbulence = 1,
  glow = 1,
  edgeSoftness = 2,
  bloom = 0.5,
  grain = 0.05,
  chromaticAberration = 0.0075,
  transitionDuration = 1,
  interactionRadius = 1.5,
  interactionStrength = 0.5,
  rippleIntensity = 1,
  holdToGather = false,
  paused = false,
}) {
  const visualConfig = {
    flow,
    material,
    detail,
    effect,
    scale,
    spread,
    depth,
    speed,
    spin,
    interaction,
    density,
    shardSize,
    stretch,
    turbulence,
    glow,
    edgeSoftness,
    bloom,
    grain,
    chromaticAberration,
    transitionDuration,
    interactionRadius,
    interactionStrength,
    rippleIntensity,
    holdToGather,
    paused,
  };

  const shards = useMemo(() => {
    const count = Math.max(12, Math.round(18 * density));
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: (index * 13.7) % 100,
      top: (index * 17.2 + (index % 5) * 11) % 100,
      width: 70 + ((index * 23) % 70),
      height: 20 + ((index * 17) % 25),
      duration: 9 + ((index * 13) % 11) / speed,
      delay: (index % 7) * 0.8,
      rotate: ((index % 10) - 5) * 12 * spin,
      opacity: 0.2 + (index % 5) * 0.12,
      xShift: (index % 2 === 0 ? 1 : -1) * (12 + index % 6) * spread,
    }));
  }, [density, speed, spin, spread]);

  return (
    <div
      data-flow={visualConfig.flow}
      data-material={visualConfig.material}
      data-detail={visualConfig.detail}
      data-effect={visualConfig.effect}
      style={{
        position: placement === "full" ? "absolute" : "relative",
        inset: 0,
        overflow: "hidden",
        background: backgroundColor,
        pointerEvents: "none",
        borderRadius: placement === "full" ? 0 : 20,
        boxShadow: `inset 0 0 ${32 * glow}px rgba(168, 85, 247, ${0.23 + glow * 0.17})`,
        transform: `scale(${visualConfig.scale})`,
        transformOrigin: "center center",
        filter: `contrast(${1 + visualConfig.glow * 0.15}) saturate(${1 + visualConfig.bloom})`,
        transition: `all ${visualConfig.transitionDuration}s ease`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.22), transparent 25%), radial-gradient(circle at 80% 70%, rgba(137, 106, 189, 0.22), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
          opacity: 0.9,
          mixBlendMode: visualConfig.effect === "glow" ? "screen" : "normal",
          transform: `translateY(${visualConfig.depth * -2}px) scale(${1 + visualConfig.turbulence * 0.03})`,
          transition: `transform ${visualConfig.transitionDuration}s ease`,
        }}
      />

      {shards.map((shard) => (
        <span
          key={shard.id}
          style={{
            position: "absolute",
            left: `${shard.left}%`,
            top: `${shard.top}%`,
            width: `${shard.width * shardSize}px`,
            height: `${shard.height * stretch}px`,
            background: `linear-gradient(90deg, ${accentColor}, ${shardColor}, rgba(255,255,255,0.15))`,
            boxShadow: `0 0 ${18 * glow}px ${accentColor}, 0 0 ${24 * interactionStrength}px rgba(255,255,255,${0.2 + grain})`,
            opacity: Math.min(1, shard.opacity + visualConfig.glow * 0.08),
            transform: `translate3d(${shard.xShift}px, 0, 0) rotate(${shard.rotate}deg) scale(${1 + (visualConfig.scale - 1) * 0.4})`,
            borderRadius: "999px",
            filter: `blur(${edgeSoftness / 2}px) saturate(${1.5 + bloom}) brightness(${1 + glow * 0.25})`,
            animation: paused ? "none" : `aeroFloat ${shard.duration}s ease-in-out ${shard.delay}s infinite alternate`,
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform, opacity",
          }}
        />
      ))}

      <style>{`
        @keyframes aeroFloat {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scaleY(0.9);
          }
          100% {
            transform: translate3d(${spread * 22}px, ${depth * -20}px, 0) rotate(${spin * 20}deg) scaleY(${1.3 + (turbulence - 1) * 0.25});
          }
        }
      `}</style>
    </div>
  );
}

export default AeroShards;
