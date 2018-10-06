const equal = require('deep-equal');
// this module needs to access the database and get old data
// needs to select which are adds and which are updates etc
// for the Irish water API there's a clear key field
// this might not be true of other data

// at the moment this just returns the events. It assumes data is a single object with
// no further children

export enum EventType {
  AddEvent = 1,
  UpdateEvent,
  DeleteEvent,
}

export type EventValues = Map<string, any>
export class TransactionEvent {
  private typeVal: EventType;
  private valuesVal: EventValues;
  private keyVal: string;
  constructor(type: EventType, key: string,  values: EventValues) {
    this.typeVal = type;
    this.keyVal = key;
    this.valuesVal = values;
  }

  public type(): EventType {
    return this.typeVal; 
  }

  public values(): EventValues {
    return this.valuesVal
  }

  public key(): string {
    return this.keyVal
  }
}

export function newAddEvent(key: string, values: EventValues) : TransactionEvent {
  return new TransactionEvent(EventType.AddEvent, key, values);
}

export function newUpdateEvent(key: string, values: EventValues) : TransactionEvent {
  return new TransactionEvent(EventType.UpdateEvent, key, values);
}

export function newDeleteEvent(key: string) : TransactionEvent {
  return new TransactionEvent(EventType.DeleteEvent, key, null);
}

export class Transaction {
  public addEvents: TransactionEvent[];
  public deleteEvents: TransactionEvent[];
  public updateEvents: TransactionEvent[];
  constructor() {
    this.addEvents = [];
    this.deleteEvents = [];
    this.updateEvents = [];
  }

  // we may update this function in future to specify only the fields modified
  // and their new values
  addUpdateEvent(key: string, value: EventValues) {
    this.updateEvents.push(newUpdateEvent(key, value));
  }

  addDeleteEvent(key: string) {
    // sometimes an undefined key makes it in here. I'm not sure why yet
    if (key !== undefined && key !== 'undefined') {
      this.deleteEvents.push(newDeleteEvent(key));
    }
  }

  addAddEvent(key: string, value: EventValues) {
    this.addEvents.push(newAddEvent(key, value));
  }

  getEvents(evType: EventType): TransactionEvent[] {
    if (evType == EventType.AddEvent) {
      return this.addEvents;
    }
    if (evType == EventType.DeleteEvent) {
      return this.deleteEvents;
    }
    if (evType == EventType.UpdateEvent) {
      return this.updateEvents;
    }
  }

  asObject(): Object {
    const txn = {
      addEvents: [],
      removeEvents: [],
      updateEvents: []
    }
    console.log("length is: " + this.addEvents.length);
    txn.addEvents = this.addEvents.map((ev: TransactionEvent) => {
      return {
        key: ev.key(),
        data: ev.values()
      }
    });
    txn.removeEvents = this.deleteEvents.map((ev: TransactionEvent) => {
      return {
        key: ev.key(),
        data: ev.values()
      }
    });
    txn.updateEvents = this.updateEvents.map((ev: TransactionEvent) => {
      return {
        key: ev.key(),
        data: ev.values()
      }
    });
    return txn;
  }
}

export function createKeyedTree(keyField: string, jsonData: Object[], parseFunction: (input: Object) => Object) {
  // cycle through the JSON data and fetch the keyed field
    const newObj = {};
    const newData = jsonData.map((i: Object) => {
      if (parseFunction != null) {
        i = parseFunction(i);
      }
      newObj[i[keyField]] = i;
      return newObj;
    });
    return newData;
}

export function getUniqueKeys(a: string[], b: string[]): string[] {
  const seen = new Set<string>();
  // get keys that are in a but not in b, and vice versa
  return a.concat(b).filter((k) => {
    if (seen.has(k)) {
      return false;
    }

    seen.add(k);
    return true;
  });
}

export function createTransactionDiff(oldData: Object, newData: Object): Transaction {
  const transaction = new Transaction();
  const keys: string[] = getUniqueKeys(Object.keys(oldData), Object.keys(newData));

  keys.forEach((k) => {
    // removed case
    if (oldData[k] && !newData[k]) {
      transaction.addDeleteEvent(k);
      return;
    }

    if (!oldData[k] && newData[k]) {
      transaction.addAddEvent(k, newData[k]);
      return;
    }

    // at this point there's a potential that the values differ
    if (oldData[k] && newData[k]) {
      const oldKeys = Object.getOwnPropertyNames(oldData[k]).sort();
      const newKeys = Object.getOwnPropertyNames(newData[k]).sort();
      let eq: boolean = true;

      if (equal(oldKeys, newKeys)) {
        for (let i = 0; i < newKeys.length; i++) {
          const prop = newKeys[i];
          eq = equal(oldData[k][prop], newData[k][prop]);
          if (!eq) {
            break;
          }
        }
      }

      if (!eq) {
        transaction.addUpdateEvent(k, newData[k]);
      }
    }
  });
  return transaction;
}

// for javascript tests
module.exports = {
  transactionEvent: TransactionEvent,
  eventType: EventType,
  keyedTree: createKeyedTree,
  getDiff: createTransactionDiff
};
