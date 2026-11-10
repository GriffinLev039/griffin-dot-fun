const ANIMATION_DURATION = 1.25;
const SHORT_DURATION = 0.1;
const SCALE_SIZING = 100;
const BLUR_RADIUS = 10;
const HOVER_PADDING = 6;
const LINE_WIDTH = 8;
const LINE_COLOR = "#FFFF8F";
const PREFERS_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const animationArr = [];
let animationRunning = false;
let previousTick = 0;

const fxCanvas = document.getElementById("fx-canvas");
const context = fxCanvas.getContext("2d");

class FxAnimation {
  constructor(x, y, duration) {
    this.x = x;
    this.y = y;
    this.startTime = performance.now();
    this.endTime = performance.now() + 1000 * duration;
  }
  getScale() {
    return (
      (performance.now() - this.startTime) / (this.endTime - this.startTime)
    );
  }
  removeMe() {
    const i = animationArr.indexOf(this);
    if (i !== -1) animationArr.splice(i, 1);
  }
  draw(context, timestamp) {
    throw new Error("draw() not implemented.");
  }
}

class PointAnimation extends FxAnimation {
  constructor(x, y) {
    super(x, y, ANIMATION_DURATION);
  }

  draw(context, timestamp) {
    if (timestamp >= this.endTime) {
      this.removeMe();
      return;
    }
    let scale = this.getScale();
    const maxRadius = Math.hypot(
      Math.max(this.x, window.innerWidth - this.x),
      Math.max(this.y, window.innerHeight - this.y),
    );
    const r = 1 + scale * maxRadius;

    context.globalAlpha = Math.max(1 - scale * 2, 0);
    context.beginPath();
    context.arc(this.x, this.y, r, 0, 2 * Math.PI);
    // context.filter = `blur(${400 * scale}px)`;
    context.lineWidth = LINE_WIDTH;
    context.stroke();
    // context.filter = "none";
    context.globalAlpha = 1;
    return;
  }
}

class EllipseAnimation extends FxAnimation {
  constructor(x, y, width, height, borderRadius) {
    super(x, y, ANIMATION_DURATION);
    this.width = width;
    this.height = height;
    this.borderRadius = borderRadius;
  }

  draw(context, timestamp) {
    if (timestamp >= this.endTime) {
      this.removeMe();
      return;
    }
    let scale = this.getScale();
    context.globalAlpha = Math.max(1 - scale * 2, 0);
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const maxGrow = Math.max(
      Math.max(cx, window.innerWidth - cx) / (this.width / 2),
      Math.max(cy, window.innerHeight - cy) / (this.height / 2),
    );
    const grow = 1 + scale * (maxGrow - 1);
    let w = this.width * grow;
    let h = this.height * grow;
    context.beginPath();
    context.roundRect(cx - w / 2, cy - h / 2, w, h, this.borderRadius * grow);
    // context.filter = "blur(8px)";
    context.lineWidth = 20;
    context.stroke();
    // context.filter = "none";
    context.globalAlpha = 1;
    return;
  }
}

class HoverAnimationEnter extends FxAnimation {
  constructor(x, y, width, height, borderRadius) {
    super(x, y, SHORT_DURATION);
    this.width = width;
    this.height = height;
    this.borderRadius = borderRadius;
  }
  removeMe() {
    const i = animationArr.indexOf(this);
    if (i !== -1) animationArr.splice(i, 1);
    addToQueue(
      new HoverAnimationExit(
        this.x,
        this.y,
        this.width,
        this.height,
        this.borderRadius,
      ),
    );
  }

  draw(context, timestamp) {
    let grow = this.getScale();
    let w = this.width * grow;
    let h = this.height * grow;

    if (this.endTime <= timestamp) {
      w = this.width + HOVER_PADDING;
      h = this.height + HOVER_PADDING;
    }

    let cx = this.x + this.width / 2;
    let cy = this.y + this.height / 2;
    // Step animation if necessary

    context.beginPath();
    context.roundRect(
      cx - w / 2,
      cy - h / 2,
      w,
      h,
      this.borderRadius + HOVER_PADDING,
    );
    context.lineWidth = LINE_WIDTH;
    context.stroke();
    context.filter = "none";
    return;
  }

  removeNoExit() {
    const i = animationArr.indexOf(this);
    if (i !== -1) animationArr.splice(i, 1);
  }
}

class HoverAnimationExit extends FxAnimation {
  constructor(x, y, width, height, borderRadius) {
    super(x, y, SHORT_DURATION);
    this.width = width;
    this.height = height;
    this.borderRadius = borderRadius;
  }

