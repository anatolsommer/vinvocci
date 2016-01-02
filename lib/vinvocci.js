/*!
 * vinvocci
 * Copyright(c) 2015-2016 Anatol Sommer <anatol@anatol.at>
 * MIT Licensed
 */

'use strict';

var writeStream=require('fs').createWriteStream;

function Log(level, component, file) {
  this.setLevel(level || Log.INFO);
  this.component=component;
  this.stream=file ? writeStream(file, {flags:'a'}) : process.stdout;
}

Log.ERROR=0;
Log.INFO=1;
Log.DEBUG=2;

Log.prototype={

  componentProp:'component',

  log:function(levelStr, args) {
    if (Log[levelStr]<=this.level) {
      var obj={time:new Date(), type:levelStr}, key;

      if (this.component) {
        obj[this.componentProp]=obj[this.componentProp] || this.component;
      }
      obj.msg=args[0];
      if (typeof args[1]==='object') {
        for (key in args[1]) {
          if (args[1].hasOwnProperty(key)) {
            obj[key]=args[1][key];
          }
        }
      }

      this.stream.write(JSON.stringify(obj)+'\n');
    }
  },

  setLevel:function(level) {
    if (typeof level==='string') {
      level=Log[level.toUpperCase()];
    }
    this.level=Math.min(Math.max(level, Log.ERROR), Log.DEBUG);
  },

  error:function() {
    this.log('ERROR', arguments);
  },

  info:function() {
    this.log('INFO', arguments);
  },

  debug:function() {
    this.log('DEBUG', arguments);
  }

};

module.exports=Log;

