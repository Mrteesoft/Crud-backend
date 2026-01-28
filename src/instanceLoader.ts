import { getLogger } from './utils/logger';

const log = getLogger('InstanceLoader');

export async function loadInstances(loaders: Array<{ name: string; init: () => Promise<unknown> | void }>) {
  for (const loader of loaders) {
    const start = Date.now();
    await loader.init();
    log.info('Loaded %s (%dms)', loader.name, Date.now() - start);
  }
}

