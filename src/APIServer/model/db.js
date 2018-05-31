var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/TWbackend').then(() => {
  console.log("Successfully connected to the database");    
}).catch(err => {
  console.log(err);
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});