//0- empty
//1-pacman
//2-pellet
//3-ghost
//4-wall
class Jacman{
    constructor(nX,nY) {
        this.xDirection = 0;
        this.yDirection = 0;
        this.xCoord = nX;
        this.yCoord = nY;
    }
}
function moveUp() {
    jacc.xDirection = -1;
    jacc.yDirection = 0;
}

function moveDown() {
    jacc.xDirection = 1;
    jacc.yDirection = 0;
}

function moveLeft() {
    jacc.xDirection = 0;
    jacc.yDirection = -1;
}

function moveRight() {
    jacc.xDirection = 0;
    jacc.yDirection = 1;
}
class Pellet{
    constructor (nValue) {
        this.value = nValue;
    }

}

function setupJacSprite()
{
    const jacAnim = document.createElement("img");
    jacAnim.src = "sprites/jacman.gif";
    jacAnim.style.width = "128px";
    jacAnim.style.height = "auto";
    return jacAnim;
}

function drawMap() {

    gameBox.innerHTML = "";
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("cell");
            if (map[i][j] === 0) {
                newDiv.classList.add("path")
            }
            else if (map[i][j] === 1) {
                newDiv.appendChild(JacSprite.cloneNode(true));
            }
            else if (map[i][j] === 4) {
                newDiv.classList.add("wall");
            }

            gameBox.appendChild(newDiv);
        }

    }
}

function onKeyPress(event){
    switch (event.key) {
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
    }

    if (map[jacc.xCoord + jacc.xDirection][jacc.yCoord + jacc.yDirection] != 4) {
        map[jacc.xCoord][jacc.yCoord] = 0;
        jacc.xCoord += jacc.xDirection;
        jacc.yCoord += jacc.yDirection;
        map[jacc.xCoord][jacc.yCoord] = 1;
    }

    drawMap();
}

function main() {
    let score = 0;
    document.addEventListener("keydown", onKeyPress);
    drawMap();
}


let jacc = new Jacman(1, 1);

let map = [
    [4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 1, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4],
];

let gameBox = document.getElementById("game-box");

const JacSprite = setupJacSprite();
main();
