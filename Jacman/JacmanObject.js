export default class Jacman{
    constructor(nX,nY) {
        this.xDirection = 0;
        this.yDirection = 0;
        this.xBufferDirection = 0;
        this.yBufferDirection = 0;
        this.xCoord = nX;
        this.yCoord = nY;
        this.originalJacSprite = null;
        this.JacSprite = null;
    }

    resetBuffers() {
        this.xBufferDirection = 0;
        this.yBufferDirection = 0;
    }

    changeSprite(modifier) {
        this.JacSprite = this.originalJacSprite;
        this.JacSprite.style.transform = modifier;
    }

    nextDirection() {
        this.xBufferDirection = this.xDirection;
        this.yBufferDirection = this.yDirection;
    }

    changeDirection(nX, nY, modifier) {
        this.nextDirection();
        this.xDirection = nX;
        this.yDirection = nY;
        this.changeSprite(modifier);
    }

    setUpSprite(nSprite)
    {
        this.originalJacSprite=nSprite;
        this.originalJacSprite.style.transform="scaleX(-1)";
        this.JacSprite=this.originalJacSprite;
    }
}
