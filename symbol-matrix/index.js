const canvas = document.getElementById('target');
const ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
let dpr = window.devicePixelRatio;

let charStr = "<>///_-{[]}~";
let chars = charStr.split("");

let mouseX = 0;
let mouseY = 0;
let mouseRadius = 100;
let width = 0;
let height = 0;
let spacing = 30;
let dotSize = 2;
function setupCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#45455c";
    ctx.font = `${dotSize * 8}px monospace`;

}


function drawDots() {
    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            ctx.fillRect(x, y, dotSize, dotSize);

        }
    }
}




document.addEventListener("DOMContentLoaded", () => {
    setupCanvas();
    drawDots();
})


let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

document.addEventListener('mousemove', (e) => {
    // Clear last rectangle
    ctx.clearRect(endX, endY, startX - endX, startY - endY);
    for (let x = startX; x < endX; x += spacing) {
        for (let y = startY; y < endY; y += spacing) {
            let prox = proxToCenter(x, y, mouseRadius, mouseX, mouseY);
            ctx.fillRect(x, y, dotSize, dotSize);
        }
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
    let leftBound = mouseX - mouseRadius * 1.5;
    let rightBound = mouseX + mouseRadius * 1.5;
    let topBound = mouseY - mouseRadius * 1.5;
    let bottomBound = mouseY + mouseRadius * 1.5;

    startX = Math.floor(Math.max(0, leftBound) / spacing) * spacing;
    endX = Math.min(width, rightBound);

    startY = Math.floor(Math.max(0, topBound) / spacing) * spacing;
    endY = Math.min(height, bottomBound);
    // Clear current pos
    ctx.clearRect(endX, endY, startX - endX, startY - endY);
    // Redraw
    for (let x = startX; x < endX; x += spacing) {
        for (let y = startY; y < endY; y += spacing) {
            let prox = proxToCenter(x, y, mouseRadius, mouseX, mouseY);
            if (prox > 0) {
                ctx.fillStyle = "#57576cx";
                ctx.fillText(`${chars[(x / 15 + y / 6) % chars.length]}`, x, y, dotSize * 10 * prox);
                ctx.fillStyle = "#45455c";
            } else {
                ctx.fillRect(x, y, dotSize, dotSize);
            }
        }
    }
})

window.addEventListener('resize', () => {
    setupCanvas();
    drawDots();
})

// X1, Y1, and Radius all correspond to the 'circle' you are calculating distance from the center of
// x2 and y2 are the point of which you are checking to see how far from the center
// That is not english
// Returns a float between 0 and 1, with 1 being in the exact same position, and 0 being outside the radius. 
function proxToCenter(x1, y1, radius, x2, y2) {
    let xDist = Math.pow(x2 - x1, 2);
    let yDist = Math.pow(y2 - y1, 2);
    let proxDist = Math.sqrt(xDist + yDist);
    let proximity = Math.max(0, 1 - (proxDist / radius));
    return proximity;
}
