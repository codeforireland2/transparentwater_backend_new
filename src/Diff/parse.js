const equal = require('deep-equal');
// this module needs to access the database and get old data
// needs to select which are adds and which are updates etc
// for the Irish water API there's a clear key field
// this might not be true of other data

// at the moment this just returns the events. It assumes data is a single object with
// no further children
class TransactionEvents {
  constructor() {
    this.updateEvents = [];
    this.removeEvents = [];
    this.addEvents = [];
  }

  // we may update this function in future to specify only the fields modified
  // and their new values
  addUpdateEvent(key, value) {
    this.updateEvents.push({
      key: key,
      data: value
    });
  }

  addRemoveEvent(key) {
    // sometimes an undefined key makes it in here. I'm not sure why yet
    if (key !== undefined && key !== 'undefined') {
      this.removeEvents.push({
        key: key,
        data: null
      });
    }
  }

  addAddEvent(key, value) {
    this.addEvents.push({
      key: key,
      data: value
    });
  }

  get getObject() {
    return {
      addEvents: this.addEvents,
      removeEvents: this.removeEvents,
      updateEvents: this.updateEvents
    };
  }
}

function createKeyedTree(jsonData, parseFunction) {
  // cycle through the JSON data and fetch the keyed field
  return parseFunction(jsonData);
}

function getUniqueKeys(a, b) {
  const seen = {};
  return a.concat(b).filter((k) => {
    if (seen[k]) {
      return false;
    }

    seen[k] = true;
    return true;
  });
}

function createTransactionDiff(oldData, newData) {
  const transaction = new TransactionEvents();
  const keys = getUniqueKeys(Object.keys(oldData), Object.keys(newData));

  keys.forEach((k) => {
    // removed case
    if (oldData[k] && !newData[k]) {
      transaction.addRemoveEvent(k);
    }

    if (!oldData[k] && newData[k]) {
      transaction.addAddEvent(k, newData[k]);
    }

    // at this point there's a potential that the values differ
    if (oldData[k] && newData[k]) {
      const oldKeys = Object.getOwnPropertyNames(oldData[k]).sort();
      const newKeys = Object.getOwnPropertyNames(newData[k]).sort();
      let eq = true;

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
  return transaction.getObject;
}

module.exports = {
  keyedTree: createKeyedTree,
  getDiff: createTransactionDiff
};
