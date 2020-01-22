"use strict";

class Tank {

    constructor() {
        this.levelOfLiquidInTank = 5;

        this.maximumLevelOfLiquid = 10;
        this.minimumLevelOfLiquid = 0;

        this.setPoint = 5;

        this.alarmForHighLevel = 8;
        this.alarmForLowLevel = 2;
    }

    addLevelOfLiquid(){
        this.levelOfLiquidInTank++;

        // Reverse the situation in case of that level of
        // liquid is more to maximum level
        if (this.levelOfLiquidInTank > this.maximumLevelOfLiquid){
            this.levelOfLiquidInTank--;
        }

        this.updatedLabelLevelTank();
    }

    subLevelOfLiquid(){
        this.levelOfLiquidInTank--;

        // Reverse the situation in case of that level of
        // liquid is more to maximum level
        if (this.levelOfLiquidInTank < this.minimumLevelOfLiquid){
            this.levelOfLiquidInTank++;
        }

        this.updatedLabelLevelTank();
    }

    setSetPointOfTank(_setPoint){
        this.setPoint = _setPoint;
    }

    setMaximumLevelOfLiquid(_level){
        this.maximumLevelOfLiquid = _level;
    }

    setMinimumLevelOfLiquid(_level){
        this.minimumLevelOfLiquid = _level;
    }

    setHighLevelAlarm(_level){
        this.alarmForHighLevel = _level;
    }

    setLowLevelAlarm(_level){
        this.alarmForLowLevel = _level;
    }

    updatedLabelLevelTank(){
        let label = document.getElementById("label-level-tank");

        // Update the label of level of liquid in tank.
        label.innerText = this.levelOfLiquidInTank;
    }

    updateLabelCapacity(){
        let inputMax = document.getElementById("input-max-level");
        inputMax.value = this.maximumLevelOfLiquid;

        let inputMin = document.getElementById("input-min-level");
        inputMin.value = this.minimumLevelOfLiquid;
    }

    updateLabelAlarm(){
        let inputHighAlarm = document.getElementById("input-high-level-alarm");
        inputHighAlarm.setAttribute("max", this.maximumLevelOfLiquid);
        inputHighAlarm.setAttribute("min", this.minimumLevelOfLiquid);
        inputHighAlarm.value = this.alarmForHighLevel;

        let inputLowAlarm = document.getElementById("input-low-level-alarm");
        inputLowAlarm.setAttribute("max", this.maximumLevelOfLiquid);
        inputLowAlarm.setAttribute("min", this.minimumLevelOfLiquid);
        inputLowAlarm.value = this.alarmForLowLevel;
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

function confirmChangeInCapacityAndAlarm(){
    // Init with capacity
    let maxCapacity = document.getElementById("input-max-level").value;
    let minCapacity = document.getElementById("input-min-level").value;

    tank.setMaximumLevelOfLiquid(maxCapacity);
    tank.setMinimumLevelOfLiquid(minCapacity);

    // Init with alarm
    let highAlarm = document.getElementById("input-high-level-alarm").value;
    let lowAlarm = document.getElementById("input-low-level-alarm").value;

    tank.setHighLevelAlarm(highAlarm);
    tank.setLowLevelAlarm(lowAlarm);

    // Update All Labels
    updateAllLabels();
}

function cancelChangesInCapacityAndAlarm(){
    updateAllLabels();
}

// When load the page, call the
// function for update all labels.
window.onload = function () {
    updateAllLabels();
};