  draw(context, timestamp) {
    if (timestamp >= this.endTime) {
      this.removeMe();
      return;
    }
    let grow = Math.abs(1 - this.getScale());
    let w = this.width * grow;
    let h = this.height * grow;
    let cx = this.x + this.width / 2;
    let cy = this.y + this.height / 2;
    context.beginPath();
    context.roundRect(cx - w / 2, cy - h / 2, w, h, this.borderRadius * grow);
    context.lineWidth = LINE_WIDTH;
    context.stroke();
    context.filter = "none";
    return;
  }
}

// I don't need a function for this atm, but feels better than modifying the arr directly. Likely a better option here.
function addToQueue(obj) {
  if (PREFERS_REDUCED_MOTION) {
    return;
  }
  animationArr.push(obj);
}

function clearQueue() {
  animationArr.length = 0;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  fxCanvas.width = w * dpr;
  fxCanvas.height = h * dpr;
  fxCanvas.style.width = w + "px";
  fxCanvas.style.height = h + "px";
  context.strokeStyle = LINE_COLOR;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function beginAnimation() {
  if (PREFERS_REDUCED_MOTION) {
    return;
  }
  if (animationRunning == false) {
    animationRunning = true;
    previousTick = performance.now();
    requestAnimationFrame(animate);
  }
}

function animate(timestamp) {
  if (!animationRunning) {
    return;
  }
  if (animationArr.length == 0) {
    animationRunning = false;
    return;
  }
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = animationArr.length - 1; i >= 0; i--) {
    const animObj = animationArr[i];
    animObj.draw(context, timestamp);
  }
  previousTick = timestamp;

  console.log(animationArr); //REMOVE ONCE DONE
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  let allButtons = document.getElementsByTagName("button");
  for (let btn of allButtons) {
    btn.addEventListener("mouseenter", (e) => {
      beginAnimation();
      let { x, y, width, height } = e.target.getBoundingClientRect();
      let borderRadius =
        parseFloat(window.getComputedStyle(e.target).borderRadius) || 0;
      let objPointer = new HoverAnimationEnter(
        x,
        y,
        width,
        height,
        borderRadius,
      );
      addToQueue(objPointer);

      const ac = new AbortController();
      const { signal } = ac;

      btn.addEventListener(
        "mouseleave",
        () => {
          objPointer.removeMe();
          ac.abort();
        },
        { signal },
      );
      btn.addEventListener(
        "click",
        () => {
          objPointer.removeNoExit();
          ac.abort();
        },
        { signal },
      );
    });
  }
});

document.addEventListener("click", (e) => {
  beginAnimation();
  if (e.target.closest("Button")) {
    let target = e.target.closest("Button");
    let { x, y, bottom, right, width, height } = target.getBoundingClientRect();
    // The rect for hover will be drawn on mouseenter and erased on mouseleave
    // this will just trigger the animation
    let borderRadius =
      parseFloat(window.getComputedStyle(target).borderRadius) || 0;
    addToQueue(new EllipseAnimation(x, y, width, height, borderRadius));
    return;
  }

  const rect = fxCanvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  addToQueue(new PointAnimation(x, y));
});

resizeCanvas();

window.addEventListener("resize", (e) => {
  resizeCanvas();
});
// Random notes below

/**
 * My plan is:
 *  - have functions that add instructions to an array
 *  - have functions that remove instructions from an array that must be drawn
 *  - function that regularly ticks and only renders what has the drawn instruction
 */

/**TODO
 * 1. Add resizing handler --
 * 2. Add requestAnimationFrame loop
 * 3. Make hoving show rectangle
 * 4. make moving away hide rectangle
 * 5. Make orb on mouse cursor (draw/erase)
 * 6. Make clicking play "animation" (just like, a square that appears and dissapears)
 * 7. Make clicking on button play "animation" (Outline of button that appears and dissappears)
 * 8. Make click not on btn draw circle across bg, animated
 * 9. Make click on btn draw ellipse across bg, animated
 * 10. Make hover look fluid (fade in/out on hover?)
 * 11. Make background animation look fluid
 * 12. Implement random noise generation
 * 13. Show random noise when supposed to
 * 14. Ensure everything is packaged and modular.
 * 15. If possible, allow it to be designated easily with classes. Design it so anyone could implement this easily.
 * 16. DONE!!! Short writeup and publish!
 */

// For the animation, I want noise to be defined on page load and then be consistent.
// I will use a setInterval paired with requestAnimationFrame to redraw it. I think I will
// pass an object containing the starting params, color, width, gradient, and other key values
// The noise will not be visible, but instead just be predefined points and radii layered on top
// Ex:

// So I need the function to get if a clickable object is hit or just the background, and
// then play differing animations based on that. Idea is to have a single click ripple and
// over a button play the full

// I also need to have hovering a clickable change its background into a gradient centered
// where the cursor is. This will be a very subtle gradient - think a small spot on a
// monochrome background.
