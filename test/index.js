
var assert = require('assert');
var save = require('..');
var Metrics = require('metrics');
var Redis = require('redis');

describe('metrics-redis', function () {

  before(function (done) {
    this.redis = Redis.createClient();
    this.redis.select(8, done);
  });

  before(function (done) {
    this.redis.flushdb(done);
  });

  it('should be able to save all the current keys', function (done) {
    var val = 1;
    var date = new Date('1/8/2014');

    new Metrics()
      .use(save(this.redis))
      .set('woo', val, date);

    new Metrics()
      .use(save(this.redis))
      .on('woo', function (m) {
        assert(val, m.from(date));
        done();
      });
  });

  it('should be able to save all the current keys', function (done) {
    new Metrics()
      .use(save(this.redis))
      .set('woo', 1)
      .set('woo', 2)
      .set('la la la', 3);

    new Metrics()
      .use(save(this.redis))
      .on('woo', 'la la la', function (woo, lalala) {
        assert(2, woo.latest());
        assert(3, lalala.latest());
        done();
      });
  });
});
