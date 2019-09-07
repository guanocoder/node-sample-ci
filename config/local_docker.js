module.exports = {
    googleClientID:
      '964808011168-29vqsooppd769hk90kjbjm5gld0glssb.apps.googleusercontent.com',
    googleClientSecret: 'KnH-rZC23z4fr2CN4ISK4srN',
    mongoURI: 'mongodb://mishima:nzb7o20khYs8C9nt@myatlas-shard-00-00-dcjmw.mongodb.net:27017,myatlas-shard-00-01-dcjmw.mongodb.net:27017,myatlas-shard-00-02-dcjmw.mongodb.net:27017/test?ssl=true&replicaSet=MyAtlas-shard-0&authSource=admin&retryWrites=true&w=majority',
    cookieKey: '123123123',
    redisHost: "redis",
    tests: {
      puppeteerOptions: {
        headless: true,
        args: ['--no-sandbox']
      },
      targetHost: "frontend:3000"
    }
  };