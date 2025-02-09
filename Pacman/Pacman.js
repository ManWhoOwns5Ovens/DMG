//0- empty
//1-pacman
//2-pellet
//3-big pellet
//4-wall
//5-ghost
import PacmanCharacter from "./PacmanCharacter.js";
import Ghost from "./Ghost.js";
import RedGhost from "./RedGhost.js";


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
                case 51:
                    newDiv.appendChild(redGhost.ghostSprite.cloneNode(true));
                    break;
                case 52:
                    newDiv.appendChild(pinkGhost.ghostSprite.cloneNode(true));
                    break;
                case 53:
                    newDiv.appendChild(blueGhost.ghostSprite.cloneNode(true));
                    break;
                case 1:
                    newDiv.appendChild(pacman.PacSprite.cloneNode(true));
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
                    if(nMap[i][j]===2 ||nMap[i][j]===3){pelletsRemaining++;}
                }
            }

            nMap[pacman.yCoord][pacman.xCoord] = 1;
            nMap[redGhost.yCoord][redGhost.xCoord]= 51;
            nMap[pinkGhost.yCoord][pinkGhost.xCoord]= 52;
            nMap[blueGhost.yCoord][blueGhost.xCoord]= 53;
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
            pacman.changeDirection(0,-1,"rotate(90deg)");
            break;
        case "ArrowDown":
            pacman.changeDirection(0,1,"rotate(270deg)");
            break;
        case "ArrowRight":
            pacman.changeDirection(1,0,"scaleX(-1)");
            break;
        case "ArrowLeft":
            pacman.changeDirection(-1,0,"scaleX(1)");
            break;
    }
}

function movePac(nX,nY) { 
    if(map[pacman.yCoord][pacman.xCoord].toString().charAt(0)!=="5")
    {
        map[pacman.yCoord][pacman.xCoord]=0 ;
        pacman.xCoord = nX;
        pacman.yCoord = nY;
        map[pacman.yCoord][pacman.xCoord] = 1;
    }
}

function pacmanMovement() {
    let newX = pacman.xCoord + pacman.xDirection;
    let newY = pacman.yCoord + pacman.yDirection;

    if (map[newY][newX] != 4) {
        pacman.resetBuffers();
        if (newX <= 0 || newX >= map[0].length-1)//loops around map
        {
            newX = (newX + map[0].length) % map[0].length;
        }
        else {
            if (map[newY][newX] === 2)//pellet
            {
                score += 10;
                checkPellets();
            }
            else if (map[newY][newX] === 3)//big pellet
            {
                score += 50;
                checkPellets();
            }
            //nothing happens for path
        }
        movePac(newX, newY);
    }
    else if (map[newY][newX] === 4)
    {
        newX = pacman.xCoord + pacman.xBufferDirection;
        newY = pacman.yCoord + pacman.yBufferDirection;

        if (map[newY][newX] === 4) {
            pacman.resetBuffers();
        }
        else
        {
            movePac(newX, newY);
        }
        
    }
}

function checkForGameOver(){
for(let i=0; i<allGhosts.length;i++){
    if(allGhosts[i].xCoord===pacman.xCoord && allGhosts[i].yCoord===pacman.yCoord)
        {
            console.log("GAME OVER");
            document.getElementById("game-box").style.display="none";
            document.getElementById("game-over").innerHTML="GAME OVER";
            document.getElementById("restart-button").style.display="block";
            document.getElementById("restart-button").onclick=function(){location.reload();};
        }
}
}

function checkPellets(){
    pelletsRemaining--;
    if(pelletsRemaining<=20){
        redGhost.isElroy=true;
        transformRedIntoElroy();
    }
}

