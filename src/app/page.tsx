"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  ChevronRight,
  Github,
  Trophy,
  Terminal,
  ExternalLink,
} from "lucide-react";

/**
 * Procedural Onyx & Amber WebGL Shader Background Component
 */
const TacticalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      
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

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");

    let animationFrameId: number;
    const render = (time: number) => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, time * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };
    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-20 opacity-40 pointer-events-none"
    />
  );
};

/**
 * Main Landing Page Component
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      <TacticalBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <Flame size={18} className="text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            ABTalks
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 font-semibold text-sm hover:bg-orange-500/20 transition-colors"
        >
          Sign In
        </motion.button>
      </nav>

      {/* Content Container */}
      <main className="pt-24 pb-32 px-6 max-w-[390px] mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase"
          >
            <Flame size={14} className="animate-pulse" />
            60-Day Student Challenge
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent"
          >
            Build Consistency.<br />
            <span className="text-orange-500">Get Hired.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm leading-relaxed max-w-[280px] mx-auto"
          >
            The elite proof-of-work engine for high-performance students. Commit to the daily grind, build public credibility, and get noticed by top recruiters.
          </motion.p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="group relative w-full py-4 bg-orange-600 rounded-xl font-bold text-white shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Start Challenge <ChevronRight size={18} />
            </span>
          </motion.button>
        </section>

        {/* Tactical Briefs with Scroll Animations */}
        <section className="space-y-8">
          <h2 className="text-center text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
            Tactical Briefs
          </h2>

          <div className="space-y-4">
            {[
              { step: "01", title: "Daily Briefing", desc: "Receive a tactical task focused on core CS concepts or real-world building.", icon: Terminal },
              { step: "02", title: "Dual Proof", desc: "Commit code to GitHub and share the insight publicly on LinkedIn.", icon: Github },
              { step: "03", title: "Visibility", desc: "Climb the ranks. Top performers are highlighted directly to hiring partners.", icon: Trophy },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 rounded-2xl bg-[#1c1b1d]/40 backdrop-blur-md border border-white/5 hover:border-orange-500/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-orange-500/20 transition-colors">
                  <item.icon size={24} />
                </div>
                <span className="text-[10px] font-mono font-bold text-orange-500/60 uppercase tracking-widest mb-3 block">
                  Step {item.step}
                </span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Status Stacked Section */}
        <section className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1c1b1d] to-[#0e0e10] border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-end gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]" />
            <span className="text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase">
              Live Status
            </span>
          </div>

          <div className="grid gap-8">
            {[
              { label: "Active Students", value: "1,250+", color: "text-white" },
              { label: "Proofs Submitted", value: "75k", color: "text-orange-400" },
              { label: "Hired Cohort", value: "Top 5%", color: "text-blue-400" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-medium text-white/40 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 border-t border-white/5 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              <span className="font-bold text-xl">ABTalks</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              The elite proof-of-work engine for high-performance students. Build consistency, gain visibility, and get hired.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {[
              { title: "Challenge", links: ["Daily Briefing", "Proof-of-Work", "Leaderboard", "FAQ"] },
              { title: "Community", links: ["Discord", "LinkedIn", "GitHub", "Success Stories"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Honor Code"] },
            ].map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href="#" className="text-sm text-white/40 hover:text-orange-500 transition-colors flex items-center justify-between group">
                        {link} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 flex items-center justify-between text-white/20 text-[10px] font-bold uppercase tracking-widest border-t border-white/5">
            <span>© 2026 ABTalks. All Rights Reserved.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
