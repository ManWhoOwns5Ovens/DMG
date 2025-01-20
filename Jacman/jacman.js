//0- empty
//1-pacman
//2-pellet
//3-ghost
//4-wall
//5-tp-tile
class Jacman{
    constructor(nX,nY) {
        this.xDirection = 0;
        this.yDirection = 0;
        this.xCoord = nX;
        this.yCoord = nY;
        this.originalJacSprite = this.setupJacSprite();
        this.JacSprite = this.originalJacSprite;
    }

    setupJacSprite() {
        const jacAnim = document.createElement("img");
        jacAnim.src = "sprites/jacman.gif";
        jacAnim.style.width = "24px";
        jacAnim.style.height = "auto";
        jacAnim.style.transform = "scaleX(-1)";
        return jacAnim;
    }

    resetSprite() {
        this.JacSprite = this.originalJacSprite;
    }

    moveUp() {
        this.xDirection = -1;
        this.yDirection = 0;
        this.resetSprite();
        this.JacSprite.style.transform = "rotate(90deg)";
    }

    moveDown() {
        this.xDirection = 1;
        this.yDirection = 0;
        this.resetSprite();
        this.JacSprite.style.transform = "rotate(270deg)";
    }

    moveLeft() {
        this.xDirection = 0;
        this.yDirection = -1;
        this.resetSprite();
        this.JacSprite.style.transform = "scaleX(1)";
    }

    moveRight() {
        this.xDirection = 0;
        this.yDirection = 1;
        this.resetSprite();
        this.JacSprite.style.transform = "scaleX(-1)";
    }
}

class Pellet{
    constructor (nValue) {
        this.value = nValue;
    }

}
function drawMap() {

    gameBox.innerHTML = "";
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("cell");
            if (map[i][j] === 0 || map[i][j] === 5) {
                newDiv.classList.add("path")
            }
            else if (map[i][j] === 1) {
                newDiv.appendChild(jacmanObject.JacSprite.cloneNode(true));
            }
            else if (map[i][j] === 4) {
                newDiv.classList.add("wall");
            }

            gameBox.appendChild(newDiv);
        }

    }
}

function loadMap() {
    const fileName = "mapData.txt";
    let nMap = [];

    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); //into data
        })

        .then(data => {
            const lines = data.split("\n");

            for (let i = 0; i < lines.length; i++)
            {
                nMap[i] = lines[i].split(",");
                for (let j = 0; j < nMap[i].length; j++)
                {
                    nMap[i][j] = parseInt(nMap[i][j]);
                }
            }

            nMap[jacmanObject.xCoord][jacmanObject.yCoord] = 1;
            
        })

        .catch(error => {
            console.error("Error loading the file:", error);
        });



    return nMap;
    
}
function onKeyPress(event){
    switch (event.key) {
        case "ArrowUp":
            jacmanObject.moveUp();
            break;
        case "ArrowDown":
            jacmanObject.moveDown();
            break;
        case "ArrowRight":
            jacmanObject.moveRight();
            break;
        case "ArrowLeft":
            jacmanObject.moveLeft();
            break;
    }
}

function jacmanMove() {
    if (map[jacmanObject.xCoord + jacmanObject.xDirection][jacmanObject.yCoord] === 5)
    {
        map[jacmanObject.xCoord][jacmanObject.yCoord] = 0;
        jacmanObject.yCoord = (jacmanObject.yCoord + jacmanObject.yDirection) % (map[0].length-1);
        map[jacmanObject.xCoord][jacmanObject.yCoord] = 1;
    }
    else if (map[jacmanObject.xCoord + jacmanObject.xDirection][jacmanObject.yCoord + jacmanObject.yDirection] != 4) {
        map[jacmanObject.xCoord][jacmanObject.yCoord] = 0;
        jacmanObject.xCoord += jacmanObject.xDirection;
        jacmanObject.yCoord += jacmanObject.yDirection;
        map[jacmanObject.xCoord][jacmanObject.yCoord] = 1;
    }

    drawMap();
}

function main() {
    document.addEventListener("keydown", onKeyPress);
    setInterval(jacmanMove, 200);
    drawMap();
}

const initJacX = 23, initJacY = 14;
let jacmanObject = new Jacman(initJacX, initJacY);

let map = loadMap();

let gameBox = document.getElementById("game-box");
main();
