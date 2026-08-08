// Dashboard State Data
const DASHBOARD_DATA = {
    user: {
        rank: 12,
        name: "You (Student)",
        streak: 12,
        xp: 1240
    },
    tasks: [
        {
            day: 12,
            route: "/day12",
            title: "Data Structures: Binary Trees & DFS",
            description: "Implement Depth-First Search traversal algorithm and publish solution logic on LinkedIn.",
            isToday: true,
            status: "Available"
        },
        {
            day: 11,
            route: "/day11",
            title: "API Design & Webhooks",
            description: "Build a custom Webhook listener using Express.js and document edge cases.",
            isToday: false,
            status: "Completed"
        }
    ],
    leaderboard: [
        { rank: 1, name: "Alex Chen", streak: 60, xp: 1850 },
        { rank: 2, name: "Sara Connor", streak: 58, xp: 1790 },
        { rank: 3, name: "Devon Vance", streak: 55, xp: 1720 },
        { rank: 12, name: "You (Student)", streak: 12, xp: 1240, isUser: true },
        { rank: 13, name: "Marcus Brody", streak: 11, xp: 1190 }
    ]
};

// DOM References
const openRankBtn = document.getElementById("open-rank-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const leaderboardModal = document.getElementById("leaderboard-modal");
const tasksContainer = document.getElementById("tasks-container");
const leaderboardList = document.getElementById("leaderboard-list");

// Render Tasks with `/day12` Routing
function renderDashboardTasks() {
    if (!tasksContainer) return;

    tasksContainer.innerHTML = DASHBOARD_DATA.tasks.map(task => `
        <a href="${task.route}" class="glass-card p-3.5 rounded-xl hover:border-primary/60 transition-all group relative overflow-hidden block ${!task.isToday ? 'opacity-85' : ''}">
            ${task.isToday ? `
                <div class="absolute top-0 right-0 bg-primary/20 text-primary font-code-sm text-[9px] px-2 py-0.5 rounded-bl-lg border-b border-l border-primary/30">
                    TODAY
                </div>
            ` : ''}
            <div class="flex items-center gap-2 mb-1.5">
                <span class="font-code-sm text-xs text-primary font-bold">DAY ${task.day}</span>
                <span class="text-[10px] text-emerald-400 font-medium">● ${task.status}</span>
            </div>
            <h3 class="text-xs font-bold text-white mb-1 group-hover:text-primary transition-colors">${task.title}</h3>
            <p class="text-[11px] text-on-surface-variant mb-2.5 line-clamp-2">${task.description}</p>
            <div class="flex items-center justify-between text-[10px] text-on-surface-variant pt-2 border-t border-white/5">
                <div class="flex gap-2">
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">code</span> GitHub</span>
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">share</span> LinkedIn</span>
                </div>
                <span class="text-primary font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    ${task.isToday ? 'Open' : 'Review'} <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                </span>
            </div>
        </a>
    `).join("");
}

// Render Leaderboard Mock Ranks
function renderLeaderboardModal() {
    if (!leaderboardList) return;

    leaderboardList.innerHTML = DASHBOARD_DATA.leaderboard.map(item => `
        <div class="flex items-center justify-between p-2 rounded-lg ${item.isUser ? 'bg-primary/20 border border-primary/50 my-1' : 'bg-surface-container-high/20 border border-white/5'}">
            <div class="flex items-center gap-2">
                <span class="font-bold ${item.rank === 1 ? 'text-secondary' : 'text-on-surface-variant'} text-xs w-5">#${item.rank}</span>
                <span class="text-xs font-semibold ${item.isUser ? 'text-primary' : 'text-white'}">${item.name}</span>
            </div>
            <div class="flex items-center gap-2.5 text-[10px]">
                <span class="text-on-surface-variant">🔥 ${item.streak}d</span>
                <span class="text-secondary font-bold">${item.xp} XP</span>
            </div>
        </div>
    `).join("");
}

// Modal Toggle Handlers
function showRankModal() {
    leaderboardModal?.classList.remove("hidden");
}

function hideRankModal() {
    leaderboardModal?.classList.add("hidden");
}

// Event Listeners
function initDashboard() {
    renderDashboardTasks();
    renderLeaderboardModal();

    if (openRankBtn) openRankBtn.addEventListener("click", showRankModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", hideRankModal);

    if (leaderboardModal) {
        leaderboardModal.addEventListener("click", (e) => {
            if (e.target === leaderboardModal) hideRankModal();
        });
    }
}

document.addEventListener("DOMContentLoaded", initDashboard);
