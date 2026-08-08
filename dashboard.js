/**
 * Dashboard Application State
 */
const DASHBOARD_STATE = {
    user: {
        id: "usr_01",
        name: "You (Student)",
        rank: 12,
        totalCohort: 1250,
        streak: 12,
        xp: 1240,
        proofSubmitted: 24,
        proofTotal: 120
    },
    filter: "all", // "all" | "available" | "completed"
    searchQuery: "",
    tasks: [
        {
            day: 12,
            route: "/day12",
            title: "Data Structures: Binary Trees & DFS",
            description: "Implement Depth-First Search traversal algorithm and publish solution logic on LinkedIn.",
            isToday: true,
            status: "available", // "available" | "completed"
            github: true,
            linkedin: true
        },
        {
            day: 11,
            route: "/day11",
            title: "API Design & Webhooks Handler",
            description: "Build a custom Webhook listener using Express.js and document edge-case handlers.",
            isToday: false,
            status: "completed",
            github: true,
            linkedin: true
        },
        {
            day: 10,
            route: "/day10",
            title: "Database Indexing & Query Optimization",
            description: "Optimize SQL queries using B-Tree indexing and measure execution times.",
            isToday: false,
            status: "completed",
            github: true,
            linkedin: true
        }
    ],
    leaderboard: [
        { rank: 1, name: "Alex Chen", streak: 60, xp: 1850, isUser: false },
        { rank: 2, name: "Sara Connor", streak: 58, xp: 1790, isUser: false },
        { rank: 3, name: "Devon Vance", streak: 55, xp: 1720, isUser: false },
        { rank: 4, name: "Elena Rostova", streak: 48, xp: 1610, isUser: false },
        { rank: 5, name: "Liam Patel", streak: 42, xp: 1540, isUser: false },
        { rank: 12, name: "You (Student)", streak: 12, xp: 1240, isUser: true },
        { rank: 13, name: "Marcus Brody", streak: 11, xp: 1190, isUser: false },
        { rank: 14, name: "Aria Montgomery", streak: 10, xp: 1120, isUser: false }
    ]
};

// DOM References
const tasksContainer = document.getElementById("tasks-container");
const taskCountLabel = document.getElementById("task-count-label");
const taskSearchInput = document.getElementById("task-search-input");
const filterPills = document.querySelectorAll(".filter-btn");

