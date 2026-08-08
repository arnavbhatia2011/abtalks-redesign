/**
 * ABTalks Student Dashboard - Business Logic & State Core
 * Handles mock database, streak calculations, edge-case simulation, and state management.
 */

// 1. Mock Database & Student Profile State
const MOCK_STUDENT_DATA = {
    student: {
        name: "Arnav Bhatia",
        track: "Full-Stack Web3 / AI",
        joinedDate: "Day 1",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Arnav",
    },
    challenge: {
        totalDays: 60,
        currentDay: 12,
        startDate: "2026-07-28",
    },
    // Interactive State Toggle Modes (Supports Real-World Edge Cases)
    // Modes: 'NORMAL' (Active Streak) | 'FIRST_DAY' (0 Streak) | 'MISSED_DAY' (Broken Streak)
    activeMode: "NORMAL", 
    
    // State Configurations
    states: {
        NORMAL: {
            currentStreak: 11,
            longestStreak: 11,
            completedDaysCount: 11,
            isTodaySubmitted: false,
            standingRank: "Top 4%",
            multiplier: "1.5x XP",
            shieldActive: true,
            statusBadge: "On Fire 🔥",
            todayTask: {
                dayNumber: 12,
                title: "Build a Custom Canvas Shader Engine",
                estimatedTime: "45 mins",
                difficulty: "Hard",
                status: "PENDING" // PENDING | COMPLETED
            }
        },
        FIRST_DAY: {
            currentStreak: 0,
            longestStreak: 0,
            completedDaysCount: 0,
            isTodaySubmitted: false,
            standingRank: "Unranked",
            multiplier: "1.0x XP",
            shieldActive: false,
            statusBadge: "Day 1 Recruit 🌱",
            todayTask: {
                dayNumber: 1,
                title: "Initialize Git Repo & Setup Proof Pipeline",
                estimatedTime: "20 mins",
                difficulty: "Easy",
                status: "PENDING"
            }
        },
        MISSED_DAY: {
            currentStreak: 0,
            longestStreak: 10,
            completedDaysCount: 10,
            isTodaySubmitted: false,
            standingRank: "Top 15%",
            multiplier: "1.0x XP",
            shieldActive: false,
            statusBadge: "Streak Broken 💔",
            todayTask: {
                dayNumber: 12,
                title: "Build a Custom Canvas Shader Engine",
                estimatedTime: "45 mins",
                difficulty: "Hard",
                status: "PENDING"
            }
        }
    }
};

// 2. Logic Controller API
class DashboardController {
    constructor(data) {
        this.data = data;
        this.currentMode = data.activeMode;
    }

    // Get current active state data
    getState() {
        const state = this.data.states[this.currentMode];
        const progressPercentage = Math.round((state.completedDaysCount / this.data.challenge.totalDays) * 100);
        
        return {
            student: this.data.student,
            challenge: this.data.challenge,
            mode: this.currentMode,
            progressPercentage,
            ...state
        };
    }

    // Switch state mode for testing edge cases
    setMode(newMode) {
        if (this.data.states[newMode]) {
            this.currentMode = newMode;
            this.notifyUI();
        }
    }

    // Mark today's submission as complete
    submitTodayProof() {
        const activeState = this.data.states[this.currentMode];
        if (!activeState.isTodaySubmitted) {
            activeState.isTodaySubmitted = true;
            activeState.todayTask.status = "COMPLETED";
            activeState.currentStreak += 1;
            activeState.completedDaysCount += 1;
            if (activeState.currentStreak > activeState.longestStreak) {
                activeState.longestStreak = activeState.currentStreak;
            }
            this.notifyUI();
        }
    }

    // Event listener registration for UI synchronization
    onStateChange(callback) {
        this.uiCallback = callback;
    }

    notifyUI() {
        if (typeof this.uiCallback === 'function') {
            this.uiCallback(this.getState());
        }
    }
}

// Global instance initialized
window.dashboardLogic = new DashboardController(MOCK_STUDENT_DATA);
