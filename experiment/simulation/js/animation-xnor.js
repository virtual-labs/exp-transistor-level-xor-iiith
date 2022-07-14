import { setCoordinates, fillInputDots, objectDisappear, objectAppear, fillColor, setColor, unsetColor } from "./animation-utility.js";
'use strict';

window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed = setSpeed;
window.setInputA = setInputA;
window.setInputB = setInputB;
// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");

// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;

// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;
const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY = "";
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");


const objects = [
    document.getElementById("inputA"),
    document.getElementById("inputABar"),
    document.getElementById("inputB"),
    document.getElementById("inputBBar"),
    document.getElementById("output"),
];
const textInput = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
];
const textOutput = [document.createElementNS(svgns, "text")];
const inputDots = [
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
];
// 1 & 2 are from input A
// 3 & 4 are from input A Bar
// 5 & 6 are from input B
// 7 & 8 are from input B Bar
// 9 & 10 from VDD
// 11 & 12 from GND


let decide = false;
let circuitStarted = false;

function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

//initialise input text
function textIOInit() {
    for (const text of textInput) {
        text.textContent = 2;
    }
}
function outputCoordinates() {
    setCoordinates(892, 425, textOutput[0]);
    svg.append(textOutput[0]);
}

function inputDotsDisappear() {
    for (const inputDot of inputDots) {
        objectDisappear(inputDot);
    }
}
function inputDotsAppear() {
    for (const inputDot of inputDots) {
        objectAppear(inputDot);
    }
}


// function to disappear the output text
function outputDisappear() {
    for (const text of textOutput) {
        objectDisappear(text);
    }
}

function inputTextDisappear() {
    for (const text of textInput) {
        objectDisappear(text);
    }
}

// function to appear the input text
function clearObservation() {
    observ.innerHTML = EMPTY;
}
function allDisappear() {
    inputDotsDisappear();
    outputDisappear();
    inputTextDisappear();
    for (const object of objects) {
        fillColor(object, "#008000");
    }
}


function setInputA() {
    if (textInput[0].textContent !== "0" && timeline.progress() === 0) {
        changeTo0(-7, 529, 0, 0);
        changeTo1(-7, 179, 1, 1);
    }
    else if (textInput[0].textContent !== "1" && timeline.progress() === 0) {
        changeTo1(-7, 529, 0, 0);
        changeTo0(-7, 179, 1, 1);
    }
    setter(textInput[0].textContent, inputDots[0]);
    setter(textInput[0].textContent, inputDots[1]);
    setter(textInput[1].textContent, inputDots[2]);
    setter(textInput[1].textContent, inputDots[3]);
}

function setInputB(){
    if(textInput[2].textContent !== "0" && timeline.progress() === 0){
        changeTo0(-7, 677, 2, 2);
        changeTo1(-7, 327, 3, 3);
    }
    else if(textInput[2].textContent !== "1" && timeline.progress() === 0){
        changeTo1(-7, 677, 2, 2);
        changeTo0(-7, 327, 3, 3);
    }
    setter(textInput[2].textContent, inputDots[4]);
    setter(textInput[2].textContent, inputDots[5]);
    setter(textInput[3].textContent, inputDots[6]);
    setter(textInput[3].textContent, inputDots[7]);
}

function changeTo1(coordinateX, coordinateY, object, textObject) {
    textInput[textObject].textContent = 1;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX, coordinateY, textInput[textObject]);

    fillColor(objects[object], "#03b1fc");
    objectAppear(textInput[textObject]);
    clearObservation();
}

function changeTo0(coordinateX, coordinateY, object, textObject) {
    textInput[textObject].textContent = 0;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX, coordinateY, textInput[textObject]);

    fillColor(objects[object], "#eeeb22");
    objectAppear(textInput[textObject]);
    clearObservation();
}

function reboot() {
    for (const text of textInput) {
        text.textContent = 2;
    }
}
function display() {
    observ.innerHTML = "Simulation has finished. Press Reset to start again";
}
function setter(value, component) {
    //toggles the text content a of input/output component b
    if (value === "1") {
        unsetColor(component);
    }
    else if (value === "0") {
        setColor(component);
    }
}

function setSpeed(speed) {
    if (circuitStarted) {
        timeline.timeScale(parseInt(speed));
        observ.innerHTML = `${speed}x speed`;
    }
}

function restartCircuit() {
    circuitStarted = false;
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    clearObservation();
    decide = false;
    status.innerHTML = "Start";
    observ.innerHTML = "Successfully restored";
    speed.selectedIndex = 0;

}

