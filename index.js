
var debug = require('debug')('metrics:redis');
var events = require('wildcards');

/**
 * Expose redis metrics plugin.
 *
 * @param {metrics} metrics
 * @return {ExpressApp}
 */

module.exports = function (redis) {
  return function (metrics) {
    var redisSetKey = 'metrics:keys';

    // load all the keys from the redis
    function loadAll() {
      debug('loading all metrics:keys ..');
      redis.smembers(redisSetKey, function (err, keys) {
        if (err) return debug('failed to get %s = %s', redisSetKey, err.stack);
        debug('found %s = %s', redisSetKey, JSON.stringify(keys));
        keys.forEach(load);
      });
    }

    // save all the keys in metrics
    function saveAll() {
      metrics.keys().forEach(function (key) {
        save(key, metrics.get(key).values());
      });
    }

    // listen for metrics key changes
    function listen () {
      events(metrics, '*', function (key, metric) {
        debugger;
        save(key, metric.values());
      });
    }

    // load metric `key` from redis
    function load (key) {
      var redisKey = 'metrics:' + key;
      debug('loading %s ..', redisKey);
      redis.hgetall(redisKey, function (err, obj) {
        debugger;
        if (err) return debug('failed to get %s = %s', redisKey, err.stack);
        debug('loaded redis %s = %s', redisKey, JSON.stringify(obj));
        Object.keys(obj).forEach(function (timestamp) {
          var val = obj[timestamp];
          if (parseFloat(val)) val = parseFloat(val); // try casting to float
          metrics.set(key, val, new Date(parseInt(timestamp)));
        });
      });
    }

    // save metric `key` and `values` in redis
    function save (key, values) {
      debugger;
      redis.sadd(redisSetKey, key);
      var redisKey = 'metrics:' + key;
      debug('saving %s = %s ..', redisKey, JSON.stringify(values));
      Object.keys(values).forEach(function (timestamp) {
        var val = JSON.stringify(values[timestamp]);
        redis.hset(redisKey, timestamp, val, function (err) {
          if (err) return debug('failed to save %s = %s -- %s', redisKey, val, err.stack);
          debug('saved %s = %s ..', redisKey, val);
        });
      });
    }

    saveAll();
    loadAll();
    listen();
  };
};
