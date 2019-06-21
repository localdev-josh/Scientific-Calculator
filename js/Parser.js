shift_on = false;
ins = [];
_syntax = [];

function AddValue(str) {
    let val = str.toString();
    let pk = peek(ins);
    if (pk === null || pk === undefined) {
        ins.push(val);
    } else if (pk.includes(".") || isDigit(pk)) {
        ins.push(ins.pop().toString() + val);
    } else if (pk === "-" || pk === "+") {
        let dp = ins[ins.length - 2];
        if (dp === undefined || dp === null || dp === "(" || isOperator(dp) || dp[dp.length - 1] === "(") {
            ins.push(ins.pop().toString() + val);
        } else {
            ins.push(str);
        }
    } else {
        ins.push(str);
    }
    _isnegated = false;
    display();
}


function handleTrig(trig) {
    if (shift_on) {
        switch (trig.substring(0, 3)) {
            case "sin":
                ins.push(trigs[7]);
                break;
            case "cos":
                ins.push(trigs[6]);
                break;
            case "tan":
                ins.push(trigs[8]);
                break;
        }
    } else {
        for (i = 0; i < 6; i++) {
            let temp = trigs[i].substring(0, trigs[i].length - 1);
            if (trig === temp) {
                ins.push(trigs[i]);
                break;
            }
        }
    }
    _isnegated = false;
    display();
}

//operators handler
function handleOperator(op) {
    for (let i = 0; i < Ops.length; i++) {
        if (Ops[i] === op) {
            ins.push(Ops[i]);
        }
    }
    _isnegated = false;
    display();
}

//constants control handler
function handleConst(constant) {
    if (shift_on && constant === "eⁿ") {
        ins.push("e(");
    } else {
        ins.push(constant);
    }
    _isnegated = false;
    display();
}

//point or float sign control//
function AddPoint(str) {
    let peek = ins[ins.length - 1];
    if (peek === null || peek === undefined) {
        ins.push(str);
    } else if (!peek.includes(".")) {
        if (isOperand(peek)) {
            ins.push(ins.pop().toString() + str);
        } else {
            ins.push(str);
        }
    }
    _isnegated = false;
    display();
}

//braces control handler
function AddBrace(str) {
    ins.push(str);
    display();
}

_isnegated = false;

//negator --- denagator
function negate() {
    let current = peek(ins);

    function getNegationValue() {
        let val = `${ins[ins.length - 3]}${ins[ins.length - 2]}${current}`;
        return val.startsWith("(") && val[1] === "-" && val.endsWith(")") && _isnegated;
    }

    if (isOperand(current) && !_isnegated) {

        let cur = "-" + ins.pop();
        ins.push("(");
        ins.push(cur);
        ins.push(")");
        _isnegated = true;
    } else if (_isnegated && getNegationValue()) {
        ins.pop();
        let k = ins.pop();
        k = k.substring(1, k.length);
        ins.pop();
        ins.push(k);
        _isnegated = false;
    }
    display();
}

function resolveConsts() {
    let _const = ["e", "π"];

    for (i = 0; i < ins.length; i++) {
        let curr = ins[i];
        if (_const.includes(curr)) {
            if (isOperand(ins[i - 1]) || ins[i - 1] === ")") {
                ins.splice(i, 0, "x");
                ins[i + 1] = (curr === _const[0]) ? Math.E : Math.PI;
            } else if (ins[i - 1] === "-" || ins[i - 1] === "+") {
                let dp = ins[i - 2];
                if (dp === undefined || dp === null || dp === "(" || isOperator(dp) || dp[dp.length - 1] === "(") {
                    let op = ins[i - 1];
                    ins.splice(i - 1, 2, op + ((curr === _const[0]) ? Math.E : Math.PI));
                }
            }
        }
    }
}

function Evaluate() {
    resolveConsts();
    let output = parseToPostfix(ins);
    let result = Eval(output);
    ins = [];
    ins.push(result);
    _isnegated = false;
    display();
}

function Shift() {
    let sb = document.getElementById("to_shift");
    let _sin = document.getElementById("sin");
    let _cos = document.getElementById("cos");
    let _tan = document.getElementById("tan");
    let _e = document.getElementById("exp");

    if (shift_on === true) {
        _sin.value = "sin";
        _cos.value = "cos";
        _tan.value = "tan";
        _e.value = "e";
        sb.style.color = "white";
        sb.style.backgroundColor = "steelblue";
        shift_on = false;
    } else {
        _sin.value = "sin¯¹";
        _cos.value = "cos¯¹";
        _tan.value = "tan¯¹";
        _e.value = "eⁿ";
        sb.style.color = "red";
        sb.style.backgroundColor = "darkblue";
        shift_on = true;
    }
}

//handles deletion//
function Del() {
    let top = peek(ins);
    if (top !== undefined) {
        if (isOperand(top)) {
            let tp = top.substring(0, top.length - 1)
            if (tp === "") {
                ins.pop();
            } else {
                ins.pop();
                ins.push(tp);
            }
        } else {
            ins.pop();
        }
    }
    display();
}

//clears input screen//
function Clear() {
    ins = [];
    _isnegated = false;
    display();
}

function display() {
    let v = ins.join();
    calculator.display.value = st(v).toString();
}

let st = function (v) {
    return v.replace(/,/g, "");
};