"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.times = void 0;
/**
 * Times repeats a function n times
 */
const times = async (n, iteratee) => {
    const rs = [];
    for (let i = 0; i < n; i++) {
        const r = await iteratee(i);
        rs.push(r);
    }
    return rs;
};
exports.times = times;
//# sourceMappingURL=helpers.js.map