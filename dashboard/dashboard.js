/**
 * ABTalks Student Dashboard Engine (dash.js)
 * Controls Top 10 Leaderboard rendering & strict GitHub/LinkedIn URL verification.
 */

document.addEventListener('DOMContentLoaded', () => {
    renderTop10Leaderboard();
    bindUrlValidation();
});

// Guaranteed dataset of Top 10 Leaders
const top10Leaders = [
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
 * Renders all 10 items into the leaderboard-list container
 */
function renderTop10Leaderboard() {
    const container = document.getElementById('leaderboard-list');
    if (!container) return;

    container.innerHTML = top10Leaders.map(leader => {
        const isTop3 = leader.rank <= 3;
        
        let rankBadgeStyle = 'bg-white/5 text-on-surface-variant';
        let rowStyle = 'bg-surface-variant/50 border-white/5';

        if (leader.rank === 1) {
            rankBadgeStyle = 'bg-secondary text-on-primary';
            rowStyle = 'bg-secondary/10 border-secondary/30';
        } else if (leader.rank === 2) {
            rankBadgeStyle = 'bg-white/20 text-white';
            rowStyle = 'bg-white/5 border-white/10';
        } else if (leader.rank === 3) {
            rankBadgeStyle = 'bg-white/10 text-white';
            rowStyle = 'bg-white/5 border-white/10';
        }

        return `
            <div class="flex items-center justify-between p-2 rounded-xl ${rowStyle} border transition-all">
                <div class="flex items-center gap-2.5">
                    <span class="w-5 h-5 rounded-full ${rankBadgeStyle} font-bold font-code-sm text-[10px] flex items-center justify-center">${leader.rank}</span>
                    <span class="text-xs font-bold text-white">${leader.name}</span>
                </div>
                <span class="text-xs font-code-sm ${isTop3 ? 'text-secondary font-bold' : 'text-on-surface-variant'}">${leader.points} pts</span>
            </div>
        `;
    }).join('');
}

/**
 * Domain-checking helpers
 */
function isGitHubUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com';
    } catch (_) {
        return false;
    }
}

function isLinkedInUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname === 'linkedin.com' || parsed.hostname.endsWith('.linkedin.com');
    } catch (_) {
        return false;
    }
}

/**
 * Event binding and visual validation handler
 */
function bindUrlValidation() {
    const githubInput = document.getElementById('github-input');
    const linkedinInput = document.getElementById('linkedin-input');
    const submitForm = document.getElementById('dashboard-submit-form');

    if (githubInput) {
        githubInput.addEventListener('input', () => validateInput(githubInput, 'github'));
    }

    if (linkedinInput) {
        linkedinInput.addEventListener('input', () => validateInput(linkedinInput, 'linkedin'));
    }

    if (submitForm) {
        submitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ghValid = validateInput(githubInput, 'github');
            const liValid = validateInput(linkedinInput, 'linkedin');

            if (ghValid && liValid) {
                alert('Proof submitted successfully! GitHub & LinkedIn URLs verified.');
                submitForm.reset();
                validateInput(githubInput, 'github');
                validateInput(linkedinInput, 'linkedin');
            } else {
                alert('Submission blocked. Ensure your links are valid GitHub and LinkedIn URLs.');
            }
        });
    }
}

function validateInput(inputEl, fieldType) {
    if (!inputEl) return false;
    
    const value = inputEl.value.trim();
    const errorEl = document.getElementById(`${fieldType}-error-msg`);
    const iconEl = document.getElementById(`${fieldType}-status-icon`);

    if (value === '') {
        if (errorEl) errorEl.classList.add('hidden');
        inputEl.classList.remove('border-red-500', 'border-emerald-500');
        if (iconEl) {
            iconEl.className = 'material-symbols-outlined text-sm absolute right-2 text-white/30';
            iconEl.textContent = fieldType === 'github' ? 'code' : 'share';
        }
        return false;
    }

    const isValid = fieldType === 'github' ? isGitHubUrl(value) : isLinkedInUrl(value);

    if (isValid) {
        if (errorEl) errorEl.classList.add('hidden');
        inputEl.classList.remove('border-red-500');
        inputEl.classList.add('border-emerald-500');
        if (iconEl) {
            iconEl.className = 'material-symbols-outlined text-sm absolute right-2 text-emerald-400';
            iconEl.textContent = 'check_circle';
        }
        return true;
    } else {
        if (errorEl) errorEl.classList.remove('hidden');
        inputEl.classList.remove('border-emerald-500');
        inputEl.classList.add('border-red-500');
        if (iconEl) {
            iconEl.className = 'material-symbols-outlined text-sm absolute right-2 text-red-400';
            iconEl.textContent = 'cancel';
        }
        return false;
    }
}
