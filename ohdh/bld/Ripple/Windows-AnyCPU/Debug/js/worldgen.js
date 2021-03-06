﻿/// <reference path="defs.ts"/>
// Basic tile for each grid point on a floor
var GridTile = (function () {
    function GridTile() {
        this.wall = false;
        this.door = false;
        this.type = 0 /* FLOOR */;
    }
    return GridTile;
})();

// Floors in a building, contains a 2d array of GridTiles called grid
var Floor = (function () {
    function Floor(floorSize) {
        this.grid = [];

        for (var j = 0; j <= floorSize; j++) {
            this.grid[j] = [];
            for (var k = 0; k <= floorSize; k++) {
                this.grid[j][k] = new GridTile();
                this.grid[j][k].wall = (j == 0 || j == floorSize) ? true : (k == 0 || k == floorSize) ? true : false;
                this.grid[j][k].type = (j == 0 || j == floorSize) ? 1 /* WALL */ : (k == 0 || k == floorSize) ? 1 /* WALL */ : 0 /* FLOOR */;
            }
        }
        var dir = Math.round(Math.random());
        var x = (dir == 0) ? Math.floor(Math.random() * (((floorSize - 1) / 2) + 1) + (floorSize / 4)) : 1;
        var y = (dir == 1) ? Math.floor(Math.random() * (((floorSize - 1) / 2) + 1) + (floorSize / 4)) : 1;
        this.partition(x, y, dir, floorSize);
    }
    Floor.prototype.partition = function (x, y, dir, floorSize) {
        var length = 0;
        var start = { x: x, y: y };

        // Return if coords are bad
        if (x < 0 || x > floorSize || y < 0 || y > floorSize) {
            console.warn("coords out of bounds");
            return;
        }

        // Return if too small
        var minLength = 3;
        var percent = 2;
        if (dir == 0) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x][y + i].wall)
                    return;
            if (this.grid[x + 1][y + 1].wall || (this.grid[x + 2][y + 1].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y + 1].wall || (this.grid[x - 2][y + 1].wall && (Math.random() * 10) > percent))
                return;
        } else if (dir == 1) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x + i][y].wall)
                    return;
            if (this.grid[x + 1][y + 1].wall || (this.grid[x + 1][y + 2].wall && (Math.random() * 10) > percent) || this.grid[x + 1][y - 1].wall || (this.grid[x + 1][y - 2].wall && (Math.random() * 10) > percent))
                return;
        } else if (dir == 2) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x][y - i].wall)
                    return;
            if (this.grid[x + 1][y - 1].wall || (this.grid[x + 2][y - 1].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y - 1].wall || (this.grid[x - 2][y - 1].wall && (Math.random() * 10) > percent))
                return;
        } else if (dir == 3) {
            for (var i = 0; i < minLength; i++)
                if (this.grid[x - i][y].wall)
                    return;
            if (this.grid[x - 1][y + 1].wall || (this.grid[x - 1][y + 2].wall && (Math.random() * 10) > percent) || this.grid[x - 1][y - 1].wall || (this.grid[x - 1][y - 2].wall && (Math.random() * 10) > percent))
                return;
        }

        while (!this.grid[x][y].wall) {
            this.grid[x][y].wall = !this.grid[x][y].wall;
            this.grid[x][y].type = 1 /* WALL */;

            if (dir == 0)
                y++;
            else if (dir == 1)
                x++;
            else if (dir == 2)
                y--;
            else if (dir == 3)
                x--;

            length++;
        }
        length--; // All of the stuff runs the last time when it's on another wall

        // To move the door if a wall runs into a door (not for spawning from a door)
        if (dir == 0 && (y + 1 < floorSize) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x + 1][y + 1].wall) {
                this.grid[x - 1][y].door = true;
                this.grid[x - 1][y].type = 2 /* DOOR */;
            } else {
                this.grid[x + 1][y].door = true;
                this.grid[x + 1][y].type = 2 /* DOOR */;
            }
        } else if (dir == 1 && (x + 1 < floorSize) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x + 1][y + 1].wall) {
                this.grid[x][y - 1].door = true;
                this.grid[x][y - 1].type = 2 /* DOOR */;
            } else {
                this.grid[x][y + 1].door = true;
                this.grid[x][y + 1].type = 2 /* DOOR */;
            }
        } else if (dir == 2 && (y - 1 > 0) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x + 1][y - 1].wall) {
                this.grid[x - 1][y].door = true;
                this.grid[x - 1][y].type = 2 /* DOOR */;
            } else {
                this.grid[x + 1][y].door = true;
                this.grid[x + 1][y].type = 2 /* DOOR */;
            }
        } else if (dir == 3 && (x - 1 > 0) && this.grid[x][y].door) {
            this.grid[x][y].door = false;
            this.grid[x][y].type = 1 /* WALL */;
            if (this.grid[x - 1][y + 1].wall) {
                this.grid[x][y - 1].door = true;
                this.grid[x][y - 1].type = 2 /* DOOR */;
            } else {
                this.grid[x][y + 1].door = true;
                this.grid[x][y + 1].type = 2 /* DOOR */;
            }
        }

        // Make a door in the middle-ish
        var door1 = Math.floor((Math.random() * (length * (2 / 3))) + (length / 6));
        var door2 = -1;

        // If big enough, take split the wall in half and put the doors on opposite ends
        if (length > floorSize / 2) {
            door1 = Math.floor((Math.random() * ((length / 2) * (2 / 3))) + ((length / 2) / 6));
            door2 = Math.floor((Math.random() * ((length / 2) * (2 / 3))) + ((length / 2) / 6) + (length / 2));
        }

        // Get new coords
        var newCord1 = door1;
        var newCord2 = door1;

        while (newCord1 == door1 || newCord1 == door2) {
            newCord1 = Math.floor((Math.random() * (length * (2 / 3))) + (length / 6));
        }
        while (newCord2 == door1 || newCord2 == door2) {
            newCord2 = Math.floor((Math.random() * (length * (2 / 3))) + (length / 6));
        }

        // Fix values for directions
        if (dir == 2 || dir == 3) {
            newCord1 *= -1;
            newCord2 *= -1;
        }
        if (dir == 2 || dir == 3) {
            door1 *= -1;
            door2 *= -1;
        }

        // Set door
        if (dir == 0 || dir == 2) {
            this.grid[x][start.y + door1].door = true;
            this.grid[x][start.y + door1].type = 2 /* DOOR */;
            if (length > (floorSize * .75)) {
                this.grid[x][start.y + door2].door = true;
                this.grid[x][start.y + door2].type = 2 /* DOOR */;
            } else if (length > (floorSize / 2) && ((Math.random() * 10) > 2.5)) {
                this.grid[x][start.y + door2].door = true;
                this.grid[x][start.y + door2].type = 2 /* DOOR */;
            }
        } else if (dir == 1 || dir == 3) {
            this.grid[start.x + door1][y].door = true;
            this.grid[start.x + door1][y].type = 2 /* DOOR */;
            if (length > (floorSize * .75)) {
                this.grid[start.x + door2][y].door = true;
                this.grid[start.x + door2][y].type = 2 /* DOOR */;
            } else if (length > (floorSize / 2) && ((Math.random() * 10) > 2.5)) {
                this.grid[start.x + door2][y].door = true;
                this.grid[start.x + door2][y].type = 2 /* DOOR */;
            }
        }

        // Do the recursion
        // Recursive x
        if (dir == 0 || dir == 2) {
            // Recurse right
            this.partition(x + 1, start.y + newCord1, 1, floorSize);

            // Recurse left
            this.partition(x - 1, start.y + newCord2, 3, floorSize);
        } else if (dir == 1 || dir == 3) {
            // Recurse up
            this.partition(start.x + newCord1, y + 1, 0, floorSize);

            // Recurse down
            this.partition(start.x + newCord2, y - 1, 2, floorSize);
        }
    };
    return Floor;
})();

// Top level object, post: building complete with floors and rooms
var Building = (function () {
    function Building(floorSize) {
        this.floors = [];
        this.numFloors = (Math.floor(Math.random() * 8)) + 5; // Anywhere from 5-12 floors

        for (var i = 0; i < this.numFloors; i++) {
            this.floors[i] = new Floor(floorSize);
        }

        return this;
    }
    return Building;
})();
//# sourceMappingURL=worldgen.js.map
