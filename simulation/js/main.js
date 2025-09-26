'use strict';

import { compBinaryBit, compBinaryBit_, compInput0, compInput1, compInput2, compInput3, compOutput, resetCounts } from "./integrate.js";
import { jsplumbInstance, editConnectionMap } from './components.js';
export const connectionMap = new Map();
export let listPmos = [];
export let listNmos = [];
export let listInput = [];
export let listOutput = [];
export let listGround = [];
export let listVdd = [];
export let listInverter = [];

const container = document.getElementById("diagram");
container.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

const EMPTY = "";

export const currentTab = { XOR: 0, XNOR: 1, NOT: 2 };
export let selectedTab = currentTab.XOR;
const tabs = document.querySelectorAll('.v-tabs li');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('is-active'));
        tab.classList.add('is-active');

        let parent = tab.parentNode;
        selectedTab = Array.prototype.indexOf.call(parent.children, tab);
        refreshWorkingArea(selectedTab);
        updateInstructions(selectedTab)
    });
});
window.refreshWorkingArea = refreshWorkingArea;

function updateInstructions(selectedTab) {
    if (selectedTab == currentTab.NOT) {
        document.getElementById('task-description').innerHTML = `Instructions<br>Build a NOT gate using a XOR Gate`
    }
    else
    document.getElementById('task-description').innerHTML = `Instructions`

}

function emptyList() {
    for (const pmosElem of listPmos) {
        let elem = document.getElementById(pmosElem.id);
        elem.parentNode.removeChild(elem);
    }
    for (const nmosElem of listNmos) {
        let elem = document.getElementById(nmosElem.id);
        elem.parentNode.removeChild(elem);
    }
    for (const groundElem of listGround) {
        let elem = document.getElementById(groundElem.id);
        elem.parentNode.removeChild(elem);
    }
    for (const vddElem of listVdd) {
        let elem = document.getElementById(vddElem.id);
        elem.parentNode.removeChild(elem);
    }
    for (const inputElem of listInput) {
        let elem = document.getElementById(inputElem.id);
        elem.parentNode.removeChild(elem);
    }
    for (const outputElem of listOutput) {
        let elem = document.getElementById(outputElem.id);
        elem.parentNode.removeChild(elem);
    }
    listPmos = [];
    listNmos = [];
    listInput = [];
    listOutput = [];
    listGround = [];
    listVdd = [];
}

export function refreshObservations() {
    // refresh the errors
    document.getElementById("error-container").innerHTML = EMPTY;
    // refresh the output table
    document.getElementById("table-body").innerHTML = EMPTY;

    document.getElementById("table-head").innerHTML = EMPTY;

    // refresh result
    document.getElementById("output-box").innerHTML = EMPTY;
}

export function refreshWorkingArea(selectedTab) {
    // to reset the working area
    jsplumbInstance.deleteEveryEndpoint();
    editConnectionMap();

    // to remove all the svgs called in the working area
    emptyList();

    resetCounts();

    if (selectedTab == currentTab.NOT) {
        compInput0();
        compBinaryBit();
        compInput2();
        compBinaryBit_();
        compOutput();

    }
    else {
        compInput0();
        compInput1();
        compInput2();
        compInput3();
        compOutput();
    }
    refreshObservations();
}

refreshWorkingArea();