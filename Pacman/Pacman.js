//0- empty
//1-pacman
//2-pellet
//3-big pellet
//4-wall
//5-ghost
import PacmanCharacter from "./PacmanCharacter.js";
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
            switch (map[i][j])
            {
                case 0:
                    newDiv.classList.add("path");
                    break;
                case 4:
                    newDiv.classList.add("wall");
                    break;
                case 2:
                    newDiv.appendChild(pelletSprite.cloneNode(true));
                    break;
                case 3:
                    newDiv.appendChild(bigPelletSprite.cloneNode(true));
                    break;
                case 5:
                    newDiv.appendChild(redGhostObject.ghostSprite.cloneNode(true));
                    break;
                case 1:
                    newDiv.appendChild(jacmanObject.JacSprite.cloneNode(true));
                    break;
            }

            gameBox.appendChild(newDiv);
        }

    }
    scoreDisplay.innerHTML = "SCORE: "+score;
}

function loadMap() {
    const fileName = "mapData.txt";
    let nMap = [];

    return fetch(fileName)
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

            return nMap;
            
        })

        .catch(error => {
            console.error("Error loading the file:", error);
        });



    
    
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
    if(map[jacmanObject.yCoord][jacmanObject.xCoord]!==5)
    {
        map[jacmanObject.yCoord][jacmanObject.xCoord]=0 ;
        jacmanObject.xCoord = nX;
        jacmanObject.yCoord = nY;
        map[jacmanObject.yCoord][jacmanObject.xCoord] = 1;
    }
    if(ghostMode==="chase"){redGhostObject.changeTarget(jacmanObject.xCoord,jacmanObject.yCoord);}
    
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
}

function checkForGameOver(){
for(let i=0; i<allGhosts.length;i++)
{
    if(allGhosts[i].xCoord===jacmanObject.xCoord && allGhosts[i].yCoord===jacmanObject.yCoord)
        {
            document.getElementById("game-box").style.display="none";
            document.getElementById("game-over").innerHTML="GAME OVER";
            document.getElementById("restart-button").style.display="block";
            document.getElementById("restart-button").onclick=function(){location.reload();};
        }
}
}


function moveGhost(ghostObject,nX,nY){

    if (nX <= -1 || nX >= map[0].length)//loops around map
    {
        nX = (nX + map[0].length) % map[0].length;
    }
    map[ghostObject.yCoord][ghostObject.xCoord]=ghostObject.onTop;
    ghostObject.xCoord=nX;
    ghostObject.yCoord=nY;
    ghostObject.onTop=map[nY][nX];
    map[nY][nX]=5;
    ghostObject.changeTarget();
    checkForGameOver(ghostObject);
}



function ghostFindValidMoves(possibleDirections, ghostObject) {
    let validMoves = [];

    for (let i = 0; i < possibleDirections.length; i++) {
        if (typeof(map[possibleDirections[i][0] + ghostObject.yCoord]) !== 'undefined' && possibleDirections[i] != null) {
            if (map[possibleDirections[i][0] + ghostObject.yCoord][possibleDirections[i][1] + ghostObject.xCoord] !== 4) {
                if ((possibleDirections[i][0] !== 0 && possibleDirections[i][0] !== -ghostObject.yDirection) ||
                    (possibleDirections[i][1] !== 0 && possibleDirections[i][1] !== -ghostObject.xDirection)) {
                    validMoves.push(possibleDirections[i]);
                }
            }
        }
    }
    return validMoves;
}


function ghostMovement(ghostObject){
    const specialTiles=[[11,12],[11,15],[23,12],[23,15]];

    specialTiles.forEach(tile => {
        if((tile[1]=== ghostObject.xCoord && tile[0]=== ghostObject.yCoord && ghostObject.yDirection===0))
        {
            moveGhost(ghostObject,ghostObject.xCoord+ghostObject.xDirection,ghostObject.yCoord+ghostObject.yDirection);
            return;
        }
    });

    const possibleDirections=[[1,0],[-1,0],[0,-1],[0,1]];//down,up,left,right 
    let validMoves=ghostFindValidMoves(possibleDirections,ghostObject);

    if(validMoves.length>1)
    {
        let temp1=squared(ghostObject.targetY-(ghostObject.yCoord+validMoves[0][0]))+squared(ghostObject.targetX-(ghostObject.xCoord+validMoves[0][1]));
        let temp2=squared(ghostObject.targetY-(ghostObject.yCoord+validMoves[1][0]))+squared(ghostObject.targetX-(ghostObject.xCoord+validMoves[1][1]));

        if(temp1>=temp2)

        {
            ghostObject.changeDirection(validMoves[1][1],validMoves[1][0]);
            moveGhost(ghostObject,validMoves[1][1]+ghostObject.xCoord,validMoves[1][0]+ghostObject.yCoord);
        }
        else
        {
            ghostObject.changeDirection(validMoves[0][1],validMoves[0][0]);
            moveGhost(ghostObject,validMoves[0][1]+ghostObject.xCoord,validMoves[0][0]+ghostObject.yCoord);
        }
    }
    else if(typeof(validMoves[0])!=="undefined")
    {
        ghostObject.changeDirection(validMoves[0][1],validMoves[0][0]);
        moveGhost(ghostObject,validMoves[0][1]+ghostObject.xCoord,validMoves[0][0]+ghostObject.yCoord);
    }

}

function modeSwitchTimer(){
    if(ghostMode==="chase")
    {
        ghostMode="scatter";
        changeToScatter();
    }
    else
    {
        ghostMode="chase";
        //changeToChase();
    }
}

function changeToChase(){
    redGhostObject.changeTarget(jacmanObject.xCoord,jacmanObject.yCoord);
    setTimeout(modeSwitchTimer, 20000);
}

function changeToScatter(){
    redGhostObject.changeTarget(27,1);
    setTimeout(modeSwitchTimer, 7000);
}


function program() {
    loadMap().then(loadedMap => {
        map = loadedMap;
        document.addEventListener("keydown", onKeyPress);

        setInterval(() => ghostMovement(redGhostObject), 250);
        redGhostObject.changeTarget(jacmanObject.xCoord,jacmanObject.yCoord);

        setInterval(jacmanMovement, 200);

        setInterval(drawMap,200);

        changeToChase();
    });
}




let ghostMode="chase";

const initJacX = 14, initJacY = 23;
let jacmanObject = new PacmanCharacter(initJacX, initJacY);
jacmanObject.setUpSprite(standardiseSprite("sprites/Pacman_Anim.gif"));


let redGhostObject= new Ghost(13,11);
redGhostObject.setUpSprite(standardiseSprite("sprites/Red_Ghost_GIF.gif"));
const allGhosts=[redGhostObject];


const pelletSprite = standardiseSprite("sprites/Pellet1.png");
const bigPelletSprite = standardiseSprite("sprites/Pellet2.png"); 
let pelletCount = 0;

let map = [];

let score = 0;
const scoreDisplay = document.getElementById("score");

let gameBox = document.getElementById("game-box");
program();