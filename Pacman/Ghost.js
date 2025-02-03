class Ghost {
    constructor(nX, nY) {
        this.xCoord = nX;
        this.yCoord = nY;
        this.xDirection = -1;
        this.yDirection = 0;
        this.targetX=nX;
        this.targetY=nY;
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