// This function checks map when called
'use strict';

function checkAndUpdate() {
    // these variables are for pseudo nmos circuit
    nmosNand = 0;
    pmosNand = 0;
    listOutput[0].voltage = 0;
    // if any vdd is connected to any pmos store voltage
    for (let i = 0; i < listVdd.length; i++) {
        for (let j = 0; j < listPmos.length; j++) {
            const svgElement = listVdd[i].id.concat("$", listPmos[j].id);
            if (connectionMap.has(svgElement)) {
                listPmos[j].voltage = 5;
            }
        }
    }

    // if any ground is connected to any pmos store voltage
    for (let i = 0; i < listGround.length; i++) {
        for (let j = 0; j < listPmos.length; j++) {
            const svgElement = listGround[i].id.concat("$", listPmos[j].id);
            if (connectionMap.has(svgElement)) {
                listPmos[j].voltage = -5;
            }
        }
    }

    // if amy vdd is connected to nmos store that voltage
    for (let i = 0; i < listVdd.length; i++) {
        for (let j = 0; j < listNmos.length; j++) {
            const svgElement = listVdd[i].id.concat("$", listNmos[j].id);
            if (connectionMap.has(svgElement)) {
                listNmos[j].voltage = 5;
            }
        }
    }

    for (let i = 0; i < listGround.length; i++) {
        for (let j = 0; j < listNmos.length; j++) {
            const svgElement = listGround[i].id.concat("$", listNmos[j].id);
            if (connectionMap.has(svgElement)) {
                listNmos[j].voltage = -5;
            }
        }
    }

    for (let i = 0; i < listInput.length; i++) {
        for (let j = 0; j < listPmos.length; j++) {
            const svgElement = listInput[i].id.concat("$", listPmos[j].id);
            if (connectionMap.has(svgElement)) {
                if (listInput[i].input === 0) {
                    if (listPmos[j].voltage === 5) {
                        listPmos[j].outVoltage = 5;
                    } else {
                        if (listPmos[j].voltage === 0) {
                            listPmos[j].outVoltage = 9;
                        } else {
                            listPmos[j].outVoltage = -5;
                        }
                    }
                    listPmos[j].outTerminal = 1;
                } else {
                    listPmos[j].outTerminal = -1;
                    listPmos[j].outVoltage = 0;
                }
            }
        }
    }

    for (let i = 0; i < listInput.length; i++) {
        for (let j = 0; j < listNmos.length; j++) {
            const svgElement = listInput[i].id.concat("$", listNmos[j].id);
            // check if connectionMap have the given nmos input connection
            if (connectionMap.has(svgElement)) {
                listNmos[j].midTerminal = 1;
                // if input signal is one
                if (listInput[i].input === 1) {
                    if (listNmos[j].voltage === -5) {
                        listNmos[j].outVoltage = -5;
                    } else {
                        if (listNmos[j].voltage === 0) {
                            listNmos[j].outVoltage = -9;
                        } else {
                            listNmos[j].outVoltage = 5;
                        }
                    }
                    listNmos[j].outTerminal = 1;
                } else {
                    listNmos[j].outTerminal = 0;
                    listNmos[j].midTerminal = 1;
                }
            } else { // no carrying of voltage
                listNmos[j].midTerminal = 0;
            }
        }
    }

    for (let i = 0; i < listPmos.length; i++) {
        for (let j = 0; j < listOutput.length; j++) {
            const svgElement = listPmos[i].id.concat("$", listOutput[j].id);
            if (connectionMap.has(svgElement)) {
                if (listPmos[i].outTerminal === 1) {
                    listOutput[j].voltage = listPmos[i].outVoltage;
                    pmosNand++;
                }
                if (listPmos[i].outTerminal === -1) {
                    listOutput[j].voltage = listPmos[i].outVoltage;
                }
            }
        }
    }
    // if any nmos is connected to output then the voltages are propogated based on input signals
    for (let i = 0; i < listNmos.length; i++) {
        for (let j = 0; j < listOutput.length; j++) {
            const svgElement = listNmos[i].id.concat("$", listOutput[j].id);
            if (connectionMap.has(svgElement)) {
                // if nmos 
                if (listNmos[i].outTerminal === 1) {
                    listOutput[j].voltage = listNmos[i].outVoltage;
                    nmosNand++;
                }
            }
        }
    }
}

function getTruthValue() {
    const out = listOutput[0].voltage
    const xorIsValid = checkXor()
    const xnorIsValid = checkXnor()
    if (listInput[0].input === 0 && listInput[1].input === 1 && xorIsValid === 1) {
        return "1";
    } else if (listInput[0].input === 1 && listInput[1].input === 0 && xorIsValid === 1) {
        return "1";
    } else if (listInput[0].input === 0 && listInput[1].input === 0 && xnorIsValid === 1) {
        return "1";
    } else if (listInput[0].input === 1 && listInput[1].input === 1 && xnorIsValid === 1) {
        return "1";
    }
    if (out === 5 || out === 9) {
        return "1";
    } else if (out === -5 || out === -9) {
        return "0";
    } else {
        return "-";
    }
}