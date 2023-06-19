'use strict';
import { connectionMap, listInput, selectedTab, currentTab } from './main.js';
import { getTruthValue, checkAndUpdate } from './circuit.js';
export function showTruthTable() {
    const tableBody = document.getElementById("table-body");
    const divInput0 = document.getElementById("input0");
    const divInput1 = document.getElementById("input1");
    let initialInput0 = 0;
    let initialInput1 = 0;
    if (divInput0.classList.contains("high")) {
        initialInput0 = 1;
    }
    if (divInput1.classList.contains("high")) {
        initialInput1 = 1;
    }
    if (selectedTab === 0) {
        tableBody.innerHTML = `
            <tr>
                <td>0</td><td>0</td><td>0</td>
            </tr>
            <tr>
                <td>0</td><td>1</td><td>1</td>
            </tr>
            <tr>
                <td>1</td><td>0</td><td>1</td>
            </tr>
            <tr>
                <td>1</td><td>1</td><td>0</td>
            </tr>`;
    } else {
        tableBody.innerHTML = `
            <tr>
                <td>0</td><td>0</td><td>1</td>
            </tr>
            <tr>
                <td>0</td><td>1</td><td>0</td>
            </tr>
            <tr>
                <td>1</td><td>0</td><td>0</td>
            </tr>
            <tr>
                <td>1</td><td>1</td><td>1</td>
            </tr>`;
    }
    let head = `<tr>
    <th colspan="2">Inputs</th>
    <th colspan="1">Observations</th>
    </tr>
    <tr>
        <th>Input 1</th>
        <th>Input 2</th>
        <th>Output</th>
    </tr>`;
    document.getElementById("table-head").innerHTML = head;
    listInput[0].input = initialInput0;
    listInput[1].input = initialInput1;
    listInput[2].input = 1 - initialInput0;
    listInput[3].input = 1 - initialInput1;
    checkAndUpdate();
}

export function modifyOutput() {
    const divOutput0 = document.getElementById("output0");
    divOutput0.innerHTML = 'Output<br>' + getTruthValue();
}

export function permutator(inputArr) {
    const results = [];

    function permute(arr, memo) {
        let currentCase;

        memo = memo || [];

        for (let i = 0; i < arr.length; i++) {
            currentCase = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(currentCase));
            }
            permute(arr.slice(), memo.concat(currentCase));
            arr.splice(i, 0, currentCase[0]);
        }

        return results;
    }

    return permute(inputArr);
}

export function checkConnectionXor(i, j, k, permutatorMap) {
    return connectionMap.has(`input${permutatorMap[i][0]}$pmos${permutatorMap[j][0]}`) && connectionMap.has(`input${permutatorMap[i][1]}$pmos${permutatorMap[j][1]}`) && 
    connectionMap.has(`vdd0$pmos${permutatorMap[j][0]}`) && connectionMap.has(`vdd0$pmos${permutatorMap[j][1]}`) && 
    connectionMap.has(`input${permutatorMap[i][2]}$pmos${permutatorMap[j][2]}`) && connectionMap.has(`input${permutatorMap[i][3]}$pmos${permutatorMap[j][3]}`) && 
    connectionMap.has(`pmos${permutatorMap[j][0]}$pmos${permutatorMap[j][2]}`) && connectionMap.has(`pmos${permutatorMap[j][0]}$pmos${permutatorMap[j][3]}`) && 
    connectionMap.has(`pmos${permutatorMap[j][1]}$pmos${permutatorMap[j][3]}`) && connectionMap.has(`pmos${permutatorMap[j][1]}$pmos${permutatorMap[j][2]}`) && 
    connectionMap.has(`pmos${permutatorMap[j][2]}$output0`) && connectionMap.has(`pmos${permutatorMap[j][3]}$output0`) && 
    (connectionMap.size === 22) && connectionMap.has(`input${permutatorMap[i][0]}$nmos${permutatorMap[k][0]}`) && connectionMap.has(`input${permutatorMap[i][1]}$nmos${permutatorMap[k][2]}`) && 
    connectionMap.has(`ground0$nmos${permutatorMap[k][2]}`) && connectionMap.has(`ground0$nmos${permutatorMap[k][3]}`) && 
    connectionMap.has(`input${permutatorMap[i][2]}$nmos${permutatorMap[k][1]}`) && connectionMap.has(`input${permutatorMap[i][3]}$nmos${permutatorMap[k][3]}`) && 
    connectionMap.has(`nmos${permutatorMap[k][2]}$nmos${permutatorMap[k][0]}`) && connectionMap.has(`nmos${permutatorMap[k][3]}$nmos${permutatorMap[k][1]}`) && 
    connectionMap.has(`nmos${permutatorMap[k][0]}$output0`) && connectionMap.has(`nmos${permutatorMap[k][1]}$output0`);

}

