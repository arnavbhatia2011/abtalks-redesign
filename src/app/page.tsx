"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Terminal,
  Code2,
  Link2,
  Trophy,
} from "lucide-react";

export default function Home() {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // WebGL Background Shader Engine
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

      {/* Tactical Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* Top Glass Navigation */}
      <header className="fixed top-0 w-full z-40 bg-[#131315]/40 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-4 h-16 max-w-[390px] mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
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

      {/* Main Container Locked to 390px Mobile Viewport */}
      <main className="pt-24 pb-20 px-4 max-w-[390px] mx-auto flex flex-col gap-10 relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mt-4 relative w-full">
          <div className="border border-orange-500/30 bg-orange-500/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
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
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Tactical Briefs / Steps Section */}
        <section className="mt-4">
          <h2 className="text-lg font-bold text-center mb-6 text-white/90 uppercase tracking-wider">
            Tactical Briefs
          </h2>
          <div className="flex flex-col gap-4">
            {/* Step 1 */}
            <div className="bg-[#131315]/40 backdrop-blur-2xl border border-white/10 p-5 rounded-xl relative overflow-hidden group shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-neutral-500 tracking-wider">
                  STEP 01
                </span>
                <Terminal className="w-5 h-5 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Daily Briefing
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Receive a tactical task focused on core CS concepts or real-world building.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#131315]/40 backdrop-blur-2xl border border-white/10 p-5 rounded-xl relative overflow-hidden group shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-neutral-500 tracking-wider">
                  STEP 02
                </span>
                <div className="flex gap-2">
                  <Code2 className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(255,198,64,0.5)]" />
                  <Link2 className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(255,198,64,0.5)]" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Dual Proof
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Commit code to GitHub and share the insight publicly on LinkedIn.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#131315]/40 backdrop-blur-2xl border border-white/10 p-5 rounded-xl relative overflow-hidden group shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-neutral-500 tracking-wider">
                  STEP 03
                </span>
                <Trophy className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(192,193,255,0.5)]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Visibility
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Climb the ranks. Top performers are highlighted directly to hiring partners.
              </p>
            </div>
          </div>
        </section>

        {/* Live Status Grid */}
        <section className="mt-2">
          <div className="bg-[#131315]/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 relative shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-orange-400 tracking-widest uppercase">
                Live Status
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-white">1,250+</div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-wider mt-1">
                  Students
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(255,198,64,0.3)]">
                  75k
                </div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-wider mt-1">
                  Proofs
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-indigo-300 drop-shadow-[0_0_8px_rgba(192,193,255,0.3)]">
                  Top 5%
                </div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-wider mt-1">
                  Hired
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0e0e10] py-10 px-4 text-center max-w-[390px] mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-white text-sm bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            ABTalks
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mb-6 max-w-[260px] mx-auto leading-relaxed">
          The elite proof-of-work engine for high-performance students. Build consistency, gain visibility, and get hired.
        </p>
        <p className="text-[9px] text-neutral-600 tracking-widest uppercase">
          © 2026 ABTALKS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
