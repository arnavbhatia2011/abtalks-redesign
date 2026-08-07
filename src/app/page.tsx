<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ABTalks - 60-Day Student Challenge</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "inverse-primary": "#9d4300",
                        "secondary": "#ffc640",
                        "on-secondary": "#402d00",
                        "tertiary-container": "#8c8fff",
                        "on-secondary-fixed-variant": "#5c4300",
                        "surface-container-low": "#1c1b1d",
                        "inverse-surface": "#e5e1e4",
                        "error-container": "#93000a",
                        "secondary-container": "#e3aa00",
                        "on-primary-fixed-variant": "#783200",
                        "surface-container-highest": "#353437",
                        "on-error-container": "#ffdad6",
                        "surface-dim": "#131315",
                        "tertiary": "#c0c1ff",
                        "on-surface-variant": "#e0c0b1",
                        "tertiary-fixed-dim": "#c0c1ff",
                        "outline-variant": "#584237",
                        "secondary-fixed-dim": "#f9bd22",
                        "on-background": "#e5e1e4",
                        "on-secondary-container": "#5a4100",
                        "on-primary-fixed": "#341100",
                        "error": "#ffb4ab",
                        "on-tertiary-fixed-variant": "#2f2ebe",
                        "surface-container-high": "#2a2a2c",
                        "surface-container-lowest": "#0e0e10",
                        "outline": "#a78b7d",
                        "primary-fixed": "#ffdbca",
                        "on-tertiary-fixed": "#07006c",
                        "surface-variant": "#353437",
                        "surface-tint": "#ffb690",
                        "secondary-fixed": "#ffdf9f",
                        "primary-fixed-dim": "#ffb690",
                        "on-surface": "#e5e1e4",
                        "on-tertiary": "#1000a9",
                        "surface-container": "#201f22",
                        "inverse-on-surface": "#313032",
                        "on-secondary-fixed": "#261a00",
                        "tertiary-fixed": "#e1e0ff",
                        "background": "#131315",
                        "primary": "#ffb690",
                        "on-error": "#690005",
                        "surface": "#131315",
                        "primary-container": "#f97316",
                        "on-primary": "#552100",
                        "on-tertiary-container": "#1304ac",
                        "on-primary-container": "#582200",
                        "surface-bright": "#39393b"
                    },
                    borderRadius: {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    spacing: {
                        "container-padding-desktop": "24px",
                        "unit": "4px",
                        "stack-md": "16px",
                        "gutter": "16px",
                        "stack-lg": "32px",
                        "container-padding-mobile": "16px",
                        "stack-sm": "8px"
                    },
                    fontFamily: {
                        "code-sm": ["JetBrains Mono"],
                        "display-sm": ["Geist"],
                        "display-lg": ["Geist"],
                        "headline-lg": ["Geist"],
                        "label-caps": ["Geist"],
                        "body-md": ["Geist"],
                        "headline-lg-mobile": ["Geist"]
                    },
                    fontSize: {
                        "code-sm": ["14px", { "lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "500" }],
                        "display-sm": ["32px", { "lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                        "display-lg": ["48px", { "lineHeight": "52px", "letterSpacing": "-0.04em", "fontWeight": "800" }],
                        "headline-lg": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.1em", "fontWeight": "700" }],
                        "body-md": ["16px", { "lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400" }],
                        "headline-lg-mobile": ["20px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600" }]
                    }
                }
            }
        }
    </script>
<style>
        .glass-card {
            background: rgba(23, 23, 23, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glow-button {
            box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .glow-button:active {
            transform: scale(0.96);
            box-shadow: 0 0 30px rgba(249, 115, 22, 0.5);
        }
        .badge-border {
            border: 1px solid transparent;
            background: linear-gradient(to right, rgba(255, 182, 144, 0.1), rgba(249, 115, 22, 0.1)) padding-box,
                        linear-gradient(to right, #ffb690, #f97316) border-box;
        }
        .fade-up-enter {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        
        .pulse-dot {
            animation: pulseDot 2s infinite;
        }
        @keyframes pulseDot {
            0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(249, 115, 22, 0); }
            100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen font-body-md overflow-x-hidden">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-surface/60 dark:bg-surface/60 backdrop-blur-xl border-b border-on-surface/10 shadow-none flex justify-between items-center px-container-padding-mobile h-16 max-w-7xl mx-auto transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:opacity-80">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary dark:text-primary" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
<span class="font-display-sm text-display-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,182,144,0.5)]">ABTalks</span>
</div>
<div class="flex items-center gap-4">
<button class="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-4 py-2 rounded-full glow-button">
                Sign In
            </button>
</div>
</header>
<main class="pt-24 pb-32 px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto flex flex-col gap-stack-lg">
<!-- Hero Section -->
<section class="flex flex-col items-center justify-center text-center mt-12 fade-up-enter">
<div class="badge-border rounded-full px-4 py-1 mb-6 flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
<span class="font-label-caps text-label-caps text-primary">60-Day Student Challenge</span>
</div>
<h1 class="font-display-lg text-display-lg md:text-[64px] leading-tight md:leading-tight font-extrabold bg-gradient-to-r from-white via-primary-fixed to-primary-container bg-clip-text text-transparent mb-6 max-w-2xl">
                Build Consistency.<br/>Get Hired.
            </h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-xl mb-8">
                The elite proof-of-work engine for high-performance students. Commit to the daily grind, build public credibility, and get noticed by top recruiters.
            </p>
<button class="bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-headline-lg-mobile text-headline-lg-mobile px-8 py-4 rounded-full glow-button flex items-center gap-2 group">
                Start Challenge
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
</section>
<!-- Proof-of-Work Engine -->
<section class="mt-16">
<h2 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-center mb-8 fade-up-enter">The Engine</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
<!-- Step 1 -->
<div class="glass-card p-6 rounded-xl fade-up-enter stagger-1 relative overflow-hidden group">
<div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
<div class="flex items-center justify-between mb-4">
<span class="font-code-sm text-code-sm text-on-surface-variant">STEP 01</span>
<span class="material-symbols-outlined text-primary text-2xl">terminal</span>
</div>
<h3 class="font-headline-lg-mobile text-headline-lg-mobile mb-2">Daily Briefing</h3>
<p class="text-sm text-on-surface-variant">Receive a tactical task focused on core CS concepts or real-world building.</p>
</div>
<!-- Step 2 -->
<div class="glass-card p-6 rounded-xl fade-up-enter stagger-2 relative overflow-hidden group">
<div class="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
<div class="flex items-center justify-between mb-4">
<span class="font-code-sm text-code-sm text-on-surface-variant">STEP 02</span>
<div class="flex gap-2">
<span class="material-symbols-outlined text-secondary text-2xl">code</span>
<span class="material-symbols-outlined text-secondary text-2xl">link</span>
</div>
</div>
<h3 class="font-headline-lg-mobile text-headline-lg-mobile mb-2">Dual Proof</h3>
<p class="text-sm text-on-surface-variant">Commit code to GitHub and share the insight publicly on LinkedIn.</p>
</div>
<!-- Step 3 -->
<div class="glass-card p-6 rounded-xl fade-up-enter stagger-3 relative overflow-hidden group">
<div class="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
<div class="flex items-center justify-between mb-4">
<span class="font-code-sm text-code-sm text-on-surface-variant">STEP 03</span>
<span class="material-symbols-outlined text-tertiary text-2xl" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
</div>
<h3 class="font-headline-lg-mobile text-headline-lg-mobile mb-2">Visibility</h3>
<p class="text-sm text-on-surface-variant">Climb the ranks. Top performers are highlighted directly to hiring partners.</p>
</div>
</div>
</section>
<!-- Live Stats Grid -->
<section class="mt-16 fade-up-enter">
<div class="glass-card rounded-2xl p-8 relative">
<div class="absolute top-4 right-4 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-primary pulse-dot"></div>
<span class="font-code-sm text-code-sm text-primary">LIVE STATUS</span>
</div>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6">
<div>
<div class="font-display-sm text-display-sm text-white mb-1">1,250+</div>
<div class="font-label-caps text-label-caps text-on-surface-variant">Active Students</div>
</div>
<div>
<div class="font-display-sm text-display-sm text-secondary mb-1">75k</div>
<div class="font-label-caps text-label-caps text-on-surface-variant">Proofs Submitted</div>
</div>
<div>
<div class="font-display-sm text-display-sm text-tertiary mb-1">Top 5%</div>
<div class="font-label-caps text-label-caps text-on-surface-variant">Hired Cohort</div>
</div>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="md:hidden fixed bottom-0 w-full z-50 rounded-t-full bg-surface-container/80 dark:bg-surface-container/80 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] flex justify-around items-center h-20 pb-safe px-4 border-t border-white/10 transition-transform duration-200">
<!-- Home (Active) -->
<a class="flex flex-col items-center justify-center bg-primary-container/20 text-primary rounded-full px-4 py-1 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:opacity-80 transition-opacity active:scale-90" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-label-caps text-[10px] mt-1">Home</span>
</a>
<!-- Code -->
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80 transition-colors active:scale-90" href="#">
<span class="material-symbols-outlined">terminal</span>
<span class="font-label-caps text-[10px] mt-1">Code</span>
</a>
<!-- Ranks -->
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80 transition-colors active:scale-90" href="#">
<span class="material-symbols-outlined">leaderboard</span>
<span class="font-label-caps text-[10px] mt-1">Ranks</span>
</a>
<!-- User -->
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary/80 transition-colors active:scale-90" href="#">
<span class="material-symbols-outlined">person</span>
<span class="font-label-caps text-[10px] mt-1">User</span>
</a>
</nav>
<script>
        // Simple Intersection Observer for fade-up animations
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.fade-up-enter').forEach(el => {
                el.style.animationPlayState = 'paused';
                observer.observe(el);
            });
        });
    </script>
</body></html>
