"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export default function Home() {
  useEffect(() => {
    // 1. Intersection Observer for fade-up animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-up-enter").forEach((el) => {
      (el as HTMLElement).style.animationPlayState = "paused";
      observer.observe(el);
    });

    // 2. WebGL Shader Canvas
    const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement | null;
    if (canvas) {
      const gl = canvas.getContext("webgl");
      if (gl) {
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

          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }

          void main() {
            vec2 uv = v_texCoord;
            vec3 color = vec3(0.05, 0.05, 0.06);
            float pulse = sin(u_time * 0.8) * 0.5 + 0.5;
            float t = u_time * 0.3;
            vec3 orange = vec3(0.976, 0.451, 0.086);
            float ambientGlow = smoothstep(0.1, 0.9, uv.y + sin(t)*0.2);
            color += orange * ambientGlow * 0.06;
            color += (noise(uv + u_time * 0.01) - 0.5) * 0.02;
            gl_FragColor = vec4(color, 1.0);
          }
        `;

        const createShader = (glCtx: WebGLRenderingContext, type: number, source: string) => {
          const shader = glCtx.createShader(type);
          if (!shader) return null;
          glCtx.shaderSource(shader, source);
          glCtx.compileShader(shader);
          return shader;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (vertexShader && fragmentShader) {
          const program = gl.createProgram();
          if (program) {
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            const timeLocation = gl.getUniformLocation(program, "u_time");

            const resize = () => {
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
              gl.viewport(0, 0, canvas.width, canvas.height);
            };
            window.addEventListener("resize", resize);
            resize();

            let animationFrameId: number;
            const render = (time: number) => {
              gl.uniform1f(timeLocation, time * 0.001);
              gl.drawArrays(gl.TRIANGLES, 0, 6);
              animationFrameId = requestAnimationFrame(render);
            };
            animationFrameId = requestAnimationFrame(render);

            return () => {
              window.removeEventListener("resize", resize);
              cancelAnimationFrame(animationFrameId);
            };
          }
        }
      }
    }
  }, []);

  const initThreeScene = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const THREE = (window as any).THREE;
    if (!THREE) return;

    const container = document.getElementById("threejs-container");
    if (!container || container.children.length > 0) return;

    const width = container.clientWidth || 180;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const orangeMaterial = new THREE.MeshPhongMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.95,
      shininess: 100,
    });

    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const core = new THREE.Mesh(coreGeo, orangeMaterial);
    group.add(core);

    const tipGeo = new THREE.ConeGeometry(0.5, 1.1, 32);
    const tip = new THREE.Mesh(tipGeo, orangeMaterial);
    tip.position.y = 0.5;
    group.add(tip);

    scene.add(group);

    const light = new THREE.PointLight(0xf97316, 2, 10);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 2.8;

    function animate() {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      group.rotation.y = time * 0.5;
      group.rotation.z = Math.sin(time * 0.7) * 0.1;
      group.position.y = Math.sin(time) * 0.05;
      const s = 1.0 + Math.sin(time * 2.0) * 0.03;
      group.scale.set(s, s, s);
      renderer.render(scene, camera);
    }

    animate();
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        onLoad={initThreeScene}
      />

      <style jsx global>{`
        body {
          font-family: 'Geist', sans-serif;
          overflow-x: hidden;
        }

        .glass-card {
          background: rgba(19, 19, 21, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .glow-button {
          background: rgba(249, 115, 22, 0.15);
          border: 1px solid rgba(249, 115, 22, 0.5);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
          transition: all 0.3s ease;
        }

        .glow-button:hover {
          background: rgba(249, 115, 22, 0.25);
          transform: translateY(-2px);
        }

        .fade-up-enter {
          opacity: 0;
          transform: translateY(20px);
          animation: tacticalFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes tacticalFadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pulse-dot {
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }

        .hero-text-glow {
          background: linear-gradient(135deg, #ffffff 0%, #ffb690 60%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* Fixed Fullscreen Background Canvas */}
      <canvas id="bg-canvas" className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />

      {/* Main Container constrained to Max 420px (Mobile-friendly layout) */}
      <div className="w-full max-w-[420px] mx-auto min-h-screen flex flex-col justify-between bg-[#131315]/90 border-x border-white/5 relative z-10 shadow-2xl">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#131315]/80 backdrop-blur-md flex justify-between items-center px-5 h-16 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb690] pulse-dot text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="font-bold text-lg bg-gradient-to-r from-[#ffb690] to-[#ffc640] bg-clip-text text-transparent">
              ABTalks
            </span>
          </div>
          <button className="bg-[#f97316] text-white font-semibold text-xs px-4 py-2 rounded-full glow-button">
            Sign In
          </button>
        </header>

        {/* Content Body */}
        <main className="px-5 py-6 flex flex-col gap-10">
          
          {/* Hero Section */}
          <section className="flex flex-col items-center text-center">
            {/* 3D Flame Container with fixed size */}
            <div id="threejs-container" className="w-[180px] h-[180px] flex items-center justify-center my-2" />

            <div className="border border-[#f97316]/30 bg-[#f97316]/10 backdrop-blur-md rounded-full px-3.5 py-1 mb-4 flex items-center gap-1.5 fade-up-enter">
              <span className="material-symbols-outlined text-[#ffb690] text-xs pulse-dot" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="text-[11px] font-semibold text-[#ffb690] uppercase tracking-wider">
                60-Day Student Challenge
              </span>
            </div>

            <h1 className="text-3xl font-black hero-text-glow leading-tight mb-4 fade-up-enter">
              Build Consistency.
              <br />
              Get Hired.
            </h1>

            <p className="text-xs text-[#e0c0b1] leading-relaxed mb-6 fade-up-enter">
              The elite proof-of-work engine for high-performance students. Commit to the daily grind, build public credibility, and get noticed by top recruiters.
            </p>

            <button className="w-full text-[#ffb690] font-bold text-sm py-3.5 rounded-xl glow-button flex items-center justify-center gap-2 fade-up-enter">
              Start Challenge
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </section>

          {/* Tactical Briefs */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white/90 fade-up-enter">
              Tactical Briefs
            </h2>

            <div className="glass-card p-5 rounded-xl fade-up-enter">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-[#e0c0b1] tracking-widest uppercase">STEP 01</span>
                <span className="material-symbols-outlined text-[#ffb690] text-xl">terminal</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Daily Briefing</h3>
              <p className="text-xs text-[#e0c0b1] leading-relaxed">
                Receive a tactical task focused on core CS concepts or real-world building.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl fade-up-enter">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-[#e0c0b1] tracking-widest uppercase">STEP 02</span>
                <div className="flex gap-1.5">
                  <span className="material-symbols-outlined text-[#ffc640] text-xl">code</span>
                  <span className="material-symbols-outlined text-[#ffc640] text-xl">link</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Dual Proof</h3>
              <p className="text-xs text-[#e0c0b1] leading-relaxed">
                Commit code to GitHub and share the insight publicly on LinkedIn.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl fade-up-enter">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-[#e0c0b1] tracking-widest uppercase">STEP 03</span>
                <span className="material-symbols-outlined text-[#c0c1ff] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Visibility</h3>
              <p className="text-xs text-[#e0c0b1] leading-relaxed">
                Climb the ranks. Top performers are highlighted directly to hiring partners.
              </p>
            </div>
          </section>

          {/* Live Status Card */}
          <section className="fade-up-enter">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <span className="font-mono text-[10px] text-[#ffb690] tracking-widest font-semibold uppercase">
                  LIVE STATUS
                </span>
                <div className="w-2 h-2 rounded-full bg-[#ffb690] pulse-dot" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-extrabold text-white">1,250+</div>
                  <div className="text-[9px] uppercase text-[#e0c0b1] mt-0.5">Students</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#ffc640]">75k</div>
                  <div className="text-[9px] uppercase text-[#e0c0b1] mt-0.5">Proofs</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#c0c1ff]">Top 5%</div>
                  <div className="text-[9px] uppercase text-[#e0c0b1] mt-0.5">Hired</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0e0e10] p-5 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb690] text-lg pulse-dot" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="font-bold text-base bg-gradient-to-r from-[#ffb690] to-[#ffc640] bg-clip-text text-transparent">
              ABTalks
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-[#e0c0b1]">
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-white transition-colors">Daily Briefing</a>
              <a href="#" className="hover:text-white transition-colors">Proof-of-Work</a>
              <a href="#" className="hover:text-white transition-colors">Leaderboard</a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <p className="text-[9px] text-[#e0c0b1]/50 tracking-widest uppercase font-mono text-center pt-4 border-t border-white/5">
            © 2026 ABTALKS. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </>
  );
}
