"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityFactory = void 0;
const Faker = require("faker");
const factory_util_1 = require("./utils/factory.util");
const log_util_1 = require("./utils/log.util");
const connection_1 = require("./connection");
class EntityFactory {
    constructor(name, entity, factory, context) {
        this.name = name;
        this.entity = entity;
        this.factory = factory;
        this.context = context;
    }
    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    /**
     * This function is used to alter the generated values of entity, before it
     * is persist into the database
     */
    map(mapFunction) {
        this.mapFunction = mapFunction;
        return this;
    }
    /**
     * Make a new entity, but does not persist it
     */
    async make(overrideParams = {}) {
        return this.makeEnity(overrideParams, false);
    }
    /**
     * Create makes a new entity and does persist it
     */
    async create(overrideParams = {}, saveOptions) {
        const dataSource = await (0, connection_1.loadDataSource)();
        if (dataSource && dataSource.isInitialized) {
            const em = dataSource.createEntityManager();
            try {
                const entity = await this.makeEnity(overrideParams, true);
                return await em.save(entity, saveOptions);
            }
            catch (error) {
                const message = 'Could not save entity';
                (0, log_util_1.printError)(message, error);
                throw new Error(message);
            }
        }
        else {
            const message = 'No db connection is given';
            (0, log_util_1.printError)(message);
            throw new Error(message);
        }
    }
    async makeMany(amount, overrideParams = {}) {
        const list = [];
        for (let index = 0; index < amount; index++) {
            list[index] = await this.make(overrideParams);
        }
        return list;
    }
    async createMany(amount, overrideParams = {}, saveOptions) {
        const list = [];
        for (let index = 0; index < amount; index++) {
            list[index] = await this.create(overrideParams, saveOptions);
        }
        return list;
    }
    async seed(overrideParams = {}) {
        (0, log_util_1.printWarning)('The seed() method is deprecated please use the create() method instead');
        return this.create(overrideParams);
    }
    async seedMany(amount, overrideParams = {}) {
        (0, log_util_1.printWarning)('The seedMany() method is deprecated please use the createMany() method instead');
        return this.createMany(amount, overrideParams);
    }
    // -------------------------------------------------------------------------
    // Private Helpers
    // -------------------------------------------------------------------------
    async makeEnity(overrideParams = {}, isSeeding = false) {
        if (!this.factory) {
            throw new Error('Could not found entity');
        }
        let entity = await this.resolveEntity(this.factory(Faker, this.context), isSeeding);
        if (this.mapFunction) {
            entity = await this.mapFunction(entity);
        }
        for (const key in overrideParams) {
            if (overrideParams.hasOwnProperty(key) && overrideParams[key]) {
                entity[key] = overrideParams[key];
            }
        }
        return entity;
    }
    async resolveEntity(entity, isSeeding = false) {
        for (const attribute in entity) {
            if (!entity.hasOwnProperty(attribute)) {
                continue;
            }
            if ((0, factory_util_1.isPromiseLike)(entity[attribute])) {
                entity[attribute] = await entity[attribute];
            }
            if (entity[attribute] &&
                typeof entity[attribute] === 'object' &&
                entity[attribute].constructor.name === EntityFactory.name) {
                const subEntityFactory = entity[attribute];
                try {
                    if (isSeeding) {
                        entity[attribute] = await subEntityFactory.create();
                    }
                    else {
                        entity[attribute] = await subEntityFactory.make();
                    }
                }
                catch (error) {
                    const message = `Could not make ${subEntityFactory.name}`;
                    (0, log_util_1.printError)(message, error);
                    throw new Error(message);
                }
            }
        }
        return entity;
    }
}
exports.EntityFactory = EntityFactory;
//# sourceMappingURL=entity-factory.js.map