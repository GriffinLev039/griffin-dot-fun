let testBtn = document.getElementById("test-btn");

// testBtn.addEventListener("click", (e) => {
//   console.log(`CLICKED: ${e.clientX} ${e.clientY}`);
// });

// Use IIFE for below:
// Get all buttons
// Give them all the following eventlisteners:
/**
 * Mouseenter
 * Mouseleave
 * click
 */

const ANIMATION_ARR = [];
const ANIMATION_DURATION = 45;
let ANIMATION_RUNNING = false;
/**
 * Animation Objects:
 *  - Point animation
 *  - Ellipse/button animation
 *  - Hover animation
 */

function PointAnimation() {
  this.x = 0;
  this.y = 0;
  this.startTime = performance.now();
  this.endTime = 0;
  this.removeMe = () => {};
}

function EllipseAnimation() {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.borderRadius = 0;
  this.startTime = performance.now();
  this.endTime = 0;
  this.removeMe = () => {};
}

function HoverAnimationEnter() {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.borderRadius = 0;
  this.startTime = performance.now();
  this.endTime = 0;
  this.removeMe = () => {};
}

function HoverAnimationExit() {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.borderRadius = 0;
  this.startTime = performance.now();
  this.endTime = 0;
  this.removeMe = () => {};
}

// PLAN IS FOR MOUSEOVER TO ADD A MOUSELEAVE EVENT LISTENER, that will be givem the "removeMe" callback.
// When mouse leaves, remove the HoverAnimationEnter obj and replace it with a HoverAnimationExit object.
// HoverAnimationExit object will dissappear after a set time has passed.

// The point and ellipse animations will also dissappear on their own. As such, I see no need for a function
// To remove a specified element from the "to be animated list"

// The animations progress based on proximity to end time. At end time, they trigger removeMe to pop them from array.

function addToQueue() {
  ANIMATION_ARR.push();
}

function clearQueue() {
  // Likely will add a MUTEX here
  ANIMATION_ARR.length = 0;
}

document.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    let { x, y, bottom, right, width, height } =
      e.target.getBoundingClientRect();
    // The rect for hover will be drawn on mouseenter and erased on mouseleave
    // this will just trigger the animation
    let borderRadius = window.getComputedStyle(e.target).borderRadius;

    console.log(x, y, width, height);
    context.beginPath();
    context.roundRect(x - 5, y - 5, width + 10, height + 10, 14);
    context.fill();
    return;
  }
  // This will call the animation from a point - right now ill just have it fill a rect.
  const rect = fxCanvas.getBoundingClientRect();
  context.fillRect(e.clientX - rect.left, e.clientY - rect.top, 15, 15);
});

let fxCanvas = document.getElementById("fx-canvas");
const context = fxCanvas.getContext("2d");
context.fillStyle = "red";
fxCanvas.height = window.innerHeight;
fxCanvas.width = window.innerWidth;

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

// I CAN WORRY ABOUT DETAILS AND APPEARANCE LATER - THIS IS JUST AN MVP
/**
 * Obj: Ellipses Expansion Animation Thingy
 * Key Values:
 * - startX
 * - startY
 * - Width
 * - Height
 * - Border radius
 */

/**
 * Obj: Circle Expansion Animation Thingy
 *  - startX
 *  - startY
 */

/*
So as far as I can tell, this consists of three main functions:
1. Ellipse clickable expansion function
2. Circle expansion function
3. Noise Generator
4. Noise Revealer
5. Overall click manager
*/

/**Draw Order:
 *  1. Erase everything
 *  2. Render background animation if present
 *  3. Render cursor
 */

function attachEventListeners(buttons) {
  for (let button of buttons) {
    button.addEventListener("mouseenter", buttonMouseEnterHandler);
    button.addEventListener("mouseleave", buttonMouseLeaveHandler);
    button.addEventListener("click", buttonClickHandler);
  }
}

function buttonMouseLeaveHandler(e) {
  let { x, y, bottom, right, width, height } = e.target.getBoundingClientRect();
  let borderRadius = window.getComputedStyle(e.target).borderRadius;
}

function buttonMouseEnterHandler(e) {}

function buttonClickHandler(e) {}

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

window.addEventListener("resize", (e) => {
  fxCanvas.height = window.innerHeight;
  fxCanvas.width = window.innerWidth;
  clearQueue(); //Might have to rewrite due to MUTEX and async? Not sure tbh. Should be fine but I love overengineering!
});

function beginAnimation() {
  if (ANIMATION_RUNNING == false) {
    ANIMATION_RUNNING = true;
    requestAnimationFrame(animate);
  }
}

function animate() {
  if (!ANIMATION_RUNNING) {
    return;
  }
  const now = performance.now();

  requestAnimationFrame(animate);
}
