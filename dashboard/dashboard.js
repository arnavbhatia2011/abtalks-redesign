// Countdown Timer Functionality
function updateISTTimer() {
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(utcMs + istOffsetMs);

    const nextMidnightIST = new Date(istTime);
    nextMidnightIST.setHours(24, 0, 0, 0);

    const diff = nextMidnightIST - istTime;

    if (diff <= 0) {
        document.getElementById('ist-countdown').innerText = "00h 00m 00s";
        return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    document.getElementById('ist-countdown').innerText = `${h}h ${m}m ${s}s`;
}

updateISTTimer();
setInterval(updateISTTimer, 1000);

// Dynamic Notification Helper
let bannerTimeout;
function showNotification(type, title, message) {
    const banner = document.getElementById('notification-banner');
    const card = document.getElementById('notification-card');
    const icon = document.getElementById('notification-icon');
    const titleEl = document.getElementById('notification-title');
    const msgEl = document.getElementById('notification-message');

    clearTimeout(bannerTimeout);

    if (type === 'success') {
        card.className = "p-4 rounded-xl border flex items-start gap-3 shadow-2xl backdrop-blur-xl bg-emerald-950/80 border-emerald-500/30 text-emerald-200";
        icon.innerText = "pending_actions";
    } else {
        card.className = "p-4 rounded-xl border flex items-start gap-3 shadow-2xl backdrop-blur-xl bg-rose-950/80 border-rose-500/30 text-rose-200";
        icon.innerText = "error";
    }

    titleEl.innerText = title;
    msgEl.innerText = message;

    banner.classList.remove('-translate-y-20', 'opacity-0', 'pointer-events-none');
    banner.classList.add('translate-y-0', 'opacity-100');

    bannerTimeout = setTimeout(() => {
        banner.classList.remove('translate-y-0', 'opacity-100');
        banner.classList.add('-translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 5000);
}

// Submission Form Handling & Domain Validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submission-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const githubVal = document.getElementById('github-url').value.trim();
        const linkedinVal = document.getElementById('linkedin-url').value.trim();

        try {
            const githubUrl = new URL(githubVal);
            const isGithub = githubUrl.hostname === 'github.com' || githubUrl.hostname.endsWith('.github.com');
            
            if (!isGithub) {
                showNotification('error', 'Invalid Link', 'Please enter a valid GitHub URL (e.g., https://github.com/...)');
                return;
            }
        } catch (err) {
            showNotification('error', 'Invalid Link', 'Please enter a valid GitHub URL.');
            return;
        }

        try {
            const linkedinUrl = new URL(linkedinVal);
            const isLinkedin = linkedinUrl.hostname === 'linkedin.com' || linkedinUrl.hostname.endsWith('.linkedin.com');
            
            if (!isLinkedin) {
                showNotification('error', 'Invalid Link', 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/...)');
                return;
            }
        } catch (err) {
            showNotification('error', 'Invalid Link', 'Please enter a valid LinkedIn URL.');
            return;
        }

        // On Successful Validation
        showNotification(
            'success', 
            'Under Review', 
            'Your response has been sent to the admin and is currently under review. You will receive your points soon!'
        );

        this.reset();
    });
});
