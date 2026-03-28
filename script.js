/**
 * Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0)
 * Developed by FotballFolket.no & AI collaboration.
 */
const COLORS = [
    { name: 'Blue', value: '#1165C4' },
    { name: 'Red', value: '#d61710' },
    { name: 'Orange', value: '#f08120' },
    { name: 'Green', value: '#6BDA0C' },
    { name: 'Yellow', value: '#F8D507'}
];

// Default settings
let selectedColors = [COLORS[0].value, COLORS[1].value, COLORS[2].value]; // Default n=3
let cycleInterval = 2000;
let currentIndex = 0;
let timer = null;

const background = document.getElementById('background');
const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('overlay');
const closeMenu = document.getElementById('close-menu');
const colorOptions = document.getElementById('color-options');
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const settingsContainer = document.getElementById('settings-container');

// Promo Link
const promoLink = document.createElement('a');
promoLink.href = "https://fotballfolket.no/products/sma-kjegler";
promoLink.id = "promo-link";
promoLink.target = "_blank";
promoLink.rel = "noopener";
promoLink.innerText = "Buy agility cones in the above colors at FotballFolket.no";
settingsContainer.appendChild(promoLink);

// Persistence Logic
function saveSettings() {
    const settings = {
        selectedColors: selectedColors,
        cycleInterval: cycleInterval
    };
    localStorage.setItem('ff_color_cycler_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('ff_color_cycler_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            if (settings.selectedColors) selectedColors = settings.selectedColors;
            if (settings.cycleInterval) {
                cycleInterval = settings.cycleInterval;
                // Update UI to reflect loaded speed
                speedSlider.value = cycleInterval;
                speedDisplay.innerText = (cycleInterval / 1000).toFixed(1) + 's';
            }
        } catch (e) {
            console.error("Error loading settings from localStorage", e);
        }
    }
}

// Initialize Color Chips
function initColorChips() {
    colorOptions.innerHTML = ''; // Clear existing
    COLORS.forEach(color => {
        const chip = document.createElement('div');
        chip.className = 'color-chip' + (selectedColors.includes(color.value) ? ' active' : '');
        chip.style.backgroundColor = color.value;
        chip.onclick = () => toggleColor(color.value, chip);
        colorOptions.appendChild(chip);
    });
}

function toggleColor(colorValue, chip) {
    if (selectedColors.includes(colorValue)) {
        if (selectedColors.length > 1) {
            selectedColors = selectedColors.filter(c => c !== colorValue);
            chip.classList.remove('active');
        }
    } else {
        selectedColors.push(colorValue);
        chip.classList.add('active');
    }
    saveSettings();
    resetCycle();
}

function startCycling() {
    if (timer) clearInterval(timer);
    if (selectedColors.length === 0) return;

    const run = () => {
        background.style.backgroundColor = selectedColors[currentIndex];
        currentIndex = (currentIndex + 1) % selectedColors.length;
    };

    run(); // Run immediately
    timer = setInterval(run, cycleInterval);
}

function resetCycle() {
    currentIndex = 0;
    startCycling();
}

// Event Listeners
menuToggle.onclick = () => {
    overlay.classList.remove('hidden');
};

closeMenu.onclick = () => {
    overlay.classList.add('hidden');
};

speedSlider.oninput = (e) => {
    cycleInterval = parseInt(e.target.value);
    speedDisplay.innerText = (cycleInterval / 1000).toFixed(1) + 's';
    saveSettings();
    startCycling();
};

fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message}`);
        });
        fullscreenBtn.innerText = "Exit Fullscreen";
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerText = "Go Fullscreen";
    }
};

// Initial Start
loadSettings();
initColorChips();
startCycling();
