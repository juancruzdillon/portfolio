export class MapGenerator {
    constructor(rows = 22, cols = 19) {
        this.rows = rows;
        this.cols = cols;
        this.midCol = Math.floor(cols / 2);
        
        this.ghR1 = Math.floor(rows / 2) - 2;
        this.ghR2 = Math.floor(rows / 2);
        this.ghC1 = this.midCol - 2;
        this.ghC2 = this.midCol + 2;
    }

    generate() {
        this.map = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.buildGhostHouse();
        this.carveMaze(1, 1);
        this.connectGhostHouse();
        this.removeDeadEnds();
        this.createLoops(0.2);
        this.buildTunnels();
        this.forceCenterConnections();
        this.mirrorMap();
        return this.getSpawnsAndMap();
    }

    buildGhostHouse() {
        for (let r = this.ghR1; r <= this.ghR2; r++) {
            for (let c = this.ghC1; c <= this.ghC2; c++) {
                this.map[r][c] = 2; // 2 = empty space
            }
        }
    }

    carveMaze(startR, startC) {
        const stack = [{ r: startR, c: startC }];
        this.map[startR][startC] = 1;

        while (stack.length > 0) {
            const idx = Math.random() < 0.6 ? stack.length - 1 : Math.floor(Math.random() * stack.length);
            const { r, c } = stack[idx];
            const neighbors = this.getValidNeighbors(r, c);
            
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.map[next.r][next.c] = 1;
                this.map[next.wallR][next.wallC] = 1;
                stack.push({ r: next.r, c: next.c });
            } else {
                stack.splice(idx, 1);
            }
        }
    }

    getValidNeighbors(r, c) {
        const neighbors = [];
        const dirs = [[-2, 0], [2, 0], [0, -2], [0, 2]];
        for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr > 0 && nr < this.rows - 1 && nc > 0 && nc <= this.midCol) {
                if (this.map[nr][nc] === 0) {
                    const wallR = r + dr / 2;
                    const wallC = c + dc / 2;
                    if (this.isGhostHouse(nr, nc) || this.isGhostHouse(wallR, wallC)) continue;
                    neighbors.push({ r: nr, c: nc, wallR, wallC });
                }
            }
        }
        return neighbors;
    }

    isGhostHouse(r, c) {
        return r >= this.ghR1 && r <= this.ghR2 && c >= this.ghC1 && c <= this.midCol;
    }

    connectGhostHouse() {
        // Door at top of ghost house
        let doorR = this.ghR1 - 1;
        this.map[doorR][this.midCol] = 2; 
        
        let pathR = doorR - 1;
        while(pathR > 0 && this.map[pathR][this.midCol] === 0 && this.map[pathR][this.midCol - 1] === 0) {
            this.map[pathR][this.midCol] = 1;
            pathR--;
        }
    }

    removeDeadEnds() {
        let maxPasses = 3;
        while(maxPasses > 0) {
            maxPasses--;
            for (let r = 1; r < this.rows - 1; r++) {
                for (let c = 1; c <= this.midCol; c++) {
                    if (this.map[r][c] === 1) {
                        let walls = [];
                        if (this.map[r-1][c] === 0) walls.push({r: -1, c: 0});
                        if (this.map[r+1][c] === 0) walls.push({r: 1, c: 0});
                        if (this.map[r][c-1] === 0) walls.push({r: 0, c: -1});
                        if (this.map[r][c+1] === 0) walls.push({r: 0, c: 1});
                        
                        if (walls.length >= 3) {
                            let validDirs = walls.filter(w => !this.isGhostHouse(r + w.r, c + w.c));
                            if(validDirs.length > 0) {
                                let d = validDirs[Math.floor(Math.random() * validDirs.length)];
                                let cr = r + d.r;
                                let cc = c + d.c;
                                while(cr > 0 && cr < this.rows-1 && cc > 0 && cc <= this.midCol && this.map[cr][cc] === 0 && !this.isGhostHouse(cr, cc)) {
                                    this.map[cr][cc] = 1;
                                    cr += d.r;
                                    cc += d.c;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    createLoops(chance) {
        for (let r = 2; r < this.rows - 2; r++) {
            for (let c = 2; c <= this.midCol; c++) {
                if (this.map[r][c] === 0 && !this.isGhostHouse(r, c)) {
                    const isHorizWall = (this.map[r][c-1] >= 1 && this.map[r][c+1] >= 1 && this.map[r-1][c] === 0 && this.map[r+1][c] === 0);
                    const isVertWall = (this.map[r-1][c] >= 1 && this.map[r+1][c] >= 1 && this.map[r][c-1] === 0 && this.map[r][c+1] === 0);
                    if ((isHorizWall || isVertWall) && Math.random() < chance) {
                        this.map[r][c] = 1;
                    }
                }
            }
        }
        for(let r = 1; r < this.rows - 1; r += 4) {
            if(this.map[r][this.midCol - 1] === 1 && !this.isGhostHouse(r, this.midCol)) {
                this.map[r][this.midCol] = 1;
            }
        }
    }

    buildTunnels() {
        const tunnelR = Math.floor(this.rows / 2) - 1;
        for(let c = 0; c < 3; c++) {
            this.map[tunnelR][c] = 2; // path without pellet
        }
        this.map[tunnelR][3] = 1;
        
        let cLocal = 4;
        while(cLocal <= this.midCol && this.map[tunnelR][cLocal] === 0) {
            this.map[tunnelR][cLocal] = 1;
            cLocal++;
        }
    }

    forceCenterConnections() {
        for (let r = 2; r < this.rows - 2; r += 2) {
            if (this.map[r][this.midCol - 1] >= 1 && !this.isGhostHouse(r, this.midCol)) {
                this.map[r][this.midCol] = 1; 
            }
        }
        if (!this.isGhostHouse(this.ghR1 - 1, this.midCol)) this.map[this.ghR1 - 1][this.midCol] = 1;
        if (!this.isGhostHouse(this.ghR2 + 1, this.midCol)) this.map[this.ghR2 + 1][this.midCol] = 1;
    }

    mirrorMap() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.midCol; c++) {
                this.map[r][this.cols - 1 - c] = this.map[r][c];
            }
        }
    }

    getSpawnsAndMap() {
        let pR = this.rows - 2;
        let pC = this.midCol;
        let found = false;
        // Search safe player spawn upwards from bottom-middle
        for (let r = this.rows - 2; r > this.ghR2 + 1; r--) {
            if (this.map[r][this.midCol] > 0) {
                pR = r; pC = this.midCol; this.map[r][this.midCol] = 2; found = true; break;
            }
        }
        if(!found) {
            outer: for(let r = this.rows - 2; r > this.ghR2 + 1; r--) {
                for(let dc = 0; dc < this.midCol; dc++) {
                    if(this.map[r][this.midCol - dc] > 0) { pR = r; pC = this.midCol - dc; this.map[r][pC] = 2; found = true; break outer; }
                    if(this.map[r][this.midCol + dc] > 0) { pR = r; pC = this.midCol + dc; this.map[r][pC] = 2; found = true; break outer; }
                }
            }
        }
        
        return {
            map: this.map,
            playerStart: { r: pR, c: pC },
            ghostStarts: [
                { r: this.ghR1 + 1, c: this.midCol - 1, color: '#ef4444', delay: 0 },
                { r: this.ghR1 + 1, c: this.midCol + 1, color: '#f472b6', delay: 2000 },
                { r: this.ghR1 + 2, c: this.midCol - 1, color: '#06b6d4', delay: 4000 },
                { r: this.ghR1 + 2, c: this.midCol + 1, color: '#f97316', delay: 6000 }
            ]
        };
    }
}
