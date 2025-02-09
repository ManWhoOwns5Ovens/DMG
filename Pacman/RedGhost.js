import Ghost from "./Ghost.js";
class RedGhost extends Ghost{
    constructor(xCoord,yCoord,ID){
        super(xCoord,yCoord,ID);
        this.isElroy=false;
    }
}

export default RedGhost;