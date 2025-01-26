//0- empty
//1-pacman
//2-pellet
//3-big pellet
//4-wall
//5-ghost
import Jacman from "./JacmanObject.js";
import Ghost from "./Ghost.js";


function standardiseSprite(sourceLocation){
    let pSprite = document.createElement("img");
    pSprite.src = sourceLocation;
    pSprite.style.width = "24px";
    pSprite.style.height = "auto";
    return pSprite;
}

function squared(x){return x*x;}

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
            else if (map[i][j] === 5) {
                newDiv.appendChild(redGhostObject.ghostSprite.cloneNode(true));
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
            nMap[redGhostObject.yCoord][redGhostObject.xCoord]= 5;
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
            jacmanObject.changeDirection(0,-1,"rotate(90deg)");
            break;
        case "ArrowDown":
            jacmanObject.changeDirection(0,1,"rotate(270deg)");
            break;
        case "ArrowRight":
            jacmanObject.changeDirection(1,0,"scaleX(-1)");
            break;
        case "ArrowLeft":
            jacmanObject.changeDirection(-1,0,"scaleX(1)");
            break;
    }
}

function moveJac(nX,nY) { 
    map[jacmanObject.yCoord][jacmanObject.xCoord]=0 ;
    jacmanObject.xCoord = nX;
    jacmanObject.yCoord = nY;
    map[jacmanObject.yCoord][jacmanObject.xCoord] = 1;
}

function jacmanMovement() {
    let newX = jacmanObject.xCoord + jacmanObject.xDirection;
    let newY = jacmanObject.yCoord + jacmanObject.yDirection;

    if (map[newY][newX] != 4) {
        jacmanObject.resetBuffers();
        if (newX <= -1 || newX >= map[0].length)//loops around map
        {
            newX = (newX + map[0].length) % map[0].length;
            moveJac(newX, newY);
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

            moveJac(newX,newY);

            //nothing happens for path
        }
    }
    else if (map[newY][newX] === 4)
    {

        newX = jacmanObject.xCoord + jacmanObject.xBufferDirection;
        newY = jacmanObject.yCoord + jacmanObject.yBufferDirection;

        if (map[newY][newX] === 4) {
            jacmanObject.resetBuffers();
        }
        else
        {
            moveJac(newX, newY);
        }
        
    }

    drawMap();
}

function moveGhost(ghostObject,nX,nY){
    map[ghostObject.yCoord][ghostObject.xCoord]=ghostObject.onTop;
    ghostObject.xCoord=nX;
    ghostObject.yCoord=nY;
    ghostObject.onTop=map[nY][nX];
    map[nY][nX]=5;
    checkForGameOver(ghostObject);
}



function checkForGameOver(ghostObject){
    if(ghostObject.xCoord===jacmanObject.xCoord && ghostObject.yCoord===jacmanObject.yCoord)
        {
            console.log("GAME OVER");
        }
}

function ghostMovement(ghostObject){
    const specialTiles=[[11,12],[11,15],[23,12],[23,15]];
    let newX=ghostObject.xCoord+ghostObject.xDirection;
    let newY=ghostObject.yCoord+ghostObject.yDirection;

    specialTiles.forEach(element => {
        if(element[1]=== ghostObject.xCoord && element[0]=== ghostObject.yCoord)
        {
            moveGhost(ghostObject,newX,newY);
            return;
        }
    });

    const possibleDirections=[[1,0],[-1,0],[0,-1],[0,1]];//down,up,left,right
    let validMoves=[];


    for(let i=0; i< possibleDirections.length;i++)
    {
        if (typeof(map[possibleDirections[i][0]+ghostObject.yDirection]) !== 'undefined') {
            if(map[possibleDirections[i][0]+ghostObject.yDirection][possibleDirections[i][1]+ghostObject.xDirection]!==4 ||
                (possibleDirections[i][0]!==0-ghostObject.yDirection && possibleDirections[i][1]!== 0-ghostObject.xDirection))
            {
                validMoves.push(possibleDirections[i]);
            }
        }
        
    }

    console.log(validMoves.length);

    if(validMoves.length>1)
    {
        let temp1=squared(jacmanObject.yCoord-(ghostObject.yCoord+validMoves[0][0]))+squared(jacmanObject.xCoord-(ghostObject.xCoord+validMoves[0][1]));
        let temp2=squared(jacmanObject.yCoord-(ghostObject.yCoord+validMoves[1][0]))+squared(jacmanObject.xCoord-(ghostObject.xCoord+validMoves[1][1]));

        if(temp1>=temp2)
        {
            ghostObject.changeDirection(validMoves[0][1],validMoves[0][0]);
            moveGhost(ghostObject,validMoves[0][1]+ghostObject.xCoord,validMoves[0][0]+ghostObject.yCoord);
        }
        else
        {
            ghostObject.changeDirection(validMoves[1][1],validMoves[1][0]);
            moveGhost(ghostObject,validMoves[1][1]+ghostObject.xCoord,validMoves[1][0]+ghostObject.yCoord);
        }
    }
    else if(typeof(validMoves[0])!=="undefined")
    {
        moveGhost(ghostObject,validMoves[0][1]+ghostObject.xCoord,validMoves[0][0]+ghostObject.yCoord);
    }

}

function program() {
    document.addEventListener("keydown", onKeyPress);

    redGhostObject.startChase(jacmanObject.yCoord,jacmanObject.xCoord);
    setInterval(ghostMovement(redGhostObject),200);

    setInterval(jacmanMovement, 200);

    drawMap();
}

let ghostMode="chase";

const initJacX = 14, initJacY = 23;
let jacmanObject = new Jacman(initJacX, initJacY);
jacmanObject.setUpSprite(standardiseSprite("sprites/jacman.gif"));

let redGhostObject= new Ghost(13,11);
redGhostObject.setUpSprite(standardiseSprite("sprites/Red_Ghost_GIF.gif"));

const pelletSprite = standardiseSprite("sprites/Pellet1.png");
const bigPelletSprite = standardiseSprite("sprites/Pellet2.png"); 
let pelletCount = 0;

let map = loadMap();

let score = 0;
const scoreDisplay = document.getElementById("score");

let gameBox = document.getElementById("game-box");
program();