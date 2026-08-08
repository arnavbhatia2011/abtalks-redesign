/**
 * Dashboard Application State
 */
const DASHBOARD_STATE = {
    user: {
        id: "usr_01",
        name: "You (Student)",
        currentDay: 12,
        streak: 12,
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
    },
    activePane: "today", // "today" | "submissions" | "ranks"
    activeLeaderboardScope: "city", // "city" | "state" | "country"
    
    // Day 1 to 12 Historical Submissions Log
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

    // Scoped Regional Mock Leaderboard Data
    leaderboards: {
        city: [
            { rank: 1, name: "Rohan Mehta", streak: 12, xp: 1350 },
            { rank: 2, name: "You (Student)", streak: 12, xp: 1240, isUser: true },
            { rank: 3, name: "Priya Sharma", streak: 11, xp: 1180 },
            { rank: 4, name: "Karan Verma", streak: 10, xp: 1050 }
        ],
        state: [
            { rank: 1, name: "Aditya Patil", streak: 12, xp: 1420 },
            { rank: 2, name: "Rohan Mehta", streak: 12, xp: 1350 },
            { rank: 5, name: "You (Student)", streak: 12, xp: 1240, isUser: true },
            { rank: 6, name: "Sneha Kulkarni", streak: 11, xp: 1210 }
        ],
        country: [
            { rank: 1, name: "Alex Chen", streak: 60, xp: 1850 },
            { rank: 2, name: "Aarav Gupta", streak: 45, xp: 1690 },
            { rank: 12, name: "You (Student)", streak: 12, xp: 1240, isUser: true },
            { rank: 13, name: "Vikram Malhotra", streak: 12, xp: 1220 }
        ]
    }
};

// DOM References
const paneTabs = document.querySelectorAll(".pane-tab");
const paneContents = document.querySelectorAll(".pane-content");
const submissionsLogContainer = document.getElementById("submissions-log-container");
const leaderboardScopeList = document.getElementById("leaderboard-scope-list");
const scopeFilters = document.querySelectorAll(".scope-btn");

/**
 * Tab Switching (Panes) Controller
 */
function switchPane(paneId) {
    DASHBOARD_STATE.activePane = paneId;

    paneTabs.forEach(tab => {
        if (tab.dataset.pane === paneId) {
            tab.classList.add("active", "text-primary", "bg-white/10", "font-bold");
            tab.classList.remove("text-on-surface-variant", "font-medium");
        } else {
            tab.classList.remove("active", "text-primary", "bg-white/10", "font-bold");
            tab.classList.add("text-on-surface-variant", "font-medium");
        }
    });

    paneContents.forEach(pane => {
        if (pane.id === `pane-${paneId}`) {
            pane.classList.remove("hidden");
        } else {
            pane.classList.add("hidden");
        }
    });

    if (paneId === "submissions") renderSubmissionsLog();
    if (paneId === "ranks") renderScopedLeaderboard();
}

/**
 * Render Day 1 to Day 12 Submissions History Log
 */
function renderSubmissionsLog() {
    if (!submissionsLogContainer) return;

    submissionsLogContainer.innerHTML = DASHBOARD_STATE.submissionsLog.map(item => `
        <div class="glass-card p-3 rounded-xl flex flex-col gap-1.5 border border-white/5">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-1.5">
                    <span class="font-code-sm text-xs font-bold text-primary">DAY ${item.day}</span>
                    <span class="material-symbols-outlined text-emerald-400 text-xs">check_circle</span>
                </div>
                <span class="text-[9px] text-on-surface-variant font-code-sm">${item.submittedAt}</span>
            </div>

            <h3 class="text-xs font-bold text-white leading-tight">${item.title}</h3>

            <div class="flex gap-3 text-[10px] pt-1 border-t border-white/5 text-on-surface-variant">
                <a href="https://${item.githubUrl}" target="_blank" class="flex items-center gap-1 hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-xs">code</span> GitHub
                </a>
                <a href="https://${item.linkedinUrl}" target="_blank" class="flex items-center gap-1 hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-xs">share</span> LinkedIn
                </a>
            </div>
        </div>
    `).join("");
}

/**
 * Render Scoped Regional Leaderboards (City, State, Country)
 */
function renderScopedLeaderboard() {
    if (!leaderboardScopeList) return;

    const data = DASHBOARD_STATE.leaderboards[DASHBOARD_STATE.activeLeaderboardScope] || [];

    leaderboardScopeList.innerHTML = data.map(item => {
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
 * Attach Event Listeners
 */
function initDashboard() {
    // Pane Switcher Listeners
    paneTabs.forEach(tab => {
        tab.addEventListener("click", () => switchPane(tab.dataset.pane));
    });

    // Leaderboard Scope Filter Listeners
    scopeFilters.forEach(btn => {
        btn.addEventListener("click", () => {
            scopeFilters.forEach(b => {
                b.classList.remove("active", "bg-secondary", "text-surface", "font-bold");
                b.classList.add("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            });

            btn.classList.remove("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            btn.classList.add("active", "bg-secondary", "text-surface", "font-bold");

            DASHBOARD_STATE.activeLeaderboardScope = btn.dataset.scope;
            renderScopedLeaderboard();
        });
    });

    // Initial Load
    renderSubmissionsLog();
}

document.addEventListener("DOMContentLoaded", initDashboard);