export function checkXor() {
    const permutatorMap = permutator([0, 1, 2, 3]);
    let xorCircuitValid = 0;
    for (let i = 0; i < permutatorMap.length; i++) {
        for (let j = 0; j < permutatorMap.length; j++) {
            for (let k = 0; k < permutatorMap.length; k++) {
                    if(checkConnectionXor(i, j, k, permutatorMap)) {
                    xorCircuitValid = 1;
                    break;
                }
            }
            if (xorCircuitValid === 1) {
                break;
            }
        }
        if (xorCircuitValid === 1) {
            break;
        }
    }
    return xorCircuitValid;
}

export function chackConnectionXnor(i, j, k, permutatorMap) {
    return connectionMap.has(`vdd0$pmos${permutatorMap[j][0]}`) && connectionMap.has(`vdd0$pmos${permutatorMap[j][1]}`) &&
        connectionMap.has(`ground0$nmos${permutatorMap[k][3]}`) && connectionMap.has(`ground0$nmos${permutatorMap[k][2]}`) &&
        connectionMap.has(`nmos${permutatorMap[k][3]}$nmos${permutatorMap[k][1]}`) && connectionMap.has(`nmos${permutatorMap[k][2]}$nmos${permutatorMap[k][0]}`) &&
        connectionMap.has(`pmos${permutatorMap[j][0]}$pmos${permutatorMap[j][3]}`) && connectionMap.has(`pmos${permutatorMap[j][0]}$pmos${permutatorMap[j][2]}`) &&
        connectionMap.has(`pmos${permutatorMap[j][1]}$pmos${permutatorMap[j][3]}`) && connectionMap.has(`pmos${permutatorMap[j][1]}$pmos${permutatorMap[j][2]}`) &&
        connectionMap.has(`pmos${permutatorMap[j][2]}$output0`) && connectionMap.has(`pmos${permutatorMap[j][3]}$output0`) &&
        (connectionMap.size === 22) && connectionMap.has(`nmos${permutatorMap[k][1]}$output0`) && connectionMap.has(`nmos${permutatorMap[k][0]}$output0`) &&
        connectionMap.has(`input${permutatorMap[i][0]}$pmos${permutatorMap[j][0]}`) && connectionMap.has(`input${permutatorMap[i][2]}$pmos${permutatorMap[j][2]}`) &&
        connectionMap.has(`input${permutatorMap[i][1]}$pmos${permutatorMap[j][3]}`) && connectionMap.has(`input${permutatorMap[i][3]}$pmos${permutatorMap[j][1]}`) &&
        connectionMap.has(`input${permutatorMap[i][1]}$nmos${permutatorMap[k][3]}`) && connectionMap.has(`input${permutatorMap[i][3]}$nmos${permutatorMap[k][2]}`) &&
        connectionMap.has(`input${permutatorMap[i][0]}$nmos${permutatorMap[k][0]}`) && connectionMap.has(`input${permutatorMap[i][2]}$nmos${permutatorMap[k][1]}`);
}

export function checkXnor() {
    const permutatorMap = permutator([0, 1, 2, 3]);
    let xnorCircuitValid = 0;
    for (let i = 0; i < permutatorMap.length; i++) {
        for (let j = 0; j < permutatorMap.length; j++) {
            for (let k = 0; k < permutatorMap.length; k++) {
                if (chackConnectionXnor(i, j, k, permutatorMap)) {
                    xnorCircuitValid = 1;
                    break;
                }
            }
            if (xnorCircuitValid === 1) {
                break;
            }
        }
        if (xnorCircuitValid === 1) {
            break;
        }
    }
    return xnorCircuitValid;
}

export function circuitValid() {
    let xorCircuitValid = checkXor();
    let xnorCircuitValid = checkXnor();
    // check if correct xor, xnor gate is made using correct components
    if (selectedTab === currentTab.XOR && xorCircuitValid) {
        changeObservation("&#10004; Circuit is correct", 'text-danger', 'text-success');
        return true;
    } else if (selectedTab === currentTab.XNOR && xnorCircuitValid) {
        changeObservation("&#10004; Circuit is correct", 'text-danger', 'text-success');
        return true;
    } else {
        changeObservation("&#10060; Circuit is incorrect", 'text-success', 'text-danger');
        return false;
    }
}

export function changeObservation(htmlText, removedClass, addedClass) {
    const observationBoxElem = document.getElementById("output-box");
    observationBoxElem.innerHTML = htmlText;
    observationBoxElem.classList.remove(removedClass);
    observationBoxElem.classList.add(addedClass);
}