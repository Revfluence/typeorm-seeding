"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseLike = exports.getNameOfEntity = void 0;
const getNameOfEntity = (entity) => {
    if (entity instanceof Function) {
        return entity.name;
    }
    else if (entity) {
        return new entity().constructor.name;
    }
    throw new Error('Enity is not defined');
};
exports.getNameOfEntity = getNameOfEntity;
const isPromiseLike = (o) => !!o && (typeof o === 'object' || typeof o === 'function') && typeof o.then === 'function' && !(o instanceof Date);
exports.isPromiseLike = isPromiseLike;
//# sourceMappingURL=factory.util.js.map