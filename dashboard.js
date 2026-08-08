/**
 * Dashboard Application State
 */
const DASHBOARD_STATE = {
    user: {
        id: "usr_01",
        name: "You (Student)",
        currentDay: 12,
        streak: 12,
        xp: 1240
    },
    activePane: "today", 
    paneLeaderboardScope: "city", 
    modalLeaderboardScope: "city",
    historySearchQuery: "",
    paneSearchQuery: "",
    modalSearchQuery: "",
    
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
 * Toast Notification Function
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
 * Switch Active View Pane
 */
function switchPane(paneId) {
    DASHBOARD_STATE.activePane = paneId;

    // Update Tab Styles
    document.querySelectorAll(".pane-tab").forEach(tab => {
        if (tab.dataset.pane === paneId) {
            tab.classList.add("active", "text-primary", "bg-white/10", "font-bold");
            tab.classList.remove("text-on-surface-variant", "font-medium");
        } else {
            tab.classList.remove("active", "text-primary", "bg-white/10", "font-bold");
            tab.classList.add("text-on-surface-variant", "font-medium");
        }
    });

    // Toggle View Content Panes
    document.querySelectorAll(".pane-content").forEach(pane => {
        if (pane.id === `pane-${paneId}`) {
            pane.classList.remove("pane-hidden");
            pane.classList.add("pane-visible");
        } else {
            pane.classList.remove("pane-visible");
            pane.classList.add("pane-hidden");
        }
    });

    if (paneId === "submissions") renderSubmissionsLog();
    if (paneId === "ranks") renderPaneLeaderboard();
}

/**
 * Render Day 1-12 Submissions Log
 */
function renderSubmissionsLog() {
    const submissionsLogContainer = document.getElementById("submissions-log-container");
    const submissionsCountBadge = document.getElementById("submissions-count-badge");
    if (!submissionsLogContainer) return;

    const filtered = DASHBOARD_STATE.submissionsLog.filter(item => 
        item.title.toLowerCase().includes(DASHBOARD_STATE.historySearchQuery.toLowerCase()) ||
        `day ${item.day}`.includes(DASHBOARD_STATE.historySearchQuery.toLowerCase())
    );

    if (submissionsCountBadge) {
        submissionsCountBadge.textContent = `${filtered.length} / 12 Verified`;
    }

    if (filtered.length === 0) {
        submissionsLogContainer.innerHTML = `
            <div class="glass-card p-6 rounded-xl text-center text-on-surface-variant text-xs">
                No matching submission history found.
            </div>
        `;
        return;
    }

    submissionsLogContainer.innerHTML = filtered.map(item => `
        <div class="glass-card p-3 rounded-xl flex flex-col gap-1.5 border border-white/5 active:scale-[0.99] transition-transform">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-1.5">
                    <span class="font-code-sm text-xs font-bold text-primary">DAY ${item.day}</span>
                    <span class="material-symbols-outlined text-emerald-400 text-xs">check_circle</span>
                </div>
                <span class="text-[9px] text-on-surface-variant font-code-sm">${item.submittedAt}</span>
            </div>

            <h3 class="text-xs font-bold text-white leading-tight">${item.title}</h3>

            <div class="flex gap-3 text-[10px] pt-1.5 border-t border-white/5 text-on-surface-variant">
                <a href="https://${item.githubUrl}" target="_blank" rel="noopener" class="flex items-center gap-1 hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-xs">code</span> GitHub
                </a>
                <a href="https://${item.linkedinUrl}" target="_blank" rel="noopener" class="flex items-center gap-1 hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-xs">share</span> LinkedIn
                </a>
            </div>
        </div>
    `).join("");
}

/**
 * Leaderboard HTML Builder
 */
function buildLeaderboardRowsHtml(data, searchQuery) {
    const filtered = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
        return `<div class="text-center py-6 text-xs text-on-surface-variant">No builders found.</div>`;
    }

    return filtered.map(item => {
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

function renderPaneLeaderboard() {
    const paneLeaderboardList = document.getElementById("pane-leaderboard-list");
    if (!paneLeaderboardList) return;
    const data = DASHBOARD_STATE.leaderboards[DASHBOARD_STATE.paneLeaderboardScope] || [];
    paneLeaderboardList.innerHTML = buildLeaderboardRowsHtml(data, DASHBOARD_STATE.paneSearchQuery);
}

function renderModalLeaderboard() {
    const modalLeaderboardList = document.getElementById("modal-leaderboard-list");
    if (!modalLeaderboardList) return;
    const data = DASHBOARD_STATE.leaderboards[DASHBOARD_STATE.modalLeaderboardScope] || [];
    modalLeaderboardList.innerHTML = buildLeaderboardRowsHtml(data, DASHBOARD_STATE.modalSearchQuery);
}

function openModal() {
    const leaderboardModal = document.getElementById("leaderboard-modal");
    const modalCard = document.getElementById("modal-card");
    if (!leaderboardModal || !modalCard) return;

    renderModalLeaderboard();
    leaderboardModal.classList.remove("hidden");
    setTimeout(() => {
        leaderboardModal.classList.remove("opacity-0");
        modalCard.classList.remove("scale-95");
        modalCard.classList.add("scale-100");
    }, 10);
}

function closeModal() {
    const leaderboardModal = document.getElementById("leaderboard-modal");
    const modalCard = document.getElementById("modal-card");
    if (!leaderboardModal || !modalCard) return;

    leaderboardModal.classList.add("opacity-0");
    modalCard.classList.remove("scale-100");
    modalCard.classList.add("scale-95");
    setTimeout(() => {
        leaderboardModal.classList.add("hidden");
    }, 200);
}

/**
 * Initialize Event Handlers
 */
function initDashboard() {
    // 1. Navigation Brand Header Button -> Return to Today Pane
    const brandBtn = document.getElementById("nav-dashboard-brand");
    if (brandBtn) {
        brandBtn.addEventListener("click", () => {
            switchPane("today");
            showToast("Returned to Dashboard", "dashboard");
        });
    }

    // 2. Tab Navigation Click Handlers
    document.querySelectorAll(".pane-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            switchPane(tab.dataset.pane);
        });
    });

    // 3. Search Bar for History
    const historySearchInput = document.getElementById("history-search-input");
    if (historySearchInput) {
        historySearchInput.addEventListener("input", (e) => {
            DASHBOARD_STATE.historySearchQuery = e.target.value.trim();
            renderSubmissionsLog();
        });
    }

    // 4. Pane Scope Filter Buttons (City / State / Country)
    document.querySelectorAll(".pane-scope-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".pane-scope-btn").forEach(b => {
                b.classList.remove("active", "bg-secondary", "text-surface", "font-bold");
                b.classList.add("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            });

            btn.classList.remove("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            btn.classList.add("active", "bg-secondary", "text-surface", "font-bold");

            DASHBOARD_STATE.paneLeaderboardScope = btn.dataset.scope;
            renderPaneLeaderboard();
        });
    });

    // 5. Pane Leaderboard Search Bar
    const paneLeaderboardSearch = document.getElementById("pane-leaderboard-search");
    if (paneLeaderboardSearch) {
        paneLeaderboardSearch.addEventListener("input", (e) => {
            DASHBOARD_STATE.paneSearchQuery = e.target.value.trim();
            renderPaneLeaderboard();
        });
    }

    // 6. Modal Open/Close Controls
    const openModalRankBtn = document.getElementById("open-modal-rank-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const leaderboardModal = document.getElementById("leaderboard-modal");

    if (openModalRankBtn) openModalRankBtn.addEventListener("click", openModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    document.querySelectorAll(".modal-scope-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".modal-scope-btn").forEach(b => {
                b.classList.remove("active", "bg-secondary", "text-surface", "font-bold");
                b.classList.add("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            });

            btn.classList.remove("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            btn.classList.add("active", "bg-secondary", "text-surface", "font-bold");

            DASHBOARD_STATE.modalLeaderboardScope = btn.dataset.scope;
            renderModalLeaderboard();
        });
    });

    const modalLeaderboardSearch = document.getElementById("modal-leaderboard-search");
    if (modalLeaderboardSearch) {
        modalLeaderboardSearch.addEventListener("input", (e) => {
            DASHBOARD_STATE.modalSearchQuery = e.target.value.trim();
            renderModalLeaderboard();
        });
    }

    if (leaderboardModal) {
        leaderboardModal.addEventListener("click", (e) => {
            if (e.target === leaderboardModal) closeModal();
        });
    }

    // 7. Quick Stat Action Cards
    const day13LockedBtn = document.getElementById("day13-locked-btn");
    const statProofBtn = document.getElementById("stat-proof-btn");
    const streakBadgeBtn = document.getElementById("streak-badge-btn");
    const userProfileBtn = document.getElementById("user-profile-btn");

    if (day13LockedBtn) {
        day13LockedBtn.addEventListener("click", () => showToast("Day 13 unlocks tomorrow at 00:00 UTC!", "lock"));
    }
    if (statProofBtn) {
        statProofBtn.addEventListener("click", () => {
            switchPane("submissions");
            showToast("Switched to History Log", "history");
        });
    }
    if (streakBadgeBtn) {
        streakBadgeBtn.addEventListener("click", () => showToast("🔥 12-Day Streak Active!", "local_fire_department"));
    }
    if (userProfileBtn) {
        userProfileBtn.addEventListener("click", () => showToast("Logged in as Student (Day 12)", "account_circle"));
    }

    // Initial Active View Load
    switchPane("today");
}

// Execute listener setup once DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDashboard);
} else {
    initDashboard();
}
