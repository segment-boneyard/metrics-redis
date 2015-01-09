# metrics-express

A [segmentio/metrics](https://github.com/segmentio/metrics) plugin to save and load metrics from a [Redis](http://redis.io/) db.

## Installation

    $ npm install metrics-redis

## Example

```js
var Metrics = require('metrics');
var save = require('metrics-redis');
var Redis = require('redis');
var redis = Redis.createClient();

var metrics = Metrics()
  .use(save(redis))
  .every('10m', charges('stripe-key')
  .every('10m', subscriptions('stripe-key')
  .every('1d', awsBilling(accountId, key, secret, bucket, region))
  .every('10m', helpscout('helpscout-key', ['mailbox']));
```

The plugin will query set`metrics:keys`, and load all of the metric values set at those keys. For example:

```js
metrics:keys = ["stripe subscriptions"]
metrics:stripe subscriptions = { '1420840090802': 30, '1420840090802': 43 }
```

The plugin will listen for all change events and save each change into the redis db.

## License

MIT