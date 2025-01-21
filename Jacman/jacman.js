//0- empty
//1-pacman
//2-pellet
//3-big pellet
//4-wall
//5-ghost
//6-cherry
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
        const jacAnim = standardiseSprite();
        jacAnim.src = "sprites/jacman.gif";
        jacAnim.style.transform = "scaleX(-1)";
        return jacAnim;
    }

    resetSprite() {
        this.JacSprite = this.originalJacSprite;
    }

    moveUp() {
        this.xDirection = 0;
        this.yDirection = -1;
        this.resetSprite();
        this.JacSprite.style.transform = "rotate(90deg)";
    }

    moveDown() {
        this.xDirection = 0;
        this.yDirection = 1;
        this.resetSprite();
        this.JacSprite.style.transform = "rotate(270deg)";
    }

    moveLeft() {
        this.xDirection = -1;
        this.yDirection = 0;
        this.resetSprite();
        this.JacSprite.style.transform = "scaleX(1)";
    }

    moveRight() {
        this.xDirection = 1;
        this.yDirection = 0;
        this.resetSprite();
        this.JacSprite.style.transform = "scaleX(-1)";
    }
}

function standardiseSprite()
{
    pSprite = document.createElement("img");
    pSprite.style.width = "24px";
    pSprite.style.height = "auto";
    return pSprite;
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
            else if (map[i][j] === 4) {
                newDiv.classList.add("wall");
            }
            else if (map[i][j] === 2) {
                newDiv.appendChild(pelletSprite.cloneNode(true));
            }
            else if (map[i][j] === 3) {
                newDiv.appendChild(bigPelletSprite.cloneNode(true));
            }
            else if (map[i][j] === 1) {
                newDiv.appendChild(jacmanObject.JacSprite.cloneNode(true));
            }
            

            gameBox.appendChild(newDiv);
        }

    }
    scoreDisplay.innerHTML = "SCORE: "+score;
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

            nMap[jacmanObject.yCoord][jacmanObject.xCoord] = 1;
            document.getElementById("game-box").style.gridTemplateColumns = "repeat(" + nMap[0].length + ",24px)";
            document.getElementById("game-box").style.gridTemplateRows = "repeat(" + nMap.length + ",24px)";
            
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

function jacmanMove()
{
    const newX = jacmanObject.xCoord + jacmanObject.xDirection, newY = jacmanObject.yCoord + jacmanObject.yDirection;

    if (map[newY][newX] != 4) {
        if (newX <= -1 || newX >= map[0].length)//loops around map
        {
            map[jacmanObject.yCoord][jacmanObject.xCoord] = 0;
            jacmanObject.xCoord = (newX + map[0].length) % map[0].length;
            map[jacmanObject.yCoord][jacmanObject.xCoord] = 1;
        }
        else {

            if (map[newY][newX] === 2)//pellet
            {
                score += 10;
            }
            else if (map[newY][newX] === 3)//big pellet
            {
                score += 50;
            }

            map[jacmanObject.yCoord][jacmanObject.xCoord] = 0;
            jacmanObject.xCoord = newX;
            jacmanObject.yCoord = newY;

            //nothing happens for path

            
            map[jacmanObject.yCoord][jacmanObject.xCoord] = 1;
        }

    }
    drawMap();
}

function main() {
    document.addEventListener("keydown", onKeyPress);
    setInterval(jacmanMove, 200);
    drawMap();
}

const initJacX = 14, initJacY = 23;
let jacmanObject = new Jacman(initJacX, initJacY);

const pelletSprite = standardiseSprite(); pelletSprite.src = "sprites/Pellet1.png";
const bigPelletSprite = standardiseSprite(); bigPelletSprite.src = "sprites/Pellet2.png";
let pelletCount = 0;

let map = loadMap();

let score = 0;
const scoreDisplay = document.getElementById("score");

let gameBox = document.getElementById("game-box");
main();
