"use strict";
var FIRST_ROW = 0, LAST_ROW = 8, FIRST_COL = 0, LAST_COL = 5;
var MOVE_LEFT = "-52px", MOVE_RIGHT = "52px", MOVE_UP = "-52px", MOVE_DOWN = "52px";
var TOTAL_COL = 6, TOTAL_ROW = 9;
var UP = 1, DOWN = 4, LEFT = 2, RIGHT = 8;
var curPlayer = 0;
var totalNumberOfPlayer = 2;
var colorAllowed = ["green", "red"];
var curMovingImages = [];
var intervalID = [];
var moving = false;
var TIMETOMOVE = 20;
function loadGameBoard() {
    var cell;
    var loadChecks = "";
    for (var row = 0; row < TOTAL_ROW; row++) {
        for (var col = 0; col < TOTAL_COL; col++) {
            cell = document.createElement("DIV");
            cell.userID = -1;
            cell.mass = 0;
            cell.criticalMass = 0;
            cell.validDirection = 0;
            if (row != FIRST_COL) {
                cell.criticalMass++;
                cell.validDirection |= UP;
            }
            if (col != FIRST_ROW) {
                cell.criticalMass++;
                cell.validDirection |= LEFT;
            }
            if (row != LAST_ROW) {
                cell.criticalMass++;
                cell.validDirection |= DOWN;
            }
            if (col != LAST_COL) {
                cell.criticalMass++;
                cell.validDirection |= RIGHT;
            }
            if (col == 0) {
                cell.classList.add("clearLeft");
            }
            document.getElementById("ID_gameBoard").appendChild(cell);
        }
    }
}
function addimage(event) {
    var curClick;
    var ok;
    if (event.target.tagName == "IMG") {
        curClick = event.target.parentNode;
    } else {
        curClick = event.target;
    }
    if (curClick.userID == -1 || curClick.userID == curPlayer) {
        addMassToinTheCell(curClick);

        if (!moving) {
            curPlayer++;

            if (curPlayer == totalNumberOfPlayer) {
                curPlayer = 0;
            }
            document.getElementById("qwer").innerHTML = curPlayer;
            //Change the grid color
            var grid = document.querySelectorAll(".gameBoard>div");
            for (var i = 0; i < grid.length; i++) {
                grid[i].style.borderColor = colorAllowed[curPlayer];
            }
        }

    }
}

function addMassToinTheCell(curClick) {
    var imageSrc;

    var image;
    var curCell;
    var curMovingImageIndex = 0;
    curClick.userID = curPlayer;
    curClick.mass++;
    imageSrc = "Resource/Obj-" + curClick.userID + "-" + curClick.mass + ".gif";
    if (curClick.mass == 1) {
        image = createSingleNewImage();
        curClick.appendChild(image);
        curClick.childNodes[0].setAttribute("src", imageSrc);
    }
    else if (curClick.mass == curClick.criticalMass) {
        curClick.removeChild(curClick.childNodes[0]);
        imageSrc = "Resource/Obj-" + curPlayer + "-1.gif";
        //Create Four new Images 
        for (var i = 0; i < curClick.criticalMass; i++) {
            curClick.appendChild(createSingleNewImage());
            curClick.childNodes[i].setAttribute("src", imageSrc);

        }
        curMovingImages.push(curClick);
        while (curMovingImages.length != 0) {
            moving = true;
            curCell = curMovingImages.shift();
            intervalID[getCurElementNumber(curClick)] = setInterval(function () { moveTheMass(curCell) }, TIMETOMOVE);
        }
       curClick.mass = 0;
    }
    else {
        curClick.childNodes[0].setAttribute("src", imageSrc);
    }
}

function createSingleNewImage() {
    var image = document.createElement("IMG");
    image.steps = 0;
    image.direction;
    // image.moving = false;
    return image;
}
function moveTheMass(curClick) {
    var i = 0;
   
    if (curClick.children[0].steps > 54) {

        resetCurrentCell(curClick);
        if ((curClick.validDirection & UP) == UP) {
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) - TOTAL_COL]);
        }
        if ((curClick.validDirection & LEFT) == LEFT) {
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) - 1]);
        }
        if ((curClick.validDirection & DOWN) == DOWN) {
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) + TOTAL_COL]);
        }
        if ((curClick.validDirection & RIGHT) == RIGHT) {
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) + 1]);
        }
        if (!moving) {
            curPlayer++;

            if (curPlayer == totalNumberOfPlayer) {
                curPlayer = 0;
            }
            document.getElementById("qwer").innerHTML = curPlayer;
            //Change the grid color
            var grid = document.querySelectorAll(".gameBoard>div");
            for (var i = 0; i < grid.length; i++) {
                grid[i].style.borderColor = colorAllowed[curPlayer];
            }
        }
    }else{
        if ((curClick.validDirection & UP) == UP) {
            curClick.children[i].style.top = -(curClick.children[i].steps += 2) + "px";
            i++;
        }
        if ((curClick.validDirection & LEFT) == LEFT) {
            curClick.children[i].style.left = -(curClick.children[i].steps += 2) + "px";
            i++;
        }
        if ((curClick.validDirection & DOWN) == DOWN) {
            curClick.children[i].style.top = (curClick.children[i].steps += 2) + "px";
            i++;
        }
        if ((curClick.validDirection & RIGHT) == RIGHT) {
            curClick.children[i].style.left = (curClick.children[i].steps += 2) + "px";
            i++;
        }
    }
}
function getCurElementNumber(curClick) {
    var childCollection = curClick.parentNode.children;
    for (var i = 0; i < childCollection.length; i++) {
        if (childCollection[i] == curClick) {
            return i;
        }
    }
}
function resetCurrentCell(curClick) {
    var child;
    for (var i = 0; i < curClick.criticalMass; i++) {
        curClick.removeChild(curClick.children[0]);
    }
    moving = false;
    curClick.userID = -1;
    clearInterval(intervalID[getCurElementNumber(curClick)]);
}