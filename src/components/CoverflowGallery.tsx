"use client";

import React, { useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Project } from "../types";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, Layers } from "lucide-react";

const useIsStaticRenderer = () => false;

export interface Slide {
  image?: { src?: string; srcSet?: string; alt?: string };
  title?: string;
  project?: Project;
}

type AutoplayDir = "leftToRight" | "rightToLeft";
type TitleCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

interface Smooth3DSlideshowProps {
  slides?: Slide[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tilt?: number;
  sideTilt?: number;
  gap?: number;
  opacity?: number;
  transition?: any;
  autoplay?: boolean;
  autoplayDirection?: AutoplayDir;
  showTitle?: boolean;
  titleFont?: CSSProperties;
  titleColor?: string;
  titlePosition?: {
    position?: TitleCorner;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
  style?: CSSProperties;
  onProjectClick?: (project: Project) => void;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4bKeEYh9XdWGAQ2CFSL_4E8WmLHh3cRdkJIQx9_dZ6j0gzz5B3g7p9FBloAN57RRNvtj8H00FBq_5Mp8yPg7qLKnvkU-C2eoR9UIvrNPGiKaXC2Jo7H-iDXW9ZURk9qt51-4deAZ8LmfMGkAsgO2FEZPZtLH1Y9QcxFt9hH9M9JAIWjoAZA6RCHrYIaf8IH_rOJuzhxZeuz0UGzfHM7KyWiLIy-GcLa_V4euK8k2TzNsN7I7aA1RJVQ",
    },
    title: "Animación Digital\nPerformance Experimental",
  },
  {
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA",
    },
    title: "Ignis Vanguard\nCharacter Design",
  },
  {
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaOYQYUw06Ny1XAHTsDwOFbOSTOo3zDdl8MjM3Yd580-WEo0Q0wlbioj3kdyrcVXGY7bKcyS7r-ZkOYXdlJd_94nRk2lEBeoFIX3F_7XHRL2rRdtlg0emtyL0TDi2kjJACUkITellHpdqtXTqrK6VJO-un3WSnHeEyA5XsJXDuWTA7oo2uDNY_CU_U1jB_vs1A1omWU_kRcLePwLpOBemevbYS63w7MH_ZGeV2MOCK1d6z9J6cVqzu6w",
    },
    title: "Cyber Sanctuary\nModelado 3D",
  },
];

const PERSPECTIVE = 1600;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
const DEPTH = 240;

function cssTransition(t: any): { dur: number; ease: string } {
  const dur = t && typeof t.duration === "number" ? t.duration : 0.6;
  let ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const e = t?.ease;
  if (Array.isArray(e) && e.length === 4) {
    ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
  } else if (typeof e === "string") {
    const map: Record<string, string> = {
      linear: "linear",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    };
    ease = map[e] || "ease";
  }
  return { dur, ease };
}

