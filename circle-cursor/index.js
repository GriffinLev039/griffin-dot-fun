const CURSOR_SIZE = 20;

const canvas = document.getElementById("cursor");
const ctx = canvas.getContext("2d");
let boundingRect = canvas.getBoundingClientRect();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentExt = 0;
let maxExt = 25;
let mouseX = 0;
let mouseY = 0;
let diffX = 0;
let diffY = 0;
let bodyFill = "#57576c";
let textFill = "#f5b2e0";
ctx.font = `${CURSOR_SIZE * .65}px serif`
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isHovering()) {
        currentExt += (maxExt - currentExt) * 0.15;
        bodyFill = "#57576c";
    } else {
        currentExt += (0 - currentExt) * 0.15;
        bodyFill = "#45455c";
    }
    ctx.fillStyle = bodyFill;
    drawCursor(diffX, diffY, currentExt);
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    diffX = e.clientX - boundingRect.left;
    diffY = e.clientY - boundingRect.top;
});


function isHovering() {
    // console.log(document.elementFromPoint(mouseX, mouseY).tagName);
    return document.elementFromPoint(mouseX, mouseY).tagName != "MAIN";
}

function getHovering() {
    return document.elementFromPoint(mouseX, mouseY).tagName;
}


(() => {
    setInterval(animate, 20);
})();


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    boundingRect = canvas.getBoundingClientRect();
})

function drawCursor(x, y, ext) {
    const KAPPA = 0.55228474983;
    const offset = CURSOR_SIZE * KAPPA;

    ctx.beginPath();

    // Start at Top-Left of the flat horizontal top edge
    ctx.moveTo(x - ext, y - CURSOR_SIZE);

    // Flat top edge stretching to Top-Right
    ctx.lineTo(x + ext, y - CURSOR_SIZE);

    // 1. Top-Right Corner Quadrant
    ctx.bezierCurveTo(
        x + ext + offset, y - CURSOR_SIZE,
        x + ext + CURSOR_SIZE, y - offset,
        x + ext + CURSOR_SIZE, y
    );

    // 2. Bottom-Right Corner Quadrant
    ctx.bezierCurveTo(
        x + ext + CURSOR_SIZE, y + offset,
        x + ext + offset, y + CURSOR_SIZE,
        x + ext, y + CURSOR_SIZE
    );

    // Flat bottom edge stretching back to Bottom-Left
    ctx.lineTo(x - ext, y + CURSOR_SIZE);

    // 3. Bottom-Left Corner Quadrant
    ctx.bezierCurveTo(
        x - ext - offset, y + CURSOR_SIZE,
        x - ext - CURSOR_SIZE, y + offset,
        x - ext - CURSOR_SIZE, y
    );

    // 4. Top-Left Corner Quadrant
    ctx.bezierCurveTo(
        x - ext - CURSOR_SIZE, y - offset,
        x - ext - offset, y - CURSOR_SIZE,
        x - ext, y - CURSOR_SIZE
    );
    ctx.closePath();
    ctx.fill();

    if (isHovering() && ext > maxExt * 0.65) {
        let textStr = "click me :)";
        switch (getHovering()) {
            case "BUTTON":
                textStr = "click me :)"
                break;
            case "DIV":
                textStr = "read me :)"
                break;
            default:
                textStr = "wuh oh :("
                break;
        }
        ctx.fillStyle = textFill;
        ctx.fillText(textStr, x - ext, y + offset * 0.5);
        ctx.fillStyle = bodyFill;
    }
}

