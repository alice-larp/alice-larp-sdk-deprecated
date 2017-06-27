import * as Path from 'path';
import { Worker } from 'deus-model-engine/lib/worker';
import { Config } from 'deus-model-engine/lib/config';

let WORKER_INSTANCE: Worker | null = null;

export function getWorker() {
    if (WORKER_INSTANCE) return WORKER_INSTANCE;

    const catalogsPath = Path.resolve(__dirname, '../catalogs');
    const modelsPath = Path.resolve(__dirname, '../src');

    const config = Config.load(catalogsPath);
    return WORKER_INSTANCE = Worker.load(modelsPath).configure(config);
}

export function process(model: any, events: any) {
    return getWorker().process(model, events);
}
