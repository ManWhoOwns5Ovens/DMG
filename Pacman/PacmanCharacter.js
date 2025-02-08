class PacmanCharacter {
    constructor(nX,nY) {
        this.xDirection = 0;
        this.yDirection = 0;
        this.xBufferDirection = 0;
        this.yBufferDirection = 0;
        this.xCoord = nX;
        this.yCoord = nY;
        this.originalPacSprite = null;
        this.PacSprite = null;
    }

    resetBuffers() {
        this.xBufferDirection = 0;
        this.yBufferDirection = 0;
    }

    changeSprite(modifier) {
        this.PacSprite = this.originalPacSprite;
        this.PacSprite.style.transform = modifier;
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
        this.originalPacSprite=nSprite;
        this.originalPacSprite.style.transform="scaleX(-1)";
        this.PacSprite=this.originalPacSprite;
    }
   
}

export default PacmanCharacter;
