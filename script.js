/**
 * Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0)
 * Developed by FotballFolket.no & AI collaboration.
 */
const COLORS = [
    { name: 'Blue', value: '#007AFF' },
    { name: 'Red', value: '#FF3B30' },
    { name: 'Cyan', value: '#5AC8FA' },
    { name: 'Green', value: '#4CD964' },
    { name: 'Purple', value: '#5856D6' },
    { name: 'Yellow', value: '#FFCC00' }
];

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

// Initialize Color Chips
function initColorChips() {
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
initColorChips();
startCycling();