function simulationStatus() {
    if (!decide) {
        startCircuit();
    }
    else if (decide) {
        stopCircuit();
    }
}
function stopCircuit() {
    if (timeline.time() !== 0 && timeline.progress() !== 1) {
        timeline.pause();
        observ.innerHTML = "Simulation has been stopped.";
        decide = false;
        status.innerHTML = "Start";
        speed.selectedIndex = 0;
    }
    else if (timeline.progress() === 1) {
        observ.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    if (circuitStarted) {
        timeline.play();
        timeline.timeScale(1);
        observ.innerHTML = "Simulation has started";
        decide = true;
        status.innerHTML = "Pause";
        speed.selectedIndex = 0;
    }
    else {
        if (textInput[0].textContent !== "2" && textInput[2].textContent !== "2" ) {
            circuitStarted = true;
            timeline.play();
            timeline.timeScale(1);
            observ.innerHTML = "Simulation has started.";
            decide = true;
            status.innerHTML = "Pause";
            speed.selectedIndex = 0;
        }
        else if(textInput[0].textContent === "2") {
            observ.innerHTML = "Please set the value of input A and A bar to either 0 or 1";
        }
        else if(textInput[2].textContent === "2") {
            observ.innerHTML = "Please set the value of input B and B bar to either 0 or 1";
        }
        else if (timeline.progress() === 1) {
            observ.innerHTML = "Please Restart the simulation";
        }
    }
}

function initInputDots() {
    //sets the coordinates of the input dots
    for (const inputDot of inputDots) {
        fillInputDots(inputDot, 200, 200, 15, "#FF0000");
        svg.append(inputDot);
    }
    setter("1", inputDots[8]);
    setter("1", inputDots[9]);
    setter("0", inputDots[10]);
    setter("0", inputDots[11]);
}

function simulator1() {
    timeline.to(inputDots[0], {
        motionPath: {
            path: "#path0",
            align: "#path0",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[1], {
        motionPath: {
            path: "#path1",
            align: "#path1",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[2], {
        motionPath: {
            path: "#path2",
            align: "#path2",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[3], {
        motionPath: {
            path: "#path3",
            align: "#path3",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[4], {
        motionPath: {
            path: "#path4",
            align: "#path4",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[5], {
        motionPath: {
            path: "#path5",
            align: "#path5",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[6], {
        motionPath: {
            path: "#path6",
            align: "#path6",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[7], {
        motionPath: {
            path: "#path7",
            align: "#path7",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[8], {
        motionPath: {
            path: "#path8",
            align: "#path8",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[9], {
        motionPath: {
            path: "#path9",
            align: "#path9",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[10], {
        motionPath: {
            path: "#path10",
            align: "#path10",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
    timeline.to(inputDots[11], {
        motionPath: {
            path: "#path11",
            align: "#path11",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },

        duration: 10,
        delay: 0,
        repeat: 0,
        repeatDelay: 3,
        yoyo: true,
        ease: "none",
        paused: false,

    }, 0);
}

function simulator2(){
    if(textInput[0].textContent === textInput[2].textContent){
        setter("1", inputDots[0]);
        textOutput[0].textContent = "1";
        objectAppear(inputDots[0]);
        if(textInput[0].textContent === "0"){
            timeline.to(inputDots[0], {
                motionPath: {
                    path: "#path12",
                    align: "#path12",
                    autoRotate: true,
                    alignOrigin: [0.5, 0.5]
                },
        
                duration: 7,
                delay: 11,
                repeat: 0,
                repeatDelay: 3,
                yoyo: true,
                ease: "none",
                paused: false,
        
            }, 0);
        }
        else{
            timeline.to(inputDots[0], {
                motionPath: {
                    path: "#path13",
                    align: "#path13",
                    autoRotate: true,
                    alignOrigin: [0.5, 0.5]
                },
        
                duration: 7,
                delay: 11,
                repeat: 0,
                repeatDelay: 3,
                yoyo: true,
                ease: "none",
                paused: false,
        
            }, 0);
        }
    }
    else{
        setter("0", inputDots[0]);
        objectAppear(inputDots[0]);
        textOutput[0].textContent = "0";
        if(textInput[0].textContent === "1"){
            timeline.to(inputDots[0], {
                motionPath: {
                    path: "#path14",
                    align: "#path14",
                    autoRotate: true,
                    alignOrigin: [0.5, 0.5]
                },
        
                duration: 7,
                delay: 11,
                repeat: 0,
                repeatDelay: 3,
                yoyo: true,
                ease: "none",
                paused: false,
        
            }, 0);
        }
        else{
            timeline.to(inputDots[0], {
                motionPath: {
                    path: "#path15",
                    align: "#path15",
                    autoRotate: true,
                    alignOrigin: [0.5, 0.5]
                },
        
                duration: 7,
                delay: 11,
                repeat: 0,
                repeatDelay: 3,
                yoyo: true,
                ease: "none",
                paused: false,
        
            }, 0);
        }
    }
}

function outputHandler() {
    objectAppear(textOutput[0]);
    setter(textOutput[0].textContent, objects[4]);
}


//execution starts here
let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
textIOInit();
outputCoordinates();
inputDotsDisappear();
initInputDots();
outputDisappear();

timeline.add(inputDotsAppear, 0);
timeline.add(simulator1, 0);
timeline.add(inputDotsDisappear, 11);
timeline.add(simulator2, 11);
timeline.add(inputDotsDisappear, 18);
timeline.add(outputHandler, 18);
timeline.add(display, 18);
timeline.eventCallback("onComplete", display);
timeline.pause();
inputDotsDisappear();