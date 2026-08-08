/**
 * Application State
 */
const DASHBOARD_STATE = {
    currentPane: "pane-today",
    leaderboardScope: "city",
    historySearchQuery: "",
    leaderboardSearchQuery: "",

    submissionsLog: [
        { day: 12, title: "Binary Trees & DFS Traversal", submittedAt: "Today, 10:14 AM", githubUrl: "github.com/student/day12", linkedinUrl: "linkedin.com/posts/day12" },
        { day: 11, title: "API Design & Webhooks Handler", submittedAt: "Yesterday", githubUrl: "github.com/student/day11", linkedinUrl: "linkedin.com/posts/day11" },
        { day: 10, title: "Database Indexing & Querying", submittedAt: "2 days ago", githubUrl: "github.com/student/day10", linkedinUrl: "linkedin.com/posts/day10" },
        { day: 9,  title: "REST Architecture Patterns", submittedAt: "3 days ago", githubUrl: "github.com/student/day9",  linkedinUrl: "linkedin.com/posts/day9" },
        { day: 8,  title: "Authentication & JWT Tokens", submittedAt: "4 days ago", githubUrl: "github.com/student/day8",  linkedinUrl: "linkedin.com/posts/day8" },
        { day: 7,  title: "State Management & React Context", submittedAt: "5 days ago", githubUrl: "github.com/student/day7", linkedinUrl: "linkedin.com/posts/day7" },
        { day: 6,  title: "DOM Manipulation & Async JS", submittedAt: "6 days ago", githubUrl: "github.com/student/day6",  linkedinUrl: "linkedin.com/posts/day6" },
        { day: 5,  title: "Tailwind CSS Grid & Flexbox", submittedAt: "7 days ago", githubUrl: "github.com/student/day5",  linkedinUrl: "linkedin.com/posts/day5" },
        { day: 4,  title: "JavaScript ES6+ Fundamentals", submittedAt: "8 days ago", githubUrl: "github.com/student/day4", linkedinUrl: "linkedin.com/posts/day4" },
        { day: 3,  title: "HTML5 Semantic Structure", submittedAt: "9 days ago", githubUrl: "github.com/student/day3",     linkedinUrl: "linkedin.com/posts/day3" },
        { day: 2,  title: "Git & GitHub Branching Workflow", submittedAt: "10 days ago", githubUrl: "github.com/student/day2", linkedinUrl: "linkedin.com/posts/day2" },
        { day: 1,  title: "Development Environment Setup", submittedAt: "11 days ago", githubUrl: "github.com/student/day1", linkedinUrl: "linkedin.com/posts/day1" }
    ],

    leaderboards: {
        city: [
            { rank: 1, name: "Rohan Mehta", streak: 12, xp: 1350 },
            { rank: 2, name: "You (Student)", streak: 12, xp: 1240, isUser: true },
            { rank: 3, name: "Priya Sharma", streak: 11, xp: 1180 },
            { rank: 4, name: "Karan Verma", streak: 10, xp: 1050 },
            { rank: 5, name: "Ananya Roy", streak: 9, xp: 980 }
        ],
        state: [
            { rank: 1, name: "Aditya Patil", streak: 12, xp: 1420 },
            { rank: 2, name: "Rohan Mehta", streak: 12, xp: 1350 },
            { rank: 3, name: "Sneha Kulkarni", streak: 12, xp: 1310 },
            { rank: 4, name: "Tanmay Deshmukh", streak: 11, xp: 1280 },
            { rank: 5, name: "You (Student)", streak: 12, xp: 1240, isUser: true }
        ],
        country: [
            { rank: 1, name: "Alex Chen", streak: 60, xp: 1850 },
            { rank: 2, name: "Aarav Gupta", streak: 45, xp: 1690 },
            { rank: 3, name: "Devon Vance", streak: 38, xp: 1520 },
            { rank: 12, name: "You (Student)", streak: 12, xp: 1240, isUser: true },
            { rank: 13, name: "Vikram Malhotra", streak: 12, xp: 1220 }
        ]
    }
};

/**
 * Toast Helper
 */
function showToast(message, icon = "info") {
    const toastBanner = document.getElementById("toast-banner");
    const toastMsg = document.getElementById("toast-msg");
    const toastIcon = document.getElementById("toast-icon");
    if (!toastBanner || !toastMsg) return;

    toastMsg.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;

    toastBanner.classList.remove("-translate-y-16", "opacity-0", "pointer-events-none");
    toastBanner.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
        toastBanner.classList.remove("translate-y-0", "opacity-100");
        toastBanner.classList.add("-translate-y-16", "opacity-0", "pointer-events-none");
    }, 2500);
}

/**
 * MAIN SWITCH PANE FUNCTION (Attached globally to window)
 */
window.switchPane = function(targetPaneId) {
    DASHBOARD_STATE.currentPane = targetPaneId;

    // 1. Hide all panes
    const panes = document.querySelectorAll(".dashboard-pane");
    panes.forEach(pane => {
        pane.classList.remove("pane-visible");
        pane.classList.add("pane-hidden");
    });

    // 2. Show selected pane
    const targetPane = document.getElementById(targetPaneId);
    if (targetPane) {
        targetPane.classList.remove("pane-hidden");
        targetPane.classList.add("pane-visible");
    }

    // 3. Highlight Top Nav Button
    const tabButtons = document.querySelectorAll(".pane-tab-btn");
    tabButtons.forEach(btn => {
        btn.classList.remove("text-primary", "bg-white/10", "font-bold");
        btn.classList.add("text-on-surface-variant", "font-medium");
    });

    if (targetPaneId === "pane-today") {
        const activeBtn = document.getElementById("btn-tab-today");
        if (activeBtn) {
            activeBtn.classList.add("text-primary", "bg-white/10", "font-bold");
            activeBtn.classList.remove("text-on-surface-variant", "font-medium");
        }
    } else if (targetPaneId === "pane-submissions") {
        const activeBtn = document.getElementById("btn-tab-submissions");
        if (activeBtn) {
            activeBtn.classList.add("text-primary", "bg-white/10", "font-bold");
            activeBtn.classList.remove("text-on-surface-variant", "font-medium");
        }
        renderSubmissionsLog();
    } else if (targetPaneId === "pane-ranks") {
        const activeBtn = document.getElementById("btn-tab-ranks");
        if (activeBtn) {
            activeBtn.classList.add("text-primary", "bg-white/10", "font-bold");
            activeBtn.classList.remove("text-on-surface-variant", "font-medium");
        }
        renderLeaderboard();
    }
};

