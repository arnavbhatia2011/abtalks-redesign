/**
 * ABTalks Dashboard Controller (dash.js)
 * Plugs directly into your existing UI.
 */

document.addEventListener('DOMContentLoaded', () => {
    renderTop10Leaders();
    attachStrictUrlValidation();
});

// Guaranteed Top 10 Participants
const top10Data = [
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
 * Renders all 10 participants into your leaderboard element.
 */
function renderTop10Leaders() {
    // Looks for your existing leaderboard wrapper ID
    const container = document.getElementById('leaderboard-list') || document.getElementById('leaderboard');
    if (!container) return;

    container.innerHTML = top10Data.map(user => `
        <div class="leaderboard-item flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 mb-2">
            <div class="flex items-center gap-3">
                <span class="rank-badge w-6 h-6 rounded-full ${user.rank <= 3 ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-white'} text-xs flex items-center justify-center">
                    ${user.rank}
                </span>
                <span class="user-name text-xs font-semibold text-white">${user.name}</span>
            </div>
            <span class="user-points text-xs font-mono font-bold text-amber-400">${user.points} pts</span>
        </div>
    `).join('');
}

/**
 * Strict URL Validation Helpers
 */
function isStrictGitHubUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com';
    } catch (_) {
        return false;
    }
}

function isStrictLinkedInUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname === 'linkedin.com' || parsed.hostname.endsWith('.linkedin.com');
    } catch (_) {
        return false;
    }
}

/**
 * Binds strict validation to your form & link input fields
 */
function attachStrictUrlValidation() {
    // Selects by ID or generic fallback selectors
    const ghInput = document.getElementById('github-url') || document.querySelector('input[name="github"]') || document.querySelector('input[placeholder*="github"]');
    const liInput = document.getElementById('linkedin-url') || document.querySelector('input[name="linkedin"]') || document.querySelector('input[placeholder*="linkedin"]');
    const form = document.getElementById('submission-form') || document.querySelector('form');

    function validateField(input, type) {
        if (!input) return false;
        const val = input.value.trim();
        
        if (val === '') {
            input.classList.remove('border-red-500', 'border-emerald-500');
            return false;
        }

        const isValid = type === 'github' ? isStrictGitHubUrl(val) : isStrictLinkedInUrl(val);

        if (isValid) {
            input.classList.remove('border-red-500');
            input.classList.add('border-emerald-500');
            return true;
        } else {
            input.classList.remove('border-emerald-500');
            input.classList.add('border-red-500');
            return false;
        }
    }

    if (ghInput) {
        ghInput.addEventListener('input', () => validateField(ghInput, 'github'));
    }

    if (liInput) {
        liInput.addEventListener('input', () => validateField(liInput, 'linkedin'));
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            const ghValid = ghInput ? validateField(ghInput, 'github') : true;
            const liValid = liInput ? validateField(liInput, 'linkedin') : true;

            if (!ghValid || !liValid) {
                e.preventDefault();
                alert('Invalid URL! GitHub inputs must be a github.com link and LinkedIn inputs must be a linkedin.com link.');
            }
        });
    }
}
