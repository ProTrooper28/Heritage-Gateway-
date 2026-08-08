import { Mesh, Program, Renderer, Triangle, Vec2, Vec3 } from "ogl";
import { useEffect, useRef } from "react";

/**
 * Orb — ambient animated orb background (from React Bits, JS + CSS variant).
 *
 * Renders a WebGL shader orb that gently distorts on hover. Mounted only on the
 * client (inside useEffect), so SSR renders an empty container. The ENTIRE
 * WebGL setup (context, shader compile, first render) is guarded: if WebGL is
 * unavailable or anything throws, the component degrades silently to an empty
 * container instead of crashing the page. `onReady` fires after the first
 * successful frame so parents can fade it in over a CSS fallback.
 *
 * Styling uses the app's Tailwind tokens (equivalent to the upstream
 * `.orb-container` CSS): position relative, z-index 0, full size.
 */
type OrbProps = {
  /** Base hue for the orb, in degrees. */
  hue?: number;
  /** Intensity of the hover distortion effect. */
  hoverIntensity?: number;
  /** Continuous rotation while hovered. */
  rotateOnHover?: boolean;
  /** Force hover animations even when not hovered. */
  forceHoverState?: boolean;
  /** Background color of the container. */
  backgroundColor?: string;
  /** Called once the first frame has rendered successfully. */
  onReady?: () => void;
};

