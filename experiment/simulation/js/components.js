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

jsplumbInstance.bind("ready", function () {
    jsplumbInstance.registerConnectionTypes({
        "red-connection": {
            paintStyle: { stroke: "red", strokeWidth: 3 },
            hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
            connector: "Flowchart"
        }
    });
});

export function editConnectionMap() {
    connectionMap.clear();
    jsplumbInstance.getAllConnections().forEach(connection => {
        const connectionId = `${connection.sourceId}$${connection.targetId}`
        connectionMap.set(connectionId, connection.targetId)
    });
}

jsplumbInstance.bind("connection", () => {
    editConnectionMap();
});

jsplumbInstance.bind("dblclick", function (ci) {
    jsplumbInstance.deleteConnection(ci);
    editConnectionMap();
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