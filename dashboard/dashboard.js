/**
 * ABTalks Dashboard Pure Logic (dash.js)
 * Mounts directly onto your existing HTML elements without altering your UI/layout.
 */

document.addEventListener('DOMContentLoaded', () => {
    initISTTimer();
    initTop10Leaderboard();
    initUrlValidation();
});

/**
 * 1. DAILY RESET COUNTDOWN TIMER (IST TIMEZONE)
 * Calculates time remaining until 24:00 (Midnight) IST
 */
function updateISTTimer() {
    const timerEl = document.getElementById('ist-countdown');
    if (!timerEl) return;

    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(utcMs + istOffsetMs);

    const nextMidnightIST = new Date(istTime);
    nextMidnightIST.setHours(24, 0, 0, 0);

    const diff = nextMidnightIST - istTime;

    if (diff <= 0) {
        timerEl.innerText = "00h 00m 00s";
        return;
    }

    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    timerEl.innerText = `${hours}h ${minutes}m ${seconds}s`;
}

function initISTTimer() {
    updateISTTimer();
    setInterval(updateISTTimer, 1000);
}

// Explicit Top 10 Participants Data
const TOP_10_LEADERS = [
    { rank: 1, name: "Alex Rivers", points: 1200 },
    { rank: 2, name: "Sarah Chen", points: 1180 },
    { rank: 3, name: "Michael Vance", points: 1150 },
    { rank: 4, name: "Priya Sharma", points: 1120 },
    { rank: 5, name: "David Kim", points: 1090 },
    { rank: 6, name: "Elena Rostova", points: 1060 },
    { rank: 7, name: "Omar Hassan", points: 1040 },
    { rank: 8, name: "Jessica Taylor", points: 1010 },
    { rank: 9, name: "Liam O'Connor", points: 990 },
    { rank: 10, name: "Aarav Patel", points: 970 }
];

/**
 * 2. LEADERBOARD DISPLAY LOGIC
 * Populates your existing container while preserving its parent styling.
 */
function initTop10Leaderboard() {
    // Tries to find your existing leaderboard container ID
    const leaderboardContainer = document.getElementById('leaderboard-list') 
        || document.getElementById('leaderboard')
        || document.querySelector('[data-leaderboard]');

    if (!leaderboardContainer) return;

    // Injects exactly 10 leaders into your existing container
    leaderboardContainer.innerHTML = TOP_10_LEADERS.map(user => `
        <div class="leaderboard-row flex items-center justify-between p-3 my-1 rounded-lg bg-white/5 border border-white/10">
            <div class="flex items-center gap-3">
                <span class="font-bold text-xs px-2 py-0.5 rounded ${user.rank <= 3 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white'}">
                    #${user.rank}
                </span>
                <span class="font-semibold text-xs text-white">${user.name}</span>
            </div>
            <span class="font-mono text-xs font-bold text-amber-400">${user.points} pts</span>
        </div>
    `).join('');
}

/**
 * 3. STRICT DOMAIN VALIDATION LOGIC
 * Accepts ONLY valid GitHub and LinkedIn URLs.
 */
function isValidGitHubUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.hostname === 'github.com' || url.hostname === 'www.github.com';
    } catch (_) {
        return false;
    }
}

function isValidLinkedInUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com');
    } catch (_) {
        return false;
    }
}

/**
 * Attaches validation listeners to your form inputs
 */
function initUrlValidation() {
    // Auto-detects inputs by ID, name, or attribute
    const githubInput = document.getElementById('github-url') 
        || document.querySelector('input[name="github"]') 
        || document.querySelector('input[placeholder*="github" i]');

    const linkedinInput = document.getElementById('linkedin-url') 
        || document.querySelector('input[name="linkedin"]') 
        || document.querySelector('input[placeholder*="linkedin" i]');

    const form = document.getElementById('submission-form') 
        || document.querySelector('form');

    function checkField(input, type) {
        if (!input) return true;
        const val = input.value.trim();

        if (val === '') {
            input.classList.remove('border-red-500', 'border-emerald-500');
            return false;
        }

        const valid = type === 'github' ? isValidGitHubUrl(val) : isValidLinkedInUrl(val);

        if (valid) {
            input.classList.remove('border-red-500');
            input.classList.add('border-emerald-500');
            return true;
        } else {
            input.classList.remove('border-emerald-500');
            input.classList.add('border-red-500');
            return false;
        }
    }

    if (githubInput) {
        githubInput.addEventListener('input', () => checkField(githubInput, 'github'));
    }

    if (linkedinInput) {
        linkedinInput.addEventListener('input', () => checkField(linkedinInput, 'linkedin'));
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            const ghValid = githubInput ? checkField(githubInput, 'github') : true;
            const liValid = linkedinInput ? checkField(linkedinInput, 'linkedin') : true;

            if (!ghValid || !liValid) {
                e.preventDefault();
                alert('Submission rejected: GitHub input must be a github.com link and LinkedIn input must be a linkedin.com link.');
            } else {
                e.preventDefault();
                alert('Proof Submitted Successfully!');
                form.reset();
                if (githubInput) githubInput.classList.remove('border-emerald-500');
                if (linkedinInput) linkedinInput.classList.remove('border-emerald-500');
            }
        });
    }
}