function Smooth3DSlideshow(props: Smooth3DSlideshowProps) {
  props = { ...COMPONENT_DEFAULTS, ...props };
  const {
    slides = DEFAULT_SLIDES,
    cardWidth = 450,
    cardHeight = 360,
    radius = 6,
    tilt = 12,
    sideTilt = 8,
    gap = 8,
    opacity = 60,
    transition,
    autoplay = false,
    autoplayDirection = "rightToLeft",
    showTitle = true,
    titleFont,
    titleColor = "#ffffff",
    titlePosition,
    style,
    onProjectClick,
    activeIndex: externalActiveIndex,
    onActiveChange,
  } = props;

  const tp = titlePosition || {};
  const corner: TitleCorner = tp.position || "bottomLeft";
  const isTop = corner === "topLeft" || corner === "topRight";
  const isRight = corner === "topRight" || corner === "bottomRight";
  const padLeft = tp.paddingLeft ?? 22;
  const padRight = tp.paddingRight ?? 22;
  const padTop = tp.paddingTop ?? 24;
  const padBottom = tp.paddingBottom ?? 24;

  const isStatic = useIsStaticRenderer();
  const list = slides && slides.length ? slides : DEFAULT_SLIDES;
  const n = list.length;

  const loop = true;
  const [internalActive, setInternalActive] = useState(0);

  const active = externalActiveIndex !== undefined ? externalActiveIndex : internalActive;

  const updateActive = useCallback(
    (newIndex: number) => {
      setInternalActive(newIndex);
      if (onActiveChange) {
        onActiveChange(newIndex);
      }
    },
    [onActiveChange]
  );

  useEffect(() => {
    if (active >= n && n > 0) {
      updateActive(Math.max(0, n - 1));
    }
  }, [n, active, updateActive]);

  const moveDur =
    transition && typeof transition.duration === "number"
      ? transition.duration
      : 0.6;
  const lockRef = useRef(false);
  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, Math.max(50, moveDur * 1000));
  }, [moveDur]);

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current || n === 0) return;
      lock();
      updateActive((((active + dir) % n) + n) % n);
    },
    [n, lock, active, updateActive]
  );

  const handleCardClick = useCallback(
    (i: number) => {
      if (isStatic || lockRef.current) return;
      if (i === active) {
        if (list[i]?.project && onProjectClick) {
          onProjectClick(list[i].project!);
        }
      } else {
        lock();
        updateActive(i);
      }
    },
    [isStatic, active, lock, updateActive, list, onProjectClick]
  );

  const delay =
    transition && typeof transition.delay === "number"
      ? transition.delay
      : 2.5;

  useEffect(() => {
    if (isStatic || !autoplay || n < 2) return;
    const ms = Math.max(0.3, delay) * 1000;
    const dir = autoplayDirection === "leftToRight" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [isStatic, autoplay, autoplayDirection, delay, n, step]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    },
    [step]
  );

  const { dur, ease } = cssTransition(transition);
  const transitionCss = `transform ${dur}s ${ease}, opacity ${dur}s ${ease}`;

  const effectiveRadius =
    (Math.max(0, Math.min(20, radius)) / 20) *
    (Math.min(cardWidth, cardHeight) / 2);
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  const rootStyle: CSSProperties = {
    ...(style || {}),
    position: "relative",
    width: "100%",
    height: "100%",
    minWidth: 300,
    minHeight: cardHeight + 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: `${PERSPECTIVE}px`,
    overflow: "hidden",
    outline: "none",
  };

  return (
    <div
      style={rootStyle}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={isStatic ? undefined : onKeyDown}
      className="py-6 select-none"
    >
      <div
        style={{
          position: "relative",
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
        }}
      >
        {list.map((slide, i) => {
          let rel = i - active;
          if (loop) {
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;
          }
          const ax = Math.abs(rel);
          const visible = ax <= MAX_VISIBLE;
          const isActive = rel === 0;
          const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
          const tx = rel * (gap * 28);
          const tz = -ax * DEPTH;
          const ry = -rel * tilt;
          const rz = rel * sideTilt;
          const src = slide.image?.src || "";

          const cardStyle: CSSProperties = {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: cardWidth,
            height: cardHeight,
            borderRadius: effectiveRadius,
            overflow: "hidden",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
            transition: transitionCss,
            opacity: visible ? 1 : 0,
            cursor: isActive ? (slide.project ? "pointer" : "default") : "pointer",
            pointerEvents: visible && !isStatic ? "auto" : "none",
            backgroundColor: "#1e1c21",
            boxShadow: isActive
              ? "0 20px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(254, 186, 57, 0.25)"
              : "0 10px 25px rgba(0, 0, 0, 0.5)",
            border: isActive ? "1px solid rgba(254, 186, 57, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
          };

          return (
            <div
              key={i}
              style={cardStyle}
              onClick={isStatic ? undefined : () => handleCardClick(i)}
              aria-label={slide.title}
              aria-hidden={!visible}
              className="group"
            >
              {src ? (
                <img
                  src={src}
                  alt={slide.image?.alt || slide.title || ""}
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    userSelect: "none",
                  }}
                />
              ) : null}

              {showTitle && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: isTop
                        ? "linear-gradient(0deg, rgba(0,0,0,0) 35%, rgba(18,17,20,0.85) 100%)"
                        : "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(18,17,20,0.95) 100%)",
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: padLeft,
                      right: padRight,
                      [isTop ? "top" : "bottom"]: isTop ? padTop : padBottom,
                      textAlign: isRight ? "right" : "left",
                      pointerEvents: "none",
                    }}
                    className="z-10"
                  >
                    <span
                      style={{
                        color: titleColor,
                        fontSize: cardWidth < 380 ? 18 : 22,
                        fontWeight: 700,
                        lineHeight: "1.2em",
                        letterSpacing: "-0.02em",
                        whiteSpace: "pre-line",
                        textShadow: "0 2px 10px rgba(0,0,0,0.7)",
                        fontFamily: "Syne, sans-serif",
                        ...(titleFont || {}),
                      }}
                    >
                      {slide.title}
                    </span>

                    {isActive && slide.project && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[#feba39] font-mono font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Ver detalle del proyecto</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#000000",
                  opacity: isActive ? 0 : dim,
                  transition: `opacity ${dur}s ${ease}`,
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COMPONENT_DEFAULTS = {
  slides: DEFAULT_SLIDES,
  cardWidth: 460,
  cardHeight: 380,
  radius: 8,
  tilt: 12,
  sideTilt: 8,
  gap: 8,
  opacity: 60,
  autoplay: false,
  autoplayDirection: "rightToLeft" as AutoplayDir,
  transition: {
    type: "tween",
    duration: 0.6,
    delay: 2.8,
    ease: [0.22, 1, 0.36, 1],
  },
  showTitle: true,
  titleFont: {
    fontFamily: "Syne, sans-serif",
    fontSize: "22px",
    letterSpacing: "-0.02em",
    lineHeight: "1.1em",
  } as any,
  titleColor: "#ffffff",
  titlePosition: {
    position: "bottomLeft" as TitleCorner,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 24,
    paddingBottom: 24,
  },
};

export const CoverflowGallery: React.FC = () => {
  const { projects, setSelectedProjectForModal } = usePortfolio();
  const [autoplay, setAutoplay] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 480, height: 380 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setDimensions({ width: w - 40, height: Math.min(320, (w - 40) * 1.05) });
      } else if (w < 768) {
        setDimensions({ width: 380, height: 320 });
      } else if (w < 1024) {
        setDimensions({ width: 440, height: 350 });
      } else {
        setDimensions({ width: 500, height: 380 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides: Slide[] =
    projects && projects.length > 0
      ? projects.map((p) => ({
          image: {
            src: p.imageUrl,
            alt: p.title,
          },
          title: `${p.title}\n${p.category} (${p.year})`,
          project: p,
        }))
      : DEFAULT_SLIDES;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="galeria-3d" className="py-20 relative bg-[#121114]/75 backdrop-blur-sm border-t border-b border-white/5 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#ff5540]/15 to-[#feba39]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#feba39]/10 border border-[#feba39]/30 text-[#feba39] text-xs font-mono font-bold tracking-widest uppercase"
          >
            <Layers className="w-3.5 h-3.5" />
            Galería Coverflow 3D
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-syne font-black text-3xl sm:text-5xl text-white tracking-tight"
          >
            Previsualizador de Galería
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#e7e1e5]/75 font-sans leading-relaxed"
          >
            Navega en 3D por todas las imágenes y piezas visuales del portafolio. Haz clic en cualquier imagen central para desplegar sus detalles.
          </motion.p>
        </div>

        {/* 3D Gallery Component */}
        <div className="relative">
          <Smooth3DSlideshow
            slides={slides}
            cardWidth={dimensions.width}
            cardHeight={dimensions.height}
            autoplay={autoplay}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            onProjectClick={setSelectedProjectForModal}
            radius={8}
            tilt={12}
            sideTilt={8}
            gap={8}
          />
        </div>

        {/* Control Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 max-w-xl mx-auto bg-[#1e1c21]/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-[#ff5540]/20 text-[#e7e1e5] hover:text-[#ff5540] transition-colors border border-white/10 cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-[#ff5540]/20 text-[#e7e1e5] hover:text-[#ff5540] transition-colors border border-white/10 cursor-pointer"
              title="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-[#a89f9e] ml-2">
              <strong className="text-white">{activeIndex + 1}</strong> / {slides.length}
            </span>
          </div>

          {/* Indicators */}
          <div className="hidden sm:flex items-center gap-1.5">
            {slides.slice(0, 10).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-6 bg-gradient-to-r from-[#ff5540] to-[#feba39]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
              autoplay
                ? "bg-[#feba39]/15 border-[#feba39]/40 text-[#feba39]"
                : "bg-white/5 border-white/10 text-[#a89f9e] hover:text-white"
            }`}
          >
            {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoplay ? "Auto ON" : "Auto OFF"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoverflowGallery;