const openRankBtn = document.getElementById("open-rank-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const leaderboardModal = document.getElementById("leaderboard-modal");
const modalCard = document.getElementById("modal-card");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardSearchInput = document.getElementById("leaderboard-search-input");

/**
 * Render Dynamic Tasks List
 */
function renderTasks() {
    if (!tasksContainer) return;

    // Filter Tasks by Search Query and Category
    const filteredTasks = DASHBOARD_STATE.tasks.filter(task => {
        const matchesCategory = 
            DASHBOARD_STATE.filter === "all" || task.status === DASHBOARD_STATE.filter;
        
        const matchesSearch = 
            task.title.toLowerCase().includes(DASHBOARD_STATE.searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(DASHBOARD_STATE.searchQuery.toLowerCase()) ||
            `day ${task.day}`.includes(DASHBOARD_STATE.searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Update Counter Label
    if (taskCountLabel) {
        taskCountLabel.textContent = `${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'}`;
    }

    // Empty Search State
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="glass-card p-6 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <span class="material-symbols-outlined text-on-surface-variant text-2xl">search_off</span>
                <p class="text-xs font-bold text-white">No tasks found</p>
                <p class="text-[10px] text-on-surface-variant">Try adjusting your search terms or filters.</p>
            </div>
        `;
        return;
    }

    // Render Cards
    tasksContainer.innerHTML = filteredTasks.map(task => {
        const isCompleted = task.status === "completed";
        
        return `
            <a href="${task.route}" class="glass-card p-3.5 rounded-xl hover:border-primary/50 active:scale-[0.99] transition-all group relative overflow-hidden block ${isCompleted ? 'opacity-85 hover:opacity-100' : ''}">
                ${task.isToday ? `
                    <div class="absolute top-0 right-0 bg-primary/20 text-primary font-code-sm text-[8px] font-bold px-2 py-0.5 rounded-bl-lg border-b border-l border-primary/30 uppercase tracking-widest">
                        TODAY
                    </div>
                ` : ''}

                <div class="flex items-center gap-2 mb-1.5">
                    <span class="font-code-sm text-xs text-primary font-extrabold">DAY ${task.day}</span>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-primary/10 text-primary border border-primary/20'}">
                        <span class="material-symbols-outlined text-[10px]">${isCompleted ? 'check_circle' : 'pending_actions'}</span>
                        ${isCompleted ? 'Completed' : 'Available'}
                    </span>
                </div>

                <h3 class="text-xs font-bold text-white mb-1 group-hover:text-primary transition-colors leading-tight">${task.title}</h3>
                <p class="text-[10px] text-on-surface-variant mb-3 line-clamp-2 leading-relaxed">${task.description}</p>

                <div class="flex items-center justify-between text-[10px] text-on-surface-variant pt-2 border-t border-white/5">
                    <div class="flex gap-2 text-[9px]">
                        <span class="flex items-center gap-0.5 ${task.github ? 'text-emerald-400 font-medium' : ''}">
                            <span class="material-symbols-outlined text-[11px]">code</span> GitHub
                        </span>
                        <span class="flex items-center gap-0.5 ${task.linkedin ? 'text-emerald-400 font-medium' : ''}">
                            <span class="material-symbols-outlined text-[11px]">share</span> LinkedIn
                        </span>
                    </div>

                    <span class="text-primary font-bold flex items-center gap-0.5 text-[10px] group-hover:translate-x-1 transition-transform">
                        ${task.isToday ? 'Open Brief' : 'Review'}
                        <span class="material-symbols-outlined text-[11px]">arrow_forward</span>
                    </span>
                </div>
            </a>
        `;
    }).join("");
}

/**
 * Render Leaderboard Rows inside Modal
 */
function renderLeaderboard(filterQuery = "") {
    if (!leaderboardList) return;

    const filteredList = DASHBOARD_STATE.leaderboard.filter(item => 
        item.name.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filteredList.length === 0) {
        leaderboardList.innerHTML = `
            <div class="text-center py-6 text-xs text-on-surface-variant">
                No matching builders found.
            </div>
        `;
        return;
    }

    leaderboardList.innerHTML = filteredList.map(item => {
        let rankBadge = `#${item.rank}`;
        if (item.rank === 1) rankBadge = "🏆";
        if (item.rank === 2) rankBadge = "🥈";
        if (item.rank === 3) rankBadge = "🥉";

        return `
            <div class="flex items-center justify-between p-2 rounded-xl transition-all ${item.isUser ? 'bg-primary/20 border border-primary/40 shadow-sm' : 'bg-surface-container-high/30 border border-white/5 hover:bg-surface-container-high/50'}">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-xs w-6 text-center ${item.rank <= 3 ? 'text-base' : 'text-on-surface-variant font-code-sm'}">${rankBadge}</span>
                    <span class="text-xs font-semibold ${item.isUser ? 'text-primary font-bold' : 'text-white'}">${item.name}</span>
                </div>

                <div class="flex items-center gap-2 text-[10px]">
                    <span class="text-on-surface-variant font-code-sm">🔥 ${item.streak}d</span>
                    <span class="text-secondary font-bold font-code-sm">${item.xp} XP</span>
                </div>
            </div>
        `;
    }).join("");
}

/**
 * Modal Open & Close Animations
 */
function openModal() {
    if (!leaderboardModal || !modalCard) return;
    renderLeaderboard();
    leaderboardModal.classList.remove("hidden");
    
    // Trigger CSS Fade & Scale animation
    setTimeout(() => {
        leaderboardModal.classList.remove("opacity-0");
        modalCard.classList.remove("scale-95");
        modalCard.classList.add("scale-100");
    }, 10);
}

function closeModal() {
    if (!leaderboardModal || !modalCard) return;
    leaderboardModal.classList.add("opacity-0");
    modalCard.classList.remove("scale-100");
    modalCard.classList.add("scale-95");

    setTimeout(() => {
        leaderboardModal.classList.add("hidden");
    }, 200);
}

/**
 * Event Listeners & Initializers
 */
function initDashboard() {
    renderTasks();

    // Task Search Listener
    if (taskSearchInput) {
        taskSearchInput.addEventListener("input", (e) => {
            DASHBOARD_STATE.searchQuery = e.target.value.trim();
            renderTasks();
        });
    }

    // Filter Pills Listener
    filterPills.forEach(btn => {
        btn.addEventListener("click", () => {
            filterPills.forEach(p => {
                p.classList.remove("active", "bg-primary", "text-on-primary", "font-bold");
                p.classList.add("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            });

            btn.classList.remove("bg-white/5", "border", "border-white/10", "text-on-surface-variant");
            btn.classList.add("active", "bg-primary", "text-on-primary", "font-bold");

            DASHBOARD_STATE.filter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Modal Trigger Listeners
    if (openRankBtn) openRankBtn.addEventListener("click", openModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    // Leaderboard Live Search
    if (leaderboardSearchInput) {
        leaderboardSearchInput.addEventListener("input", (e) => {
            renderLeaderboard(e.target.value.trim());
        });
    }

    // Close Modal on Backdrop Click
    if (leaderboardModal) {
        leaderboardModal.addEventListener("click", (e) => {
            if (e.target === leaderboardModal) closeModal();
        });
    }
}

// Bind DOM Ready Event
document.addEventListener("DOMContentLoaded", initDashboard);
