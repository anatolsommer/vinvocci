var assert=require('assert'), fs=require('fs'),  path=require('path'),
  Log=require('..'), file=__dirname+'/tmp'+Date.now()+'.log';

describe('Vinvocci', function() {
  var log=new Log(), res;

  it('should log to stdout', function() {
    res=getOutput(function() {
      log.info('test');
    });
    assert.equal(res[0].msg, 'test');
  });

  it('should log time', function() {
    assert(res[0].time);
  });

  it('should log INFO and ERROR', function() {
    res=getOutput(function() {
      log.info('test');
      log.error('test');
      log.debug('nope');
    });
    assert.equal(res[0].msg, 'test');
    assert.equal(res[0].type, 'INFO');
    assert.equal(res[1].type, 'ERROR');
  });

  it('should supress DEBUG', function() {
    assert.equal(res[2], undefined);
  });

  it('should accept string as log level', function() {
    log.setLevel('eRRor');
    res=getOutput(function() {
      log.info('test1');
      log.error('test2');
    });
    assert.equal(res[0].msg, 'test2');
    assert.equal(res[0].type, 'ERROR');
    assert.equal(res[1], undefined);
  });

  it('should set log level to DEBUG', function() {
    log.setLevel(Log.DEBUG);
    res=getOutput(function() {
      log.debug('test');
    });
    assert.equal(res[0].msg, 'test');
    assert.equal(res[0].type, 'DEBUG');
  });

  it('should log component when set', function() {
    res=getOutput(function() {
      log.debug('test1');
      log.component='compo';
      log.info('test2');
    });
    assert.equal(res[0].component, undefined);
    assert.equal(res[1].component, 'compo');
  });

  it('should change component property name', function() {
    res=getOutput(function() {
      log.componentProp='app';
      log.debug('test1');
    });
    assert.equal(res[0].component, undefined);
    assert.equal(res[0].app, 'compo');
  });

  it('should log additional properties', function() {
    Object.prototype.veryBad=true;
    res=getOutput(function() {
      log.debug('test1', {a:2, b:3});
    });
    delete Object.prototype.veryBad;
    assert.equal(res[0].a, 2);
    assert.equal(res[0].b, 3);
    assert.equal(res[0].veryBad, undefined);
  });

  it('should log to file', function(done) {
    log=new Log(null, null, file);
    log.info('test1');
    setTimeout(function() {
      res=convertToArray(fs.readFileSync(file));
      assert.equal(res[0].msg, 'test1');
      done();
    }, 30);
  });

  it('should append to file', function(done) {
    log=new Log(null, null, file);
    log.info('test2');
    setTimeout(function() {
      res=convertToArray(fs.readFileSync(file));
      assert.equal(res[0].msg, 'test1');
      assert.equal(res[1].msg, 'test2');
      done();
    }, 30);
  });

  after(function(done) {
    fs.unlink(file, done);
  });
});

function getOutput(cb) {
  var write=process.stdout.write, buf='';
  process.stdout.write=function(data) {
    buf+=data;
  };
  try {
    cb();
    process.stdout.write=write;
  } catch(err) {
    process.stdout.write=write;
    throw err;
  }
  return convertToArray(buf);
}

function convertToArray(str) {
  return JSON.parse('['+str.toString().trim().replace(/\n/g, ',')+']');
}
