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

document.addEventListener("DOMContentLoaded", () => {
    const day13Btn = document.getElementById("day13-locked-btn");
    if (day13Btn) {
        day13Btn.addEventListener("click", () => {
            showToast("Reminder set for Day 13 release!", "notifications_active");
        });
    }
});
