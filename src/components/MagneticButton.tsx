"use client";

import React, { useRef, useState, useEffect, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const RANGE_PER_POINT = 18;
const MAX_PULL = 0.5;

export interface BorderOptions {
  color?: string;
  width?: number;
}

export interface MagneticButtonProps {
  label?: ReactNode;
  children?: ReactNode;
  link?: string;
  newTab?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  font?: CSSProperties;
  fill?: string;
  textColor?: string;
  sweepColor?: string;
  sweepTextColor?: string;
  radius?: number;
  magnet?: number;
  paddingX?: number;
  paddingY?: number;
  transition?: any;
  border?: boolean;
  borderOptions?: BorderOptions;
  style?: CSSProperties;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  label,
  children,
  link = "",
  newTab = false,
  onClick,
  font = {
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: 14,
    lineHeight: "1em",
    letterSpacing: "0.02em",
  },
  fill = "linear-gradient(135deg, #ff5540 0%, #feba39 100%)",
  textColor = "#2c1800",
  sweepColor = "#1e1c21",
  sweepTextColor = "#feba39",
  paddingX = 26,
  paddingY = 13,
  radius = 999,
  magnet = 8,
  transition = {
    type: "tween",
    stiffness: 800,
    damping: 60,
    mass: 1,
    ease: "easeInOut",
    duration: 0.3,
  },
  border = true,
  borderOptions = { color: "rgba(254, 186, 57, 0.4)", width: 1 },
  style,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, d: 0 });
  const hoverRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const borderColor = borderOptions?.color ?? "rgba(254, 186, 57, 0.4)";
  const borderWidth = border ? borderOptions?.width ?? 1 : 0;

  const content = children || label;

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const pull = (magnet / 20) * MAX_PULL;
    const reach = magnet * RANGE_PER_POINT;

    function onMove(event: PointerEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - sx.get();
      const cy = rect.top + rect.height / 2 - sy.get();

      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      const edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
      const edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
      const gap = Math.hypot(edgeX, edgeY);

      if (inside !== hoverRef.current) {
        const lx = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const ly = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
        const d = 2 * Math.hypot(rect.width, rect.height);
        setOrigin({ x: lx, y: ly, d });
        hoverRef.current = inside;
        setHover(inside);
      }

      if (gap > reach) {
        x.set(0);
        y.set(0);
        return;
      }
      const falloff = reach === 0 ? 0 : 1 - gap / reach;
      x.set(dx * pull * falloff);
      y.set(dy * pull * falloff);
    }

    function onLeave() {
      x.set(0);
      y.set(0);
      hoverRef.current = false;
      setHover(false);
    }

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [magnet, x, y, sx, sy, disabled]);

  const combinedStyle: any = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: `${paddingY}px ${paddingX}px`,
    borderRadius: radius,
    background: fill,
    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    overflow: "hidden",
    textDecoration: "none",
    whiteSpace: "nowrap",
    x: sx,
    y: sy,
    boxShadow: hover
      ? "0 14px 35px rgba(255, 85, 64, 0.35), 0 0 20px rgba(254, 186, 57, 0.3)"
      : "0 6px 18px rgba(0, 0, 0, 0.25)",
    opacity: disabled ? 0.6 : 1,
    ...font,
    ...style,
  };

  const innerContent = (
    <>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scale: hover ? 1 : 0 }}
        transition={transition}
        style={{
          position: "absolute",
          top: origin.y,
          left: origin.x,
          width: origin.d,
          height: origin.d,
          marginLeft: -origin.d / 2,
          marginTop: -origin.d / 2,
          borderRadius: "50%",
          background: sweepColor,
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />
      <motion.span
        initial={false}
        animate={{ color: hover ? sweepTextColor : textColor }}
        transition={transition}
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {content}
      </motion.span>
    </>
  );

  if (link) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={link}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        onClick={onClick as any}
        style={combinedStyle}
        className={className}
      >
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyle}
      className={className}
    >
      {innerContent}
    </motion.button>
  );
};

export default MagneticButton;
