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
    checkForGameOver(ghostObject);
}



function ghostFindValidMoves(possibleDirections,ghostObject){
    let validMoves=[];

    for(let i=0; i< possibleDirections.length;i++)
    {
        if (typeof(map[possibleDirections[i][0]+ghostObject.yCoord]) !== 'undefined' && possibleDirections[i]!=null) {
            if((map[possibleDirections[i][0]+ghostObject.yCoord][possibleDirections[i][1]+ghostObject.xCoord]!==4) && (possibleDirections[i][0]!== 0-ghostObject.yDirection || possibleDirections[i][1]!== 0-ghostObject.xDirection))
            {
                validMoves.push(possibleDirections[i]);
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

    console.log(validMoves.length);

    if(validMoves.length>1)
    {
        let temp1=squared(ghostObject.targetX-(ghostObject.yCoord+validMoves[0][0]))+squared(ghostObject.targetX-(ghostObject.xCoord+validMoves[0][1]));
        let temp2=squared(ghostObject.targetY-(ghostObject.yCoord+validMoves[1][0]))+squared(ghostObject.targetY-(ghostObject.xCoord+validMoves[1][1]));

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
        moveGhost(ghostObject,validMoves[0][1]+ghostObject.xCoord,validMoves[0][0]+ghostObject.yCoord);
    }

}
