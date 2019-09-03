// jest.setTimeout(30000); // how long to wait before automatically failing a test (the default is 5 seconds (5000))

const mongoose = require('mongoose')
const keys = require('../config/keys');

require('../models/User');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });