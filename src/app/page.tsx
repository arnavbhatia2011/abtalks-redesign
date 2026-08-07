"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        v_texCoord = position * 0.5 + 0.5;
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = v_texCoord;
        vec3 color = vec3(0.04, 0.04, 0.05);
        float pulse = sin(u_time * 0.8) * 0.5 + 0.5;
        float t = u_time * 0.3;
        vec3 orange = vec3(0.976, 0.451, 0.086);
        
        float ambientGlow = smoothstep(0.2, 0.8, uv.y + sin(t)*0.2);
        color += orange * ambientGlow * 0.05;
        
        float streaks = smoothstep(0.45, 0.55, sin(uv.x * 12.0 + uv.y * 2.0 + t));
        color += orange * streaks * 0.08 * pulse;
        color += (noise(uv + u_time * 0.01) - 0.5) * 0.02;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(glContext: WebGLRenderingContext, type: number, source: string) {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    function resize() {
      if (!canvas || !gl) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resize);
    resize();

    let animationFrameId: number;
    function render(time: number) {
      if (!gl) return;
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="text-neutral-100 min-h-screen font-sans overflow-x-hidden relative bg-[#131315]">
      {/* Background WebGL Canvas */}
      <canvas
        ref={bgCanvasRef}
        className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none"
      />

      {/* Top Header */}
      <header className="fixed top-0 w-full z-40 bg-[#131315]/40 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-4 h-16 max-w-[390px] mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 23c6.075 0 10-3.925 10-10 0-4.008-2.355-7.483-5.789-9.146a.75.75 0 00-.977.886c.492 1.83.181 3.864-.908 5.437-1.127 1.628-2.91 2.584-4.882 2.584-2.36 0-4.48-1.378-5.46-3.55a.75.75 0 00-1.282-.162C2.651 11.233 2 13.987 2 16.5 2 20.075 5.925 23 12 23z" />
          </svg>
          <span className="font-bold text-lg bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            ABTalks
          </span>
        </div>
        <Link
          href="/dashboard"
          className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 font-medium text-xs px-4 py-2 rounded-full transition-all active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        >
          Sign In
        </Link>
      </header>

      {/* Main Container */}
      <main className="pt-24 pb-20 px-4 max-w-[390px] mx-auto flex flex-col gap-10 relative z-10">
        <section className="flex flex-col items-center justify-center text-center mt-4 relative w-full">
          <div className="border border-orange-500/30 bg-orange-500/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
              60-Day Student Challenge
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-orange-400 mb-6 leading-tight drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            Build Consistency.
            <br />
            Get Hired.
          </h1>

          <p className="text-xs text-neutral-400 mb-8 leading-relaxed px-2">
            The elite proof-of-work engine for high-performance students. Commit to the daily grind, build public credibility, and get noticed by top recruiters.
          </p>

          <Link
            href="/dashboard"
            className="w-full bg-orange-500/10 border border-orange-500/50 hover:bg-orange-500/20 text-orange-400 font-bold py-4 rounded-full shadow-[0_0_25px_rgba(249,115,22,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <span>Start Challenge</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
