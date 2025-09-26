'use strict';
import { connectionMap } from './main.js';

export const jsplumbInstance = jsPlumb.getInstance({
    container: diagram,
    maxConnections: -1,
    endpoint: {
        type: "Dot",
        options: { radius: 7 },
    },
    dragOptions: {
        containment: "parentEnclosed",
        containmentPadding: 5,
    },
    connector: "Flowchart",
    paintStyle: { strokeWidth: 3, stroke: "#456" },
    connectionsDetachable: true,
});

export const wireColours = {"input":"#00ff00","pmos":"#0000ff","nmos":"#bf6be3","vdd":"#ff00ff","ground":"#00ffff"};

jsplumbInstance.bind("ready", function () {
    jsplumbInstance.registerConnectionTypes({
        "red-connection": {
            paintStyle: { stroke: "red", strokeWidth: 3 },
            hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
            connector: "Flowchart"
        }
    });
});

function getWireColor(sourceId)  {
    let tempId = sourceId.slice(0, -1);
    return wireColours[tempId];
}

export function editConnectionMap() {
    connectionMap.clear();
    jsplumbInstance.getAllConnections().forEach(connection => {
        connection.setPaintStyle({
            stroke: getWireColor(connection.sourceId),
            strokeWidth: 3,
        });
        connection.setHoverPaintStyle({
            stroke: getWireColor(connection.sourceId),
            strokeWidth: 8,
        });
        const connectionId = `${connection.sourceId}$${connection.targetId}`;
        connectionMap.set(connectionId, connection.targetId);
    });
}

jsplumbInstance.bind("connection", () => {
    editConnectionMap();
});


const contextMenu = document.getElementById("contextMenu");
const deleteOption = document.getElementById("deleteOption");
const cancelOption = document.getElementById("cancelOption");
let currentConnection = null;

// Show context menu on right-click
jsplumbInstance.bind("contextmenu", function (ci, originalEvent) {
    originalEvent.preventDefault();
    currentConnection = ci;

    // Position and display the context menu
    contextMenu.style.top = `${originalEvent.clientY}px`;
    contextMenu.style.left = `${originalEvent.clientX}px`;
    contextMenu.style.display = "block";
});

// Hide the context menu
document.addEventListener("click", function() {
    contextMenu.style.display = "none";
});
deleteOption.addEventListener("click", function() {
    if (currentConnection) {
        jsplumbInstance.deleteConnection(currentConnection);
        editConnectionMap();
        currentConnection = null;
    }
    contextMenu.style.display = "none";
});

// Handle cancel option
cancelOption.addEventListener("click", function() {
    contextMenu.style.display = "none";
});

export function addInstancePmos(id) {
    addInstance(id, [0.72, 1, 0, 1], -1, true);
    addInstance(id, [0, 0.5, -1, 0], -1, false);
    addInstance(id, [0.72, 0, 0, -1], -1, false);
}

export function addInstanceNmos(id) {
    addInstance(id, [0.72, 1, 0, 1], -1, false);
    addInstance(id, [0, 0.5, -1, 0], -1, false);
    addInstance(id, [0.72, 0, 0, -1], -1, true);
}

export function addInstanceVdd(id) {
    addInstance(id, [0.5, 1, 0, 1], -1, true);
}

export function addInstanceGround(id) {
    addInstance(id, [0.5, 0, 0, -1], -1, true);
}

export function addInstanceFinalInput(id) {
    addInstance(id, [1, 0.5, 1, 0], -1, true);
}

export function addInstanceFinalOutput(id) {
    addInstance(id, [0, 0.5, -1, 0], -1, false);
}

export function addInstance(id, position, num, src) {
    jsplumbInstance.addEndpoint(id, {
        endpoint: ["Dot", { radius: 5 }],
        anchor: position,
        isTarget: !src,
        isSource: src,
        maxConnections: num,
        connectionType: "red-connection"
    });
}

// top -> [0.5, 0, 0, -1]
// bottom -> [ 0.5, 1, 0, 1 ]
// right -> [1, 0.5, 1, 0]
// left -> [0, 0.5, -1, 0]