export default function Orb({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  backgroundColor = "#000000",
  onReady,
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement | null>(null);

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 backgroundColor;
    uniform vec2 mouse;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;

      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);

      v0 *= smoothstep(r0 * 1.05, r0, len);
      float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
      v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 colBase = mix(color1, color2, cl);
      float fadeAmount = mix(1.0, 0.1, bgLuminance);
      
      vec3 darkCol = mix(color3, colBase, v0);
      darkCol = (darkCol + v1) * v2 * v3;
      darkCol = clamp(darkCol, 0.0, 1.0);
      
      vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
      lightCol = mix(backgroundColor, lightCol, v0);
      lightCol = clamp(lightCol, 0.0, 1.0);
      
      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
      
      return extractAlpha(finalCol);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      // Cursor interaction — the orb leans toward the pointer and a soft
      // light trails it across the screen.
      uv -= mouse * (0.12 + 0.22 * hover * hoverIntensity);
      
      uv.x += hover * hoverIntensity * 0.12 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.12 * sin(uv.x * 10.0 + iTime);
      
      vec4 col = draw(uv);
      
      float glowDist = distance(uv, mouse);
      float glow = light2(0.9, 5.0, glowDist);
      col.rgb += glow * adjustHue(baseColor2, hue) * (0.25 + 0.45 * hover);
      
      return col;
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let rafId = 0;
    let disposed = false;
    let readyFired = false;

    let cleanup: (() => void) | undefined;

    try {
      // Renderer does NOT throw when a WebGL context can't be created — it
      // leaves `gl` null and falls back (webgl2 -> webgl). Guard both paths.
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
      const gl = renderer.gl;
      if (gl) {
        canvas = gl.canvas as HTMLCanvasElement;
        gl.clearColor(0, 0, 0, 0);
        container.appendChild(canvas);

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
          vertex: vert,
          fragment: frag,
          uniforms: {
            iTime: { value: 0 },
            iResolution: {
              value: new Vec3(canvas.width, canvas.height, canvas.width / canvas.height),
            },
            hue: { value: hue },
            hover: { value: 0 },
            rot: { value: 0 },
            hoverIntensity: { value: hoverIntensity },
            backgroundColor: { value: hexToVec3(backgroundColor) },
            mouse: { value: new Vec2(0, 0) },
          },
        });

        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
          if (!container || !renderer || !canvas) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width === 0 || height === 0) return;
          renderer.setSize(width * dpr, height * dpr);
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          program.uniforms["iResolution"].value.set(
            canvas.width,
            canvas.height,
            canvas.width / canvas.height,
          );
        }
        window.addEventListener("resize", resize);
        resize();

        // Pause the render loop when the tab is hidden to save battery/GPU.
        const handleVisibility = () => {
          if (document.hidden) {
            cancelAnimationFrame(rafId);
          } else if (!disposed) {
            lastTime = 0;
            rafId = requestAnimationFrame(update);
          }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        let targetHover = 0;
        let mouseX = 0;
        let mouseY = 0;
        let lastTime = 0;
        let currentRot = 0;
        const rotationSpeed = 0.3;

        // Listen on window: the wrapper is pointer-events-none (so the card
        // above stays fully interactive), which would otherwise swallow the
        // mousemove events before they reach the container.
        const handleMouseMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const width = rect.width;
          const height = rect.height;
          const size = Math.min(width, height);
          const centerX = width / 2;
          const centerY = height / 2;
          const uvX = ((x - centerX) / size) * 2.0;
          const uvY = ((y - centerY) / size) * 2.0;

          // Full-screen interaction: the orb follows the pointer and the
          // response falls off smoothly with distance.
          mouseX = Math.max(-1, Math.min(1, uvX));
          mouseY = Math.max(-1, Math.min(1, uvY));
          const dist = Math.sqrt(uvX * uvX + uvY * uvY);
          targetHover = Math.max(0, 1 - dist * 0.75);
        };

        const handleMouseLeave = () => {
          targetHover = 0;
          mouseX = 0;
          mouseY = 0;
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("blur", handleMouseLeave);

        const update = (t: number) => {
          if (disposed) return;
          rafId = requestAnimationFrame(update);
          try {
            if (lastTime === 0) lastTime = t;
            const dt = (t - lastTime) * 0.001;
            lastTime = t;
            program.uniforms["iTime"].value = t * 0.001;
            program.uniforms["hue"].value = hue;
            program.uniforms["hoverIntensity"].value = hoverIntensity;
            program.uniforms["backgroundColor"].value = hexToVec3(backgroundColor);
            program.uniforms["mouse"].value.set(mouseX, mouseY);

            const effectiveHover = forceHoverState ? 1 : targetHover;
            program.uniforms["hover"].value +=
              (effectiveHover - program.uniforms["hover"].value) * 0.1;

            if (rotateOnHover && effectiveHover > 0.5) {
              currentRot += dt * rotationSpeed;
            }
            program.uniforms["rot"].value = currentRot;

            renderer?.render({ scene: mesh });

            if (!readyFired) {
              readyFired = true;
              onReady?.();
            }
          } catch {
            // A broken frame must never take the page down — stop quietly.
            cancelAnimationFrame(rafId);
          }
        };
        rafId = requestAnimationFrame(update);

        cleanup = () => {
          disposed = true;
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", resize);
          document.removeEventListener("visibilitychange", handleVisibility);
          window.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseleave", handleMouseLeave);
          window.removeEventListener("blur", handleMouseLeave);
          if (canvas && canvas.parentNode === container) {
            container.removeChild(canvas);
          }
          try {
            gl.getExtension("WEBGL_lose_context")?.loseContext();
          } catch {
            // ignore teardown errors
          }
        };
      }
    } catch {
      // Any WebGL failure (context, shader compile, sizing) degrades to an
      // empty container — the parent's CSS background remains visible.
      if (canvas && canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState, backgroundColor, onReady]);

  return <div ref={ctnDom} className="relative z-0 h-full w-full" />;
}

function hslToRgb(h: number, s: number, l: number): Vec3 {
  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return new Vec3(r, g, b);
}

function hexToVec3(color: string): Vec3 {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    return new Vec3(r, g, b);
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return new Vec3(
      parseInt(rgbMatch[1] ?? "0", 10) / 255,
      parseInt(rgbMatch[2] ?? "0", 10) / 255,
      parseInt(rgbMatch[3] ?? "0", 10) / 255,
    );
  }

  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1] ?? "0", 10) / 360;
    const s = parseInt(hslMatch[2] ?? "0", 10) / 100;
    const l = parseInt(hslMatch[3] ?? "0", 10) / 100;
    return hslToRgb(h, s, l);
  }

  return new Vec3(0, 0, 0);
}
