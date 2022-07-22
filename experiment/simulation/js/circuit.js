// This function checks map when called
'use strict';
import {connectionMap, listGround, listVdd, listInput, listOutput, listPmos, listNmos} from './main.js';
import { checkXnor,checkXor } from './xor.js';
export function checkAndUpdate() {
    listOutput[0].voltage = 0;
    // if any vdd is connected to any pmos store voltage
    for(const vdd of listVdd){
        for(const pmos of listPmos){
            const mapElement = vdd.id.concat("$", pmos.id);
            if(connectionMap.has(mapElement)){
                pmos.voltage = 5;
            }
        }
    }

    // if any ground is connected to any pmos store voltage
    for(const ground of listGround){
        for(const pmos of listPmos){
            const mapElement = ground.id.concat("$", pmos.id);
            if(connectionMap.has(mapElement)){
                pmos.voltage = -5;
            }
        }
    }

    // if amy vdd is connected to nmos store that voltage
    for(const vdd of listVdd){
        for(const nmos of listNmos){
            const mapElement = vdd.id.concat("$", nmos.id);
            if(connectionMap.has(mapElement)){
                nmos.voltage = 5;
            }
        }
    }

    for(const ground of listGround){
        for(const nmos of listNmos){
            const mapElement = ground.id.concat("$", nmos.id);
            if(connectionMap.has(mapElement)){
                nmos.voltage = -5;
            }
        }
    }

    for(const input of listInput){
        for(const pmos of listPmos){
            const mapElement = input.id.concat("$", pmos.id);
            if(connectionMap.has(mapElement)){
                if(input.input === 0){
                    if(pmos.voltage === 5){
                        pmos.outVoltage = 5;
                    }else{
                        if(pmos.voltage === 0){
                            pmos.outVoltage = 9;
                        }else{
                            pmos.outVoltage = -5;
                        }
                    }
                    pmos.outTerminal = 1;
                }else{
                    pmos.outTerminal = -1;
                    pmos.outVoltage = 0;
                }
            }
        }
    }

    for(const input of listInput){
        for(const nmos of listNmos){
            const mapElement = input.id.concat("$", nmos.id);
            if(connectionMap.has(mapElement)){
                if(input.input === 1){
                    if(nmos.voltage === -5){
                        nmos.outVoltage = -5;
                    }else{
                        if(nmos.voltage === 0){
                            nmos.outVoltage = -9;
                        }else{
                            nmos.outVoltage = 5;
                        }
                    }
                    nmos.outTerminal = 1;
                }else{
                    nmos.outTerminal = 0;
                    nmos.midTerminal = 1;
                }
            }else{
                nmos.midTerminal = 0;
            }
        }
    }

    for(const pmos of listPmos){
        for(const output of listOutput){
            const mapElement = pmos.id.concat("$", output.id);
            if(connectionMap.has(mapElement)){
                if(pmos.outTerminal === 1){
                    output.voltage = pmos.outVoltage;
                }
                if(pmos.outTerminal === -1){
                    output.voltage = pmos.outVoltage;
                }
            }
        }
    }
    // if any nmos is connected to output then the voltages are propogated based on input signals
    for(const nmos of listNmos){
        for(const output of listOutput){
            const mapElement = nmos.id.concat("$", output.id);
            if(connectionMap.has(mapElement)){
                if(nmos.outTerminal === 1){
                    output.voltage = nmos.outVoltage;
                }
                if(nmos.outTerminal === -1){
                    output.voltage = nmos.outVoltage;
                }
            }
        }
    }
}

export function getTruthValue() {
    const out = listOutput[0].voltage;
    const xorIsValid = checkXor();
    const xnorIsValid = checkXnor();
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