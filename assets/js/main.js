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

    setSetPointOfTank(_setPoint){
        this.setPoint = _setPoint;
    }

    updatedLabelLevelTank(){
        let label = document.getElementById("label-level-tank");

        // Update the label of level of liquid in tank.
        label.innerText = this.levelOfLiquidInTank;
    }

    updateLabelCapacity(){
        let inputMax = document.getElementById("input-max-level");
        let inputMin = document.getElementById("input-min-level");

        console.log("Called.");
    }

    updateLabelAlarm(){
        let inputHighAlarm = document.getElementById("input-high-level-alarm");
        let inputLowAlarm = document.getElementById("input-low-level-alarm");
    }
}

var tank = new Tank();

function updateAllLabels() {
    tank.updateLabelCapacity();
    tank.updateLabelAlarm();
}

function addLevelOfLiquidInTank() {
    tank.addLevelOfLiquid();
}

function subLevelOfLiquidInTank() {
    tank.subLevelOfLiquid();
}

function setPointOfTank() {
    let value = document.getElementById("input-set-point").value;

    tank.setSetPointOfTank(value);
}

window.onload = function () {
    updateAllLabels();
};