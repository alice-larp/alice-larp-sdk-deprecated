import { SyncEvent } from 'alice-model-engine-api';

import { Config } from './config';
import { DBConnectorInterface, DBInterface, Document } from './db/interface';

export function eventStorageFactory(config: Config, dbConnector: DBConnectorInterface) {
  return new EventStorage(dbConnector.use(config.db.events));
}

export class EventStorage {
  constructor(private db: DBInterface) { }

  public async range(characterId: string, since: number, till: number): Promise<Document[]> {
    if (since >= till) return [];

    const startkey = [characterId, Number(since)];
    const endkey = [characterId, Number(till)];
    const params = {
      startkey,
      endkey,
      reduce: false,
      include_docs: true,
      inclusive_end: true,
    };

    const result = await this.db.view('character', 'by-character-id', params);

    return result.rows.map((r: any) => r.doc);
  }

  public async removeOlderThan(characterId: string, till: number): Promise<void> {
    const docs = await this.range(characterId, 0, till);
    await Promise.all(docs.map((doc) => {
      if (doc._rev)
        this.db.remove(doc._id, doc._rev);
    }));
  }

  public async lastRefresh(characterId: string): Promise<SyncEvent | null> {
    const result = await this.db.view('character', 'last-refresh-event', { key: characterId, reduce: true });

    if (result.rows.length) {
      return result.rows[0].value;
    } else {
      return null;
    }
  }

  public async listLastRefresh(): Promise<SyncEvent[]> {
    const result = await this.db.view('character', 'last-refresh-event', { reduce: true, group: true });
    return result.rows.map((r) => r.value);
  }

  public store(event: any) {
    event.timestamp = Number(event.timestamp);
    return this.db.put(event);
  }
}
