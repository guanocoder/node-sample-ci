if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'ci') {
  module.exports = require('./ci');
} else if (process.env.NODE_ENV === 'local_docker') {
  module.exports = require('./local_docker');
} else {
  module.exports = require('./dev');
}
