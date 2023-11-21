const math = require('mathjs');
const pow = math.pow;
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


function decToBin(decimal) {
    return (decimal >>> 0).toString(2);
}

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
        s = modulus(((3 * x1 * x1 + a) * modInverse((2*y1), p)), p);
        // console.log("s: ", s);
    } else {
        s = modulus(((y2 - y1) * modInverse((x2 - x1), p)), p);
        // console.log("s: ", s);
    }

    const x3 = modulus(((s * s) - x1 - x2), p);
    const y3 = modulus((s * (x1 - x3) - y1), p);

    return [x3, y3];
};

const apply_add_point_method = (G, k, p, a) => {
    var target_point = G;
    const k_binary = decToBin(k);

    for (var i = 1; i < k_binary.length; i++) {
        var current_bit = parseInt(k_binary[i]);
        // console.log("current_bit: ", current_bit);
        target_point = add_point(target_point, target_point, p, a);
        // console.log("targetPoint: ", target_point);

        if (current_bit === 1) {
            target_point = add_point(target_point, G, p, a);
            // console.log("targetPoint: ", target_point);
        }
    }

    return target_point;
}


// Base variables
var p = 17, a = 2, b = 2, q = 19, d = 7;
var A = [5, 1];
const hm = 26;
const r = 10;

// const checkPoint = apply_add_point_method(A, r, p, a);
// console.log("checkpoint: 10G: ", checkPoint);

//signature
const third_point1 = apply_add_point_method(A, r, p, a);
console.log("third point 1: ",third_point1);

const s1 = modulus(third_point1[0], q);
const s2 = modulus(((hm + d * s1) * modInverse(r, q)), q);

console.log(s1, s2);


//verification
const A1 = modulus((hm * modInverse(s2, q)), q);
const B1 = modulus((modInverse(s2, q) * s1), q);

const B = [0,6]

const u1 = apply_add_point_method(A, A1, p, a);
const u2 = apply_add_point_method(B, B1, p, a);

const third_point2 = add_point(u1, u2, p, a);
console.log("third Point2: ",third_point2);

// var temp_point = A;
// for (var i = 1; i < q; i++) {
//     temp_point = add_point(temp_point, A, p, a);
//     console.log(`${i + 1}G = [${temp_point}]`);
// }

// const G19 = apply_add_point_method(A, 19, p, a);

// console.log(G19);