/**
 * Filter Scope Switcher
 */
window.changeLeaderboardScope = function(scope, clickedBtn) {
    DASHBOARD_STATE.leaderboardScope = scope;

    const buttons = document.querySelectorAll(".pane-scope-btn");
    buttons.forEach(b => {
        b.classList.remove("active", "bg-secondary", "text-surface", "font-bold");
        b.classList.add("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
    });

    if (clickedBtn) {
        clickedBtn.classList.remove("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
        clickedBtn.classList.add("active", "bg-secondary", "text-surface", "font-bold");
    }

    renderLeaderboard();
};

/**
 * Render Submissions History
 */
function renderSubmissionsLog() {
    const container = document.getElementById("submissions-log-container");
    const countBadge = document.getElementById("submissions-count-badge");
    if (!container) return;

    const filtered = DASHBOARD_STATE.submissionsLog.filter(item => 
        item.title.toLowerCase().includes(DASHBOARD_STATE.historySearchQuery.toLowerCase()) ||
        `day ${item.day}`.includes(DASHBOARD_STATE.historySearchQuery.toLowerCase())
    );

    if (countBadge) countBadge.textContent = `${filtered.length} / 12 Verified`;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="glass-card p-6 rounded-xl text-center text-on-surface-variant text-xs">No submission history found.</div>`;
        return;
    }

    container.innerHTML = filtered.map(item => `
        <div class="glass-card p-3 rounded-xl flex flex-col gap-1.5 border border-white/5">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-1.5">
                    <span class="font-code-sm text-xs font-bold text-primary">DAY ${item.day}</span>
                    <span class="material-symbols-outlined text-emerald-400 text-xs">check_circle</span>
                </div>
                <span class="text-[9px] text-on-surface-variant font-code-sm">${item.submittedAt}</span>
            </div>
            <h3 class="text-xs font-bold text-white leading-tight">${item.title}</h3>
            <div class="flex gap-3 text-[10px] pt-1.5 border-t border-white/5 text-on-surface-variant">
                <a href="https://${item.githubUrl}" target="_blank" rel="noopener" class="flex items-center gap-1 hover:text-primary">
                    <span class="material-symbols-outlined text-xs">code</span> GitHub
                </a>
                <a href="https://${item.linkedinUrl}" target="_blank" rel="noopener" class="flex items-center gap-1 hover:text-primary">
                    <span class="material-symbols-outlined text-xs">share</span> LinkedIn
                </a>
            </div>
        </div>
    `).join("");
}

/**
 * Render Leaderboard Pane
 */
function renderLeaderboard() {
    const container = document.getElementById("pane-leaderboard-list");
    if (!container) return;

    const data = DASHBOARD_STATE.leaderboards[DASHBOARD_STATE.leaderboardScope] || [];
    const filtered = data.filter(item => item.name.toLowerCase().includes(DASHBOARD_STATE.leaderboardSearchQuery.toLowerCase()));

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-6 text-xs text-on-surface-variant">No builders found.</div>`;
        return;
    }

    container.innerHTML = filtered.map(item => {
        let badge = `#${item.rank}`;
        if (item.rank === 1) badge = "🏆";
        if (item.rank === 2) badge = "🥈";
        if (item.rank === 3) badge = "🥉";

        return `
            <div class="flex items-center justify-between p-2.5 rounded-xl ${item.isUser ? 'bg-primary/20 border border-primary/40' : 'bg-surface-container-high/30 border border-white/5'}">
                <div class="flex items-center gap-2.5">
                    <span class="font-bold text-xs w-5 text-center ${item.rank <= 3 ? 'text-base' : 'text-on-surface-variant font-code-sm'}">${badge}</span>
                    <span class="text-xs font-semibold ${item.isUser ? 'text-primary font-bold' : 'text-white'}">${item.name}</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-code-sm">
                    <span class="text-on-surface-variant">🔥 ${item.streak}d</span>
                    <span class="text-secondary font-bold">${item.xp} XP</span>
                </div>
            </div>
        `;
    }).join("");
}

/**
 * Setup input listeners
 */
document.addEventListener("DOMContentLoaded", () => {
    const historySearchInput = document.getElementById("history-search-input");
    if (historySearchInput) {
        historySearchInput.addEventListener("input", (e) => {
            DASHBOARD_STATE.historySearchQuery = e.target.value.trim();
            renderSubmissionsLog();
        });
    }

    const paneLeaderboardSearch = document.getElementById("pane-leaderboard-search");
    if (paneLeaderboardSearch) {
        paneLeaderboardSearch.addEventListener("input", (e) => {
            DASHBOARD_STATE.leaderboardSearchQuery = e.target.value.trim();
            renderLeaderboard();
        });
    }

    // Default load pane
    window.switchPane("pane-today");
});
