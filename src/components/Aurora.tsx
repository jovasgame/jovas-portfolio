import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Aurora.css';

export interface AuroraProps {
  colorStops?: [string, string, string];
  speed?: number;
  blend?: number;
  amplitude?: number;
}

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

const hexToRgb01 = (hex: string): [number, number, number] => {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const intVal = parseInt(h.slice(0, 6), 16);
  if (isNaN(intVal)) return [1, 0.33, 0.25];
  const r = ((intVal >> 16) & 255) / 255;
  const g = ((intVal >> 8) & 255) / 255;
  const b = (intVal & 255) / 255;
  return [r, g, b];
};

export const Aurora: React.FC<AuroraProps> = (props) => {
  const {
    colorStops = ['#ff5540', '#feba39', '#ff7563'],
    amplitude = 1.0,
    blend = 0.5,
    speed = 0.5
  } = props;

  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer: Renderer | null = null;
    let animateId = 0;

    try {
      // Cap DPR to 1.25 for maximum performance on high-DPI and mobile screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      renderer = new Renderer({
        dpr,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';

      let program: Program;

      const resize = () => {
        if (!ctn || !renderer || !program) return;
        const width = ctn.offsetWidth || window.innerWidth;
        const height = ctn.offsetHeight || window.innerHeight;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      };

      let ro: ResizeObserver | null = null;
      if ('ResizeObserver' in window) {
        ro = new ResizeObserver(resize);
        ro.observe(ctn);
      } else {
        (window as any).addEventListener('resize', resize);
      }

      const geometry = new Triangle(gl);
      if (geometry.attributes && geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }

      const colorStopsArray = colorStops.map(hex => hexToRgb01(hex));

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [ctn.offsetWidth || window.innerWidth, ctn.offsetHeight || window.innerHeight] },
          uBlend: { value: blend }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });
      ctn.appendChild(gl.canvas);

      let isVisible = true;
      let io: IntersectionObserver | null = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(
          entries => {
            isVisible = entries[0]?.isIntersecting ?? true;
          },
          { threshold: 0.01 }
        );
        io.observe(ctn);
      }

      const update = (t: number) => {
        animateId = requestAnimationFrame(update);
        if (!isVisible || document.hidden || !program || !renderer) return;

        const { speed: curSpeed = speed } = propsRef.current;
        const curTime = t * 0.01;
        program.uniforms.uTime.value = curTime * curSpeed * 0.1;
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
        program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map(hex => hexToRgb01(hex));
        renderer.render({ scene: mesh });
      };
      animateId = requestAnimationFrame(update);

      resize();

      return () => {
        cancelAnimationFrame(animateId);
        ro?.disconnect();
        if (!ro) window.removeEventListener('resize', resize);
        io?.disconnect();
        if (ctn && gl.canvas && gl.canvas.parentNode === ctn) {
          try {
            ctn.removeChild(gl.canvas);
          } catch {
            // ignore cleanup errors
          }
        }
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    } catch (err) {
      console.warn('Aurora WebGL fallback:', err);
    }
  }, [amplitude, blend, speed]);

  return <div ref={ctnDom} className="aurora-container" />;
};

export default Aurora;
