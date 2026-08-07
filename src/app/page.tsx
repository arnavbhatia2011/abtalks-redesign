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
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // WebGL Background Shader Engine (TypeScript-Safe)
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
        color += orange * ambientGlow * 0.06;
        
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
      {/* Background WebGL Shader Canvas */}
      <canvas
        ref={bgCanvasRef}
        className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none"
      />

      {/* Tactical Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.15] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* Top Glass Navigation */}
      <header className="fixed top-0 w-full z-40 bg-[#131315]/60 backdrop-blur-2xl border-b border-white/10 flex justify-between items-center px-4 h-16 max-w-[390px] mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent tracking-tight">
            ABTalks
          </span>
        </div>
        <Link
          href="/dashboard"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-400/30"
        >
          Sign In
        </Link>
      </header>

      {/* Main Mobile Frame Container (Locked to 390px Layout) */}
      <main className="pt-24 pb-20 px-4 max-w-[390px] mx-auto flex flex-col gap-10 relative z-10">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mt-2 relative w-full">
          {/* Glowing Badge */}
          <div className="border border-orange-500/40 bg-orange-500/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.25)]">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              60-Day Proof-of-Work
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-100 to-orange-400 mb-5 leading-[1.15] drop-shadow-[0_0_25px_rgba(249,115,22,0.3)]">
            Build Consistency.
            <br />
            Get Hired.
          </h1>

          <p className="text-xs text-neutral-400 mb-8 leading-relaxed px-2 font-normal">
            The elite engine for ambitious tech students. Complete daily engineering tasks, publish dual proof on GitHub & LinkedIn, and unlock direct recruiter visibility.
          </p>

          {/* Primary Action Button */}
          <Link
            href="/dashboard"
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 group relative overflow-hidden border border-orange-400/40"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span className="text-sm">Start 60-Day Challenge</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Tactical Briefs / Steps Section */}
        <section className="mt-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Tactical Workflow
            </h2>
            <span className="text-[10px] font-mono text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              3 STEPS
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Step 1 */}
            <div className="bg-[#1c1b1e]/60 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-orange-400/80 tracking-wider font-semibold">
                  01 / BRIEFING
                </span>
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <Terminal className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Receive Daily Problem
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Unlock structured engineering briefs focusing on system design, CS fundamentals, and production code.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1c1b1e]/60 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-amber-400/80 tracking-wider font-semibold">
                  02 / PROOF OF WORK
                </span>
                <div className="flex gap-1.5 p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Code2 className="w-4 h-4" />
                  <Link2 className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Ship Code & Share Insight
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Push commits to GitHub and publish your public breakdown on LinkedIn to establish proof of capability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1c1b1e]/60 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-indigo-400/80 tracking-wider font-semibold">
                  03 / RECOGNITION
                </span>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Leaderboard & Hiring
              </h3>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Maintain your streak to gain tier badges. Consistent builders get directly featured to tech hiring partners.
              </p>
            </div>
          </div>
        </section>

        {/* Live Metrics Card */}
        <section className="mt-1">
          <div className="bg-gradient-to-b from-[#1c1b1e]/80 to-[#131315]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-mono text-white font-bold tracking-wider uppercase">
                  Engine Status
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">
                  ACTIVE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center relative z-10">
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <div className="text-lg font-bold text-white">1,250+</div>
                <div className="text-[9px] text-neutral-400 uppercase font-mono mt-0.5">
                  Builders
                </div>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <div className="text-lg font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(255,198,64,0.3)]">
                  75,000+
                </div>
                <div className="text-[9px] text-neutral-400 uppercase font-mono mt-0.5">
                  Proofs
                </div>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                <div className="text-lg font-bold text-indigo-300 drop-shadow-[0_0_10px_rgba(192,193,255,0.3)]">
                  Top 5%
                </div>
                <div className="text-[9px] text-neutral-400 uppercase font-mono mt-0.5">
                  Hired
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0b0b0c] py-8 px-4 text-center max-w-[390px] mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-white text-sm bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            ABTalks
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mb-4 max-w-[260px] mx-auto leading-relaxed">
          The elite proof-of-work engine for high-performance engineering students.
        </p>
        <p className="text-[9px] font-mono text-neutral-600 tracking-widest uppercase">
          © 2026 ABTALKS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
