"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export default function Home() {
  useEffect(() => {
    // 1. WebGL Background Shader Canvas
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
            vec3 color = vec3(0.06, 0.06, 0.07);
            float t = u_time * 0.25;
            vec3 orange = vec3(0.976, 0.35, 0.05);
            float ambientGlow = smoothstep(0.0, 1.0, uv.y + sin(t)*0.15);
            color += orange * ambientGlow * 0.08;
            color += (noise(uv + u_time * 0.005) - 0.5) * 0.025;
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
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
              gl.STATIC_DRAW
            );

            const positionLocation = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            const timeLocation = gl.getUniformLocation(program, "u_time");

            let animationFrameId: number;
            const render = (time: number) => {
              gl.uniform1f(timeLocation, time * 0.001);
              gl.drawArrays(gl.TRIANGLES, 0, 6);
              animationFrameId = requestAnimationFrame(render);
            };
            animationFrameId = requestAnimationFrame(render);

            return () => cancelAnimationFrame(animationFrameId);
          }
        }
      }
    }
  }, []);

  // 2. Three.js Flame Graphic Initializer
  const initThreeScene = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const THREE = (window as any).THREE;
    if (!THREE) return;

    const container = document.getElementById("threejs-container");
    if (!container || container.children.length > 0) return;

    const width = 120;
    const height = 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const orangeMaterial = new THREE.MeshPhongMaterial({
      color: 0xf97316,
      emissive: 0xe65100,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95,
      shininess: 90,
    });

    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const core = new THREE.Mesh(coreGeo, orangeMaterial);
    group.add(core);

    const tipGeo = new THREE.ConeGeometry(0.5, 1.1, 32);
    const tip = new THREE.Mesh(tipGeo, orangeMaterial);
    tip.position.y = 0.5;
    group.add(tip);

    scene.add(group);

    const light = new THREE.PointLight(0xf97316, 2.5, 10);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    camera.position.z = 2.6;

    function animate() {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      group.rotation.y = time * 0.6;
      group.rotation.z = Math.sin(time * 0.8) * 0.08;
      group.position.y = Math.sin(time * 1.5) * 0.04;
      const s = 1.0 + Math.sin(time * 2.5) * 0.03;
      group.scale.set(s, s, s);
      renderer.render(scene, camera);
    }

    animate();
  };

  return (
    <div className="min-h-screen bg-[#eef0f3] flex items-center justify-center p-4 sm:p-8">
      {/* External Scripts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        onLoad={initThreeScene}
      />

      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }

        /* Smooth Custom Scrollbar */
        .phone-viewport::-webkit-scrollbar {
          width: 4px;
        }
        .phone-viewport::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .phone-viewport::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .pulse-glow {
          animation: pulseGlow 2.5s infinite alternate;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(249, 115, 22, 0.2); }
          100% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.45); }
        }
      `}</style>

      {/* STITCH MOBILE PHONE FRAME CONTAINER */}
      <div className="w-full max-w-[390px] h-[812px] bg-[#0c0c0e] rounded-[48px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_12px_#34373c,0_0_0_14px_#1e2023] relative overflow-hidden flex flex-col">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#101015] border border-white/10" />
        </div>

        {/* INNER SCROLLABLE PHONE VIEWPORT */}
        <div className="phone-viewport w-full h-full bg-[#0a0a0c] rounded-[38px] overflow-y-auto overflow-x-hidden relative flex flex-col justify-between select-none">
          
          {/* Shader Canvas bounded inside screen */}
          <canvas id="bg-canvas" className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

          {/* Sticky Header */}
          <header className="sticky top-0 z-40 bg-[#0a0a0c]/85 backdrop-blur-xl flex justify-between items-center px-5 pt-8 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#f97316] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-extrabold text-sm text-white tracking-tight">
                ABTalks
              </span>
            </div>
            <button className="bg-transparent hover:bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/60 font-semibold text-[11px] px-3.5 py-1 rounded-md transition-all">
              Sign In
            </button>
          </header>

          {/* Body Content */}
          <main className="px-5 py-6 flex flex-col gap-10 relative z-10">
            
            {/* HERO SECTION */}
            <section className="flex flex-col items-center text-center pt-2">
              
              {/* Badge */}
              <div className="border border-[#f97316]/40 bg-[#f97316]/10 backdrop-blur-md rounded-full px-3 py-1 mb-3 flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <span className="material-symbols-outlined text-[#f97316] text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider">
                  60-Day Student Challenge
                </span>
              </div>

              {/* 3D Flame Icon */}
              <div id="threejs-container" className="w-[120px] h-[120px] flex items-center justify-center -my-2" />

              {/* Headline */}
              <h1 className="text-2xl font-black text-white leading-tight mb-3 tracking-tight">
                Build <br />
                Consistency. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#ff9800]">
                  Get Hired.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-[280px] mb-6">
                The elite proof-of-work engine for high-performance students. Commit to the daily grind, build public credibility, and get noticed by top recruiters.
              </p>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-[#16161a] to-[#121215] text-[#f97316] border border-[#f97316]/50 font-bold text-xs py-3 rounded-xl pulse-glow flex items-center justify-center gap-2 hover:brightness-125 transition-all">
                Start Challenge
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </section>

            {/* SECTION: TACTICAL BRIEFS */}
            <section className="flex flex-col gap-3">
              <h2 className="text-center text-xs font-bold text-gray-300 tracking-wider mb-1">
                Tactical Briefs
              </h2>

              {/* Step 1 */}
              <div className="bg-[#121216]/90 border border-white/[0.08] p-4 rounded-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-[#f97316] tracking-widest font-bold uppercase">
                    STEP 01
                  </span>
                  <span className="material-symbols-outlined text-[#f97316] text-base">
                    subtitles
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Daily Briefing</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Receive a tactical task focused on core CS concepts or real-world building.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#121216]/90 border border-white/[0.08] p-4 rounded-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-[#f97316] tracking-widest font-bold uppercase">
                    STEP 02
                  </span>
                  <div className="flex gap-1">
                    <span className="material-symbols-outlined text-[#f97316] text-base">code</span>
                    <span className="material-symbols-outlined text-[#f97316] text-base">link</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Dual Proof</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Commit code to GitHub and share the insight publicly on LinkedIn.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#121216]/90 border border-white/[0.08] p-4 rounded-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-[#f97316] tracking-widest font-bold uppercase">
                    STEP 03
                  </span>
                  <span className="material-symbols-outlined text-[#818cf8] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Visibility</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Climb the ranks. Top performers are highlighted directly to hiring partners.
                </p>
              </div>
            </section>

            {/* SECTION: LIVE STATUS (STITCH STACKED CARDS) */}
            <section className="flex flex-col gap-3 pb-4">
              <div className="flex items-center justify-end gap-1.5 pr-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-ping" />
                <span className="font-mono text-[9px] text-[#f97316] tracking-widest font-bold uppercase">
                  LIVE STATUS
                </span>
              </div>

              <div className="bg-[#121216]/90 border border-white/[0.08] p-4 rounded-xl backdrop-blur-md flex flex-col gap-1">
                <span className="text-base font-extrabold text-white">1,250+</span>
                <span className="text-[10px] text-gray-400 font-medium">Active Students</span>
              </div>

              <div className="bg-[#121216]/90 border border-white/[0.08] p-4 rounded-xl backdrop-blur-md flex flex-col gap-1">
                <span className="text-base font-extrabold text-[#f97316]">75k</span>
                <span className="text-[10px] text-gray-400 font-medium">Proofs Submitted</span>
              </div>

              <div className="bg-[#121216]/90 border border-white/[0.08] p-4 rounded-xl backdrop-blur-md flex flex-col gap-1">
                <span className="text-base font-extrabold text-[#818cf8]">Top 5%</span>
                <span className="text-[10px] text-gray-400 font-medium">Hired Cohort</span>
              </div>
            </section>
          </main>

          {/* Footer inside viewport */}
          <footer className="border-t border-white/[0.06] bg-[#08080a] p-4 text-center relative z-10">
            <p className="text-[8px] text-gray-500 font-mono tracking-widest uppercase">
              © 2026 ABTALKS. ALL RIGHTS RESERVED.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
