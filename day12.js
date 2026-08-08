/**
 * ABTalks Challenge Day (/day/12) - Business Logic & State Core
 * Handles submission inputs (GitHub commit + LinkedIn post), input validation,
 * proof verification simulation, and persistent streak updates.
 */

// 1. Mock Data for Day 12 Challenge
const MOCK_DAY_12_DATA = {
    dayNumber: 12,
    totalDays: 60,
    title: "Build a Custom Canvas Shader Engine",
    estimatedTime: "45 mins",
    difficulty: "Hard",
    xpReward: 250,
    description: `
        Today, you will dive into low-level procedural rendering on the web using WebGL fragment shaders. 
        Your goal is to build a high-performance dark-mode procedural noise canvas that renders at 60 FPS 
        and responds to cursor motion.
    `,
    requirements: [
        "Initialize a HTML5 `<canvas>` element with WebGL2 context",
        "Write a custom GLSL fragment shader rendering smooth Simplex Noise",
        "Implement a requestAnimationFrame loop with time-delta calculations",
        "Make the canvas background responsive to window resizing and touch interaction"
    ],
    submissionState: {
        githubUrl: "",
        linkedinUrl: "",
        isSubmitting: false,
        isSubmitted: false,
        errorMessage: ""
    }
};

// 2. Logic Controller API
class ChallengeDayController {
    constructor(data) {
        this.data = data;
    }

    // Get current challenge state
    getState() {
        return { ...this.data };
    }

    // Validate URLs (GitHub Commit & LinkedIn Post)
    validateUrls(githubUrl, linkedinUrl) {
        const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/commit\/[a-zA-Z0-9]+)?$/i;
        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/(posts|feed\/update)\/[a-zA-Z0-9_-]+/i;

        if (!githubUrl || !githubUrl.trim()) {
            return { valid: false, error: "Please provide your GitHub repository or commit URL." };
        }
        if (!githubRegex.test(githubUrl.trim())) {
            return { valid: false, error: "Invalid GitHub URL format. Example: https://github.com/user/repo" };
        }
        if (!linkedinUrl || !linkedinUrl.trim()) {
            return { valid: false, error: "Please provide your LinkedIn proof post URL." };
        }
        if (!linkedinRegex.test(linkedinUrl.trim())) {
            return { valid: false, error: "Invalid LinkedIn URL format. Example: https://linkedin.com/posts/username_activity" };
        }

        return { valid: true, error: "" };
    }

    // Process Proof Submission
    submitProof(githubUrl, linkedinUrl) {
        const validation = this.validateUrls(githubUrl, linkedinUrl);
        
        if (!validation.valid) {
            this.data.submissionState.errorMessage = validation.error;
            this.notifyUI();
            return false;
        }

        // Simulate Submission Processing State
        this.data.submissionState.isSubmitting = true;
        this.data.submissionState.errorMessage = "";
        this.data.submissionState.githubUrl = githubUrl;
        this.data.submissionState.linkedinUrl = linkedinUrl;
        this.notifyUI();

        // Simulate asynchronous verification API delay
        setTimeout(() => {
            this.data.submissionState.isSubmitting = false;
            this.data.submissionState.isSubmitted = true;
            this.notifyUI();
        }, 1500);

        return true;
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
window.day12Logic = new ChallengeDayController(MOCK_DAY_12_DATA);
