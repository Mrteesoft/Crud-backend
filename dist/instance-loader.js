"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadInstances = loadInstances;
const logger_1 = require("./utils/logger");
const log = (0, logger_1.getLogger)('InstanceLoader');
async function loadInstances(loaders) {
    for (const loader of loaders) {
        const start = Date.now();
        await loader.init();
        log.info('Loaded %s (%dms)', loader.name, Date.now() - start);
    }
}
//# sourceMappingURL=instance-loader.js.map