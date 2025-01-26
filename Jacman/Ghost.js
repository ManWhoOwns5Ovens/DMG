export default class Ghost {
    constructor(nX, nY) {
        this.xCoord = nX;
        this.yCoord = nY;
        this.xDirection = -1;
        this.yDirection = 0;
        this.target = [0, 0];
        this.onTop=0;
        this.ghostSprite = null;
    }

    startChase(jacX,jacY) {
        this.target = [jacY, jacX];
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