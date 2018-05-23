const util = require('util');
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
			data: value,
		});
	}

	addRemoveEvent(key) {
		this.removeEvents.push({
			key: key,
			data: null,
		})
	}

	addAddEvent(key, value) {
		this.addEvents.push({
			key: key,
			data: value,
		})
	}

	get getObject() {
		return {
			addEvents: this.addEvents,
			removeEvents: this.removeEvents,
			updateEvents: this.updateEvents
		}
	}
}

const createKeyedTree = function(jsonData, parseFunction) {
	// cycle through the JSON data and fetch the keyed field
	return parseFunction(jsonData);
}

const getUniqueKeys = function(a, b) {
	let seen = {};
	return a.concat(b).filter(function(k) {
		if (seen[k]) {
			return false;
		}

		seen[k] = true;
		return true;
	});

}

const type = function(val) {
	if (val == null) {
		return 'null';
	}

	if (val instanceof Array) {
		return 'array';
	}
	return typeof val; 
}

// const deepEqual = function(a, b) {
// 	if (type(a) != type(b)) {
// 		throw 'Types not equal' + type(a) + 'is not' + type(b);
// 	}

// 	if (type(a) == 'array') {
// 		a.sort();
// 		b.sort();
// 		return a.reduce(function(acc, val) {
// 			console.log("checking " + val)
// 			return deepEqual(a[val], b[val])
// 		});
// 	}

// 	if (type(a) == 'object') {
// 		return Object.keys(a).reduce(function(acc, val) {
// 			return deepEqual(a[val], b[val])
// 		});
// 	}

// 	return a === b;
// }

const createTransactionDiff = function(oldData, newData) {
	const transaction = new TransactionEvents();
	const keys = getUniqueKeys(Object.keys(oldData), Object.keys(newData));

	keys.forEach(function(k) {
	  const inOld = oldData[k] ? true : false;
	  const inNew = newData[k] ? true : false;
	  // removed case
	  if (inOld && !inNew) {
	  	transaction.addRemoveEvent(k);
	  };

	  if (!inOld && inNew) {
	  	transaction.addAddEvent(k, newData[k]);
	  };

	  // at this point there's a potential that the values differ
	  if (inOld && inNew) {
	    if (!util.isDeepStrictEqual(oldData[k], newData[k])) {
	    	transaction.addUpdateEvent(k, newData[k]);
	    }
	  }
	});
	console.log(transaction.getObject);
	return transaction.getObject;

	// get keys from old
	// get keys from new
	// for each key check if in other tree
	// if in old tree and not in new, then add a remove event for that key
	// if not in old tree and is in new, then 
}

module.exports = {
	keyedTree: createKeyedTree,
	getDiff: createTransactionDiff,
}

