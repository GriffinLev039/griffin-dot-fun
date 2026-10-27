class RenderEngine {
    constructor(config, context) {
        //xPos and yPos will not be pixel based but instead based on the matrix position. The renderer will calculate pixel numbers. 
        this.ctx = context;
        this.pxPerBlockX = config.pxPerBlockX;
        this.pxPerBlockY = config.pxPerBlockY;
        this.blocksPerX = config.blocksPerX || null;
        this.blocksPerY = config.blocksPerY || null;
        this.pointMatrix = config.pointMatrix;
        this.tps = config.tps || 60;
        this.isAlive = true;
        this.isComplex = config.isComplex;
    }
    static fromPxMeasure(pxPerBlockX, pxPerBlockY, pointMatrix,context, tps, complex) {
        return new RenderEngine({ pxPerBlockX: pxPerBlockX, pxPerBlockY: pxPerBlockY, pointMatrix: pointMatrix, tps: tps, isComplex: complex },context);
    }

    static fromNumOfBlocks(blocksPerX, blocksPerY, pointMatrix,context, tps, complex) {
        return new RenderEngine({ blocksPerX: blocksPerX, blocksPerY: blocksPerY, pointMatrix: pointMatrix, tps: tps, pxPerBlockX: window.innerWidth / blocksPerX, pxPerBlockY:  window.innerHeight / blocksPerY, isComplex: complex }, context);
    }

    static fromPointMatrix(pointMatrix,context, tps, complex) {
        return new RenderEngine({pxPerBlockX: window.innerWidth / pointMatrix[0].length, pxPerBlockY: window.innerHeight / pointMatrix.length, blocksPerX: pointMatrix[0].length, blocksPerY: pointMatrix.length, pointMatrix:pointMatrix, tps: tps, isComplex: complex}, context);
    }

    createRenderLoop() {
        this.isAlive = true;
        // First render pass - static elements here
        const render = () => {
            if (this.isAlive) {
                requestAnimationFrame(render);
            }
            this.renderPass();
            // Second render pass - dynamic elements here

        }
        return render;
    }
    killRenderLoop() {
        this.isAlive = false;
    }

    createRenderTrigger() {
        return () => {
            // Render when triggered
            // Figure out a way to define selected portion and then reaccess it
            console.log("AAUGH");
        }
    }

    renderPass() {
        for (let y = 0; y < this.pointMatrix.length; y++) {
            for (let x = 0; x < this.pointMatrix[y].length; x++) {
                this.renderPoint(x, y);
            }
        }
    }

    renderPoint(xPos, yPos) {
        // fetch current point
        // if static rgba value, draw rectangle
        // if non-static rgba value (function) run function for each point.
        let givenPoint = this.pointMatrix[yPos][xPos];

        let startingX = Math.floor(xPos * this.pxPerBlockX);
        let startingY = Math.floor(yPos * this.pxPerBlockY);
        let endingX = Math.ceil((xPos+1) * this.pxPerBlockX);
        let endingY = Math.ceil((yPos+1) * this.pxPerBlockY);

        if (typeof givenPoint.rgba == "string") {
            this.ctx.fillStyle = givenPoint.rgba;
            this.ctx.fillRect(startingX, startingY, this.pxPerBlockX, this.pxPerBlockY);
        } else if (typeof givenPoint.rgba == "function") {
            // SOME CHECK TO SEE IF givenPoint.rgba is a function that is a single result: e.g.) "If abc is true, return green. else, return red." or a dynamic thing, such as "if time = 0:05 and x > y, be blue. else, be red."
            // If static result, run function and then draw rect. If dynamic result, run function per px.
            if (this.isComplex) {
                for (let y = startingY; y < endingY; y+=1) {
                    for (let x = startingX; x < endingX; x+=1) {
                        this.ctx.fillStyle = givenPoint.rgba(x,y);
                        this.ctx.fillRect(x,y,1,1);
                    }
                }
            } else {
                this.ctx.fillStyle = givenPoint.rgba();
                this.ctx.fillRect(startingX, startingY, this.pxPerBlockX, this.pxPerBlockY);
            }
        } else {
            throw new TypeError;
        }

    }

}



export default RenderEngine;