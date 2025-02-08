class Ghost {
    constructor(xCoord,yCoord,ID) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.ID=ID;
        this.xDirection = -1;
        this.yDirection = 0;
        this.targetX=xCoord;
        this.targetY=yCoord;
        this.onTop=0;
        this.ghostSprite = null;
    }

    changeTarget(targetX,targetY) {
        this.targetX=targetX;
        this.targetY=targetY;
    }

    reverseDirection()
    {
        this.xDirection= 0- this.xDirection;
        this.yDirection= 0- this.yDirection;
    }

    changeDirection(nX,nY)
    {
        this.xDirection=nX;
        this.yDirection=nY;
    }

    setUpSprite(nSprite)
    {
        this.ghostSprite=nSprite;
    }
}

export default Ghost;