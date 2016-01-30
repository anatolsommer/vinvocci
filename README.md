# Vinvocci
Simple JSON logger


### Usage:
```js
var Log=require('vinvocci'), log=new Log();

log.debug('Foo');
log.info('Bar', { test:123, list:['a', 'b'] });
log.error('Baz', { stack:err.stack });
```
```
{"time":"2015-12-31T17:42:13.622Z","type":"INFO","msg":"Bar","test":123,"list":["a","b"]}
{"time":"2015-12-31T17:42:13.626Z","type":"ERROR","msg":"Baz","stack":"Error\n    at ...
```


#### Differentiate components
```js
var Log=require('vinvocci'),
  log1=new Log(Log.DEBUG, 'component1'),
  log2=new Log(Log.DEBUG, 'component2');

log1.debug('Foo');
log2.debug('Bar', {pid:process.pid});
```
```
{"time":"2015-12-31T17:45:09.658Z","type":"DEBUG","component":"component1","msg":"Foo"}
{"time":"2015-12-31T17:45:09.660Z","type":"DEBUG","component":"component2","msg":"Bar","pid":3779}
```


#### Differentiate by different key
```js
var Log=require('vinvocci'), log=new Log(Log.INFO, 'app1');

log.componentProp='app';

log.info('Foo');
```
```
{"ts":"2015-12-31T17:47:37.588Z","type":"INFO","app":"app1","msg":"Foo"}
```


#### Log to file
```js
var Log=require('vinvocci'), log=new Log(Log.INFO, null, './myapp.log');
```


#### Change log level
```js
log.setLevel(Log.DEBUG);
```


#### Log levels:
* 0 = ERROR
* 1 = INFO (default)
* 2 = DEBUG


## Tests
Run tests with `npm test` or generate coverage reports with `npm run test-cov`.


## License
#### MIT

