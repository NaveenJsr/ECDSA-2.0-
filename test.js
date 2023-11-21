const math = require('mathjs');
const bigInt = require("big-integer");

const modInverse = (a, m) => {
    a = ((a % m) + m) % m; // Ensure a is positive
    let m0 = m;
    let x0 = 0;
    let x1 = 1;

    while (a > 1) {
        let q = Math.floor(a / m);
        let t = m;

        m = a % m;
        a = t;

        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    return ((x1 % m0) + m0) % m0;
};

function modulus(a, b) {
    const positiveA = Math.abs(a);
    const positiveB = Math.abs(b);
    const result = positiveA % positiveB;
    return a < 0 ? b - result : result;
}

const add_point = (P, Q, p, a) => {
    const x1 = P[0];
    const y1 = P[1];
    const x2 = Q[0];
    const y2 = Q[1];

    var s;

    if (x1 === x2 && y1 === y2) {
        s = modulus(((3 * x1 * x1 + a) * modInverse((2 * y1), p)), p);
    } else {
        s = modulus(((y2 - y1) * modInverse((x2 - x1 + p), p)), p);
    }

    const x3 = modulus(((s * s) - x1 - x2 + 2 * p), p);
    const y3 = modulus((s * (x1 - x3) - y1 + 2 * p), p);

    return [x3, y3];
};

function decToBin(decimal) {
    return (decimal >>> 0).toString(2);
}

const apply_add_point_method = (G, k, p, a) => {
    var target_point = G;
    const k_binary = decToBin(k);

    for (var i = 1; i < k_binary.length; i++) {
        var current_bit = parseInt(k_binary[i]);

        target_point = add_point(target_point, target_point, p, a);

        if (current_bit === 1) {
            target_point = add_point(target_point, G, p, a);
        }
    }

    return target_point;
}

// Base variables
var p = 17, a = 2, b = 2, q = 19, d = 7;
var A = [5, 1];

var temp_point = A;
for (var i = 1; i < q; i++) {
    temp_point = add_point(temp_point, A, p, a);
    console.log(`${i + 1}G = [${temp_point}]`);
}

const G19 = apply_add_point_method(A, 19, p, a);

console.log(G19);
