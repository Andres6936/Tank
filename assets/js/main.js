"use strict";

class Tank {

    constructor() {
        this.levelOfLiquidInTank = 5;

        this.maximumLevelOfLiquid = 10;
        this.minimumLevelOfLiquid = 0;

        this.setPoint = 5;

        this.alarmForHighLevel = 0;
        this.alarmForLowLevel = 0;
    }

    addLevelOfLiquid(){
        this.levelOfLiquidInTank++;
        this.updatedLabelLevelTank();
    }

    subLevelOfLiquid(){
        this.levelOfLiquidInTank--;
        this.updatedLabelLevelTank();
    }

    updatedLabelLevelTank(){
        let label = document.getElementById("label-level-tank");

        // Update the label of level of liquid in tank.
        label.innerText = this.levelOfLiquidInTank;
    }
}

var tank = new Tank();

function updateAllLabels() {
    let input = document.getElementById("input-set-point");

    input.setAttribute("value", tank.setPoint);
}

function addLevelOfLiquidInTank() {
    tank.addLevelOfLiquid();
}

function subLevelOfLiquidInTank() {
    tank.subLevelOfLiquid();
}

function checkSetPointOfTank() {
    let input = document.getElementById("input-set-point");
}