'use strict';

import { compInput0, compInput1, compInput2, compInput3, compOutput, resetCounts } from "./integrate.js";
import { jsplumbInstance, editConnectionMap } from './components.js';
export const connectionMap = new Map();
export const listPmos = [];
export const listNmos = [];
export const listInput = [];
export const listOutput = [];
export const listGround = [];
export const listVdd = [];
export const listInverter = [];

const container = document.getElementById("diagram");
container.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

const EMPTY = "";

export const currentTab = { XOR: 0, XNOR: 1 }
export let selectedTab = currentTab.XOR
const tabs = document.querySelectorAll('.v-tabs li');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('is-active'));
        tab.classList.add('is-active');

        let parent = tab.parentNode;
        selectedTab = Array.prototype.indexOf.call(parent.children, tab);
        refreshWorkingArea();
    })
})
window.refreshWorkingArea = refreshWorkingArea;

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
    listPmos.length = 0;
    listNmos.length = 0;
    listGround.length = 0;
    listVdd.length = 0;
    listInput.length = 0;
    listOutput.length = 0;
}

export function refreshObservations() {
    // refresh the errors
    document.getElementById("error-container").innerHTML = EMPTY;
    // refresh the output table
    document.getElementById("table-body").innerHTML = EMPTY;
    // refresh result
    document.getElementById("output-box").innerHTML = EMPTY;
}

export function refreshWorkingArea() {
    // to reset the working area
    jsplumbInstance.deleteEveryEndpoint();
    editConnectionMap();

    // to remove all the svgs called in the working area
    emptyList();

    resetCounts();

    compInput0();
    compInput1();
    compInput2();
    compInput3();
    compOutput();
    refreshObservations();
}

refreshWorkingArea();