class RenderPoint {
    // Static and conditional are mutually exclusive here. Need a check for that.
    // Need to be able to pipe a function or use a flat value for rgba. Likely will just do a call and in that call checks 'typeof Integer' and if not Integer runs it as function. That could be insecure tho
    // Might be a bad way to do it - would be better off handling the 'rgba' function in blocks, and then passing that value individually, instead of doing the calc this often. Still, could be useful. 
    constructor(xPos, yPos, rgba, isStatic, isConditional) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.rgba = rgba;
        this.isStatic = isStatic;
        this.isConditional = isConditional;
    }

    parseRGBA(){
        if (typeof this.rgba == "string") {
            // parse as number
        } else if (typeof this.rgba == "function") {
            // run function to apply rgba value
        } else {
            throw new TypeError;
        }
    }
}

export default RenderPoint;