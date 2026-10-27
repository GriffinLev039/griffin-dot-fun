import RenderEngine from "./render-engine.js";
import RenderPoint from "./2d-point.js";
const WIDTH_BLOCKS = 40;
const HEIGHT_BLOCKS = 30;

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let posX = 0;
let posY = 0;
let finalPosX = canvas.width;
let finalPosY = canvas.height;
let counter = 0;
ctx.font = "15px serif";



let startTime = performance.now();
let fps = 0;
let secFps = 0;
function renderFpsCounter() {
    let currentTime = performance.now();
    let timeDelta = currentTime - startTime;
    if (timeDelta > 1000) {
        secFps = fps;
        startTime = performance.now();
        fps = 0;
    }
    fps++;
    ctx.clearRect(0, 0, 100, 100);
    ctx.fillStyle = "red";
    ctx.fillText(secFps, 50, 50);

    requestAnimationFrame(renderFpsCounter);
}


function createPointMatrix(rgbaValue) {
    const pointMatrix = new Array();
    for (let i = 0; i < 100; i++) {
        pointMatrix[i] = [];
        for (let j = 0; j < 10; j++) {
            pointMatrix[i][j] = new RenderPoint(j, i, rgbaValue, false, false);
        }
    }
    return pointMatrix;
}

let renderEngine = RenderEngine.fromPointMatrix(createPointMatrix(plasmaShader), ctx, 60, true);
let renderLoop = renderEngine.createRenderLoop();

renderLoop();
renderFpsCounter();

function randomColor() {
    const chars = '0123456789abcdef';
    let outputStr = '#';
    for (let i = 0; i < 1; i++) {
        outputStr += chars[Math.floor(Math.random() * chars.length)];
    }
    return outputStr;
}


// AI GENERATED SHADER TEST FUNCTION
function plasmaShader(x, y) {
    // Get a continuously ticking time variable (divided by 500 to control animation speed)
    const time = performance.now() / 500;

    // Scale determines how "zoomed in" the waves are. 
    // Tweak this to make the pattern tighter or wider.
    const scale = 0.00005;

    // Calculate RGB values using intersecting Sine and Cosine waves.
    // Math.sin returns a value between -1 and 1. 
    // We add 1 (to make it 0 to 2), then multiply by 127.5 to map it perfectly to 0-255 for colors.
    const r = Math.floor((Math.sin((x * scale) + time) + 1) * 127.5);
    const g = Math.floor((Math.cos((y * scale) + time) + 1) * 127.5);
    const b = Math.floor((Math.sin(((x + y) * scale) - time) + 1) * 127.5);

    // Return the formatted string the Canvas API expects
    return `rgb(${r}, ${g}, ${b})`;
}