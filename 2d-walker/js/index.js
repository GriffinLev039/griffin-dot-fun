const WIDTH_BLOCKS = 40;
const HEIGHT_BLOCKS = 30;

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    widthChunks: 40,
    heightChunks: 30,
    widthChunkSize: window.innerWidth / widthChunks,
    heightChunkSize: window.innerHeight / heightChunks,
    chunkMap: []
}

