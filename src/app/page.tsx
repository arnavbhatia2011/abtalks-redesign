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

    // 2. WebGL Background Shader
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
            const positions = [
              -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

            const positionAttributeLocation = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            const timeLocation = gl.getUniformLocation(program, "u_time");
            const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

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
              gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
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

  // 3. Three.js Hero Scene Initialization
  const initThreeScene = () => {
    const THREE = (window as unknown as { THREE: typeof import("three") }).THREE;
    if (!THREE) return;

    const container = document.getElementById("threejs-container");
    if (!container || container.children.length > 0) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
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

    const coreGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const core = new THREE.Mesh(coreGeo, orangeMaterial);
    group.add(core);

    const tipGeo = new THREE.ConeGeometry(0.6, 1.4, 32);
    const tip = new THREE.Mesh(tipGeo, orangeMaterial);
    tip.position.y = 0.6;
    group.add(tip);

    scene.add(group);

    const light = new THREE.PointLight(0xf97316, 2, 10);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 3.5;

    function animate() {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      group.rotation.y = time * 0.5;
      group.rotation.z = Math.sin(time * 0.7) * 0.1;
      group.position.y = Math.sin(time) * 0.1;
      const s = 1.0 + Math.sin(time * 2.0) * 0.05;
      group.scale.set(s, s, s);
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    animate();
  };

  return (
    <>
      {/* External Font & Icon Stylesheets */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap"
        rel="stylesheet"
      />

      {/* Script for Three.js CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        onLoad={initThreeScene}
      />

      {/* Stitch CSS & Custom Animations */}
      <style jsx global>{`
        :root {
          --primary: #ffb690;
          --secondary: #ffc640;
          --tertiary: #c0c1ff;
          --bg-color: #131315;
          --on-surface: #e5e1e4;
          --on-surface-variant: #e0c0b1;
        }

        body {
          min-height: max(884px, 100dvh);
          background-color: var(--bg-color);
          color: var(--on-surface);
          font-family: 'Geist', sans-serif;
        }

        .glass-card {
          background: rgba(19, 19, 21, 0.4);
          backdrop-filter: blur(60px);
          -webkit-backdrop-filter: blur(60px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .glow-button {
          position: relative;
          background: rgba(249, 115, 22, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(249, 115, 22, 0.5);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.2), inset 0 0 20px rgba(249, 115, 22, 0.1);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          z-index: 1;
        }

        .glow-button::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(249, 115, 22, 0.8), transparent 30%);
          animation: rotateBorder 4s linear infinite;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .glow-button::after {
          content: '';
          position: absolute;
          inset: 2px;
          background: #131315;
          border-radius: inherit;
          z-index: -1;
          transition: background 0.3s;
        }

        .glow-button:hover::before { opacity: 1; }
        .glow-button:hover::after { background: rgba(249, 115, 22, 0.1); }
        .glow-button:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 10px 40px rgba(249, 115, 22, 0.4);
        }
        .glow-button:active { transform: scale(0.95); }

        @keyframes rotateBorder {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .badge-border {
          border: 1px solid rgba(249, 115, 22, 0.3);
          background: rgba(249, 115, 22, 0.1);
          backdrop-filter: blur(10px);
        }

        .fade-up-enter {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          animation: tacticalFadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes tacticalFadeUp {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        .pulse-dot {
          animation: pulseDot 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        @keyframes pulseDot {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
          50% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }

        .scanlines {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 3px 100%;
          z-index: 9999;
          pointer-events: none;
          opacity: 0.05;
        }

        .hero-text-glow {
          background: linear-gradient(135deg, #e5e1e4 0%, #c0c1ff 40%, #ffb690 80%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 40px rgba(249, 115, 22, 0.4), 0 0 80px rgba(255, 182, 144, 0.2);
        }

        #bg-canvas {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          z-index: -2;
        }

        #threejs-container {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 100%; height: 120%;
          z-index: -1;
          pointer-events: none;
        }

        .nav-blur {
          background: rgba(19, 19, 21, 0.2);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>

      {/* WebGL Canvas & Scanlines */}
      <canvas id="bg-canvas" />
      <div className="scanlines" />

      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 nav-blur flex justify-between items-center px-4 md:px-6 h-16 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#ffb690] pulse-dot"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
          <span className="font-bold text-xl bg-gradient-to-r from-[#ffb690] to-[#ffc640] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,182,144,0.5)]">
            ABTalks
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#f97316] text-[#582200] font-semibold text-xs px-4 py-2 rounded-full glow-button active:scale-95">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 md:px-6 max-w-7xl mx-auto flex flex-col gap-8 relative z-10 overflow-hidden">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mt-12 relative min-h-[50vh] w-full max-w-[390px] mx-auto md:max-w-none">
          <div id="threejs-container" />
          <div className="badge-border rounded-full px-4 py-1 mb-6 flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.2)] fade-up-enter stagger-1">
            <span
              className="material-symbols-outlined text-[#ffb690] text-sm pulse-dot"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="text-xs font-semibold text-[#ffb690] uppercase tracking-wider">
              60-Day Student Challenge
            </span>
          </div>

          <h1 className="text-[40px] md:text-[64px] leading-[1.1] md:leading-tight font-extrabold hero-text-glow mb-6 w-full relative z-10 fade-up-enter stagger-2">
            Build Consistency.
            <br />
            Get Hired.
          </h1>

          <p className="text-sm text-[#e0c0b1] w-full mb-8 relative z-10 drop-shadow-md fade-up-enter stagger-3 px-2">
            The elite proof-of-work engine for high-performance students. Commit to the daily grind, build public credibility, and get noticed by top recruiters.
          </p>

          <button className="text-[#ffb690] font-bold text-lg px-8 py-4 rounded-full glow-button active:scale-95 flex items-center gap-2 group relative z-10 fade-up-enter stagger-4">
            Start Challenge
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform duration-300">
              arrow_forward
            </span>
          </button>
        </section>

        {/* Tactical Briefs Section */}
        <section className="mt-16 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 fade-up-enter text-white/90">
            Tactical Briefs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="glass-card p-6 rounded-xl fade-up-enter stagger-1 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#e0c0b1] tracking-wider">
                  STEP 01
                </span>
                <span className="material-symbols-outlined text-[#ffb690] text-2xl drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                  terminal
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">
                Daily Briefing
              </h3>
              <p className="text-sm text-[#e0c0b1]">
                Receive a tactical task focused on core CS concepts or real-world building.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 rounded-xl fade-up-enter stagger-2 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#e0c0b1] tracking-wider">
                  STEP 02
                </span>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-[#ffc640] text-2xl drop-shadow-[0_0_8px_rgba(255,198,64,0.5)]">
                    code
                  </span>
                  <span className="material-symbols-outlined text-[#ffc640] text-2xl drop-shadow-[0_0_8px_rgba(255,198,64,0.5)]">
                    link
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Dual Proof</h3>
              <p className="text-sm text-[#e0c0b1]">
                Commit code to GitHub and share the insight publicly on LinkedIn.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 rounded-xl fade-up-enter stagger-3 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#e0c0b1] tracking-wider">
                  STEP 03
                </span>
                <span
                  className="material-symbols-outlined text-[#c0c1ff] text-2xl drop-shadow-[0_0_8px_rgba(192,193,255,0.5)]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  emoji_events
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Visibility</h3>
              <p className="text-sm text-[#e0c0b1]">
                Climb the ranks. Top performers are highlighted directly to hiring partners.
              </p>
            </div>
          </div>
        </section>

        {/* Live Stats Grid */}
        <section className="mt-16 fade-up-enter relative z-10" id="stats-section">
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden transition-transform duration-200 ease-out">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ffb690] pulse-dot" />
              <span className="font-mono text-xs text-[#ffb690] tracking-widest">
                LIVE STATUS
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6">
              <div>
                <div className="text-3xl font-extrabold text-white mb-1 drop-shadow-md">
                  1,250+
                </div>
                <div className="text-xs uppercase text-[#e0c0b1] tracking-wider font-semibold">
                  Active Students
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#ffc640] mb-1 drop-shadow-[0_0_10px_rgba(255,198,64,0.3)]">
                  75k
                </div>
                <div className="text-xs uppercase text-[#e0c0b1] tracking-wider font-semibold">
                  Proofs Submitted
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#c0c1ff] mb-1 drop-shadow-[0_0_10px_rgba(192,193,255,0.3)]">
                  Top 5%
                </div>
                <div className="text-xs uppercase text-[#e0c0b1] tracking-wider font-semibold">
                  Hired Cohort
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-white/5 bg-[#0e0e10] pt-16 pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#ffb690] pulse-dot"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="font-bold text-2xl bg-gradient-to-r from-[#ffb690] to-[#ffc640] bg-clip-text text-transparent">
                ABTalks
              </span>
            </div>
            <p className="text-sm text-[#e0c0b1] leading-relaxed">
              The elite proof-of-work engine for high-performance students. Build consistency, gain visibility, and get hired.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-6 tracking-widest uppercase">
              Challenge
            </h4>
            <ul className="flex flex-col gap-3">
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Daily Briefing</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Proof-of-Work</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Leaderboard</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-6 tracking-widest uppercase">
              Community
            </h4>
            <ul className="flex flex-col gap-3">
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Discord</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">LinkedIn</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">GitHub</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-6 tracking-widest uppercase">
              Legal
            </h4>
            <ul className="flex flex-col gap-3">
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Terms of Service</a></li>
              <li><a className="text-sm text-[#e0c0b1] hover:text-[#ffb690] transition-colors" href="#">Honor Code</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-[#e0c0b1]/60 tracking-widest uppercase font-mono">
            © 2026 ABTALKS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <a className="text-[#e0c0b1]/60 hover:text-[#ffb690] transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">brand_awareness</span>
            </a>
            <a className="text-[#e0c0b1]/60 hover:text-[#ffb690] transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">terminal</span>
            </a>
            <a className="text-[#e0c0b1]/60 hover:text-[#ffb690] transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
