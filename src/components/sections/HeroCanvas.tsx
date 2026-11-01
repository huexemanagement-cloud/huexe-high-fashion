"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight raw-WebGL hero shader: two same-origin textures crossfading with a
 * pointer-driven ripple displacement + RGB split + film grain. No heavy 3D deps.
 */
const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMix;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;
uniform vec2 uImgRes;

vec2 cover(vec2 uv) {
  float canvasAspect = uRes.x / uRes.y;
  float imgAspect = uImgRes.x / uImgRes.y;
  vec2 scale = canvasAspect > imgAspect
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);
  return (uv - 0.5) / scale + 0.5;
}

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = cover(vUv);
  vec2 m = uMouse;
  float d = distance(vUv * vec2(uRes.x / uRes.y, 1.0), m * vec2(uRes.x / uRes.y, 1.0));
  float ripple = sin(d * 26.0 - uTime * 2.2) * exp(-d * 5.5) * 0.028;
  float drift = sin(uv.y * 7.0 + uTime * 0.35) * 0.0035;

  vec2 off = vec2(ripple + drift, ripple * 0.7);
  float shift = 0.0035 + ripple * 0.6;

  vec4 a = vec4(
    texture2D(uTexA, uv + off + vec2(shift, 0.0)).r,
    texture2D(uTexA, uv + off).g,
    texture2D(uTexA, uv + off - vec2(shift, 0.0)).b,
    1.0);
  vec4 b = vec4(
    texture2D(uTexB, uv + off + vec2(shift, 0.0)).r,
    texture2D(uTexB, uv + off).g,
    texture2D(uTexB, uv + off - vec2(shift, 0.0)).b,
    1.0);

  vec4 color = mix(a, b, smoothstep(0.0, 1.0, uMix));
  float grain = (rand(vUv * uTime * 0.5) - 0.5) * 0.07;
  color.rgb += grain;
  float vig = smoothstep(1.15, 0.25, distance(vUv, vec2(0.5)));
  color.rgb *= mix(0.45, 1.0, vig);
  gl_FragColor = color;
}`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function loadTexture(gl: WebGLRenderingContext, src: string) {
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([14, 14, 14, 255]),
  );
  if (!src) return texture;

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } catch {
      // Retain dark fallback pixel
    }
  };
  image.onerror = () => {
    // Keep dark neutral texture gracefully without unhandled exceptions
  };
  image.src = src;
  return texture;
}

export function HeroCanvas({ sources }: { sources: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texA = loadTexture(gl, sources[0]);
    const texB = loadTexture(gl, sources[1] ?? sources[0]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texB);
    gl.uniform1i(gl.getUniformLocation(program, "uTexA"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uTexB"), 1);
    gl.uniform2f(gl.getUniformLocation(program, "uImgRes"), 1280, 1920);

    const uMix = gl.getUniformLocation(program, "uMix");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uRes = gl.getUniformLocation(program, "uRes");

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (event.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (event.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      const cycle = (t % 9) / 9;
      const mix = cycle < 0.5 ? smooth(cycle / 0.5) : 1 - smooth((cycle - 0.5) / 0.5);
      gl.uniform1f(uMix, mix);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    };
    render();

    function smooth(x: number) {
      return x * x * (3 - 2 * x);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      gl.deleteTexture(texA);
      gl.deleteTexture(texB);
      gl.deleteProgram(program);
    };
  }, [sources]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