function moveGhost(ghostObject,nX,nY){

    if (nX <= -1 || nX >= map[0].length)//loops around map
    {
        nX = (nX + map[0].length) % map[0].length;
    }
    if(ghostObject.onTop.toString().charAt(0)!="5"){map[ghostObject.yCoord][ghostObject.xCoord]=ghostObject.onTop;}
    ghostObject.xCoord=nX;
    ghostObject.yCoord=nY;
    ghostObject.onTop=map[nY][nX];
    map[nY][nX]=ghostObject.ID;
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

function keepGhostsChasingTarget(){
    if(ghostMode==="chase"){
        redGhost.changeTarget(pacman.xCoord,pacman.yCoord);
        pinkGhost.changeTarget(pacman.xCoord+(pacman.xDirection*2), pacman.yCoord+(pacman.yDirection*2));
        
        const bX=(pacman.xCoord+(pacman.xDirection*2))-(redGhost.xCoord-(pacman.xCoord+(pacman.xDirection*2)));
        const bY=(pacman.yCoord+(pacman.yDirection*2))-(redGhost.yCoord-(pacman.yCoord+(pacman.yDirection*2)));
        blueGhost.changeTarget(bX, bY);
    }
}

function changeToChase(){
    ghostMode="chase";
    console.log(ghostMode);
    ghostCycle++;

    setTimeout(changeToScatter, 20000);
}

function changeToScatter(){
    ghostMode="scatter";
    console.log(ghostMode);
    if(!redGhost.isElroy)redGhost.changeTarget(0,0);
    pinkGhost.changeTarget(30,0);
    blueGhost.changeTarget(0,30);

    if(ghostCycle===3 || ghostCycle===4){setTimeout(changeToChase, 5000);}
    else if(ghostCycle<5){setTimeout(changeToChase,7000);}
    
}

function releaseGhost(ghost, time){
    console.log("released");
    map[ghost.yCoord][ghost.xCoord]=0;
    ghost.xCoord=13;
    ghost.yCoord=11;
    map[11][13]=ghost.ID;
    setInterval(function() {ghostMovement(ghost);}, time);
}

function transformRedIntoElroy(){
    clearInterval(redGhostInterval);
    redGhostInterval=setInterval(function(){ghostMovement(redGhost);}, TIME_BETWEEN_FRAMES-(((30-pelletsRemaining)/10)*50));
    console.log("ELROY");
}


function program() {
    loadMap().then(loadedMap => {
        map = loadedMap;
        document.addEventListener("keydown", onKeyPress);


        setInterval(keepGhostsChasingTarget, TIME_BETWEEN_FRAMES+50);
        redGhostInterval=setInterval(() => ghostMovement(redGhost), TIME_BETWEEN_FRAMES+50);
        
        

        setInterval(pacmanMovement, TIME_BETWEEN_FRAMES);

        setInterval(drawMap,TIME_BETWEEN_FRAMES);

        for(let i=1; i<allGhosts.length; i++){ // release ghosts
            setTimeout(function (){releaseGhost(allGhosts[i],TIME_BETWEEN_FRAMES+50);}, 5000+(i*5000));
        }

        setInterval(checkForGameOver, TIME_BETWEEN_FRAMES);
        changeToScatter();
    });
}


const TIME_BETWEEN_FRAMES= 200;

let ghostMode="scatter";
let ghostCycle=1;

const initPacX = 14, initPacY = 23;
let pacman = new PacmanCharacter(initPacX, initPacY);
pacman.setUpSprite(standardiseSprite("sprites/Pacman_Anim.gif"));


let redGhost= new RedGhost(13,11,51);
redGhost.setUpSprite(standardiseSprite("sprites/Red_Ghost.gif"));
let redGhostInterval;

let pinkGhost= new Ghost(13,14,52); 
pinkGhost.setUpSprite(standardiseSprite("sprites/Pink_Ghost.gif"));

let blueGhost= new Ghost(14,14,53);
blueGhost.setUpSprite(standardiseSprite("sprites/Blue_Ghost.gif"));

const allGhosts=[redGhost,pinkGhost,blueGhost];

const pelletSprite = standardiseSprite("sprites/Pellet1.png");
const bigPelletSprite = standardiseSprite("sprites/Pellet2.png"); 
let pelletsRemaining = 0;

let map = [];

let score = 0;
const scoreDisplay = document.getElementById("score");

let gameBox = document.getElementById("game-box");
program();