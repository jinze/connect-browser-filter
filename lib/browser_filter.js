var url = require('url');

module.exports = browser_filter = function(rules_obj, options){

  //the files to ignore check
  var ignores = (options != undefined ? options.ignores : null) || [];

  //caculate the rules for filter
  var rules = (function(rules_obj){
    var result = {};

    for(key in rules_obj){
      if(rules_obj.hasOwnProperty(key)){
        ignores.push(key);
        caculateRule(result, rules_obj[key], key);
      }
    }

    //caculate a rule
    function caculateRule(result, rule, file){
      if(typeof rule === "string"){
        result[rule] = file;
      }else if(rule instanceof Array){
        for(i in rule){
          if(rule.hasOwnProperty(i) && typeof rule[i] === "string"){
            result[rule[i]] = file;
          }
        }
      }
    };

    return result;
  })(rules_obj);

  function getBrowserInfo(ua){
    var result = {};
    if(/msie\s+(.*?);/i.test(ua)){
      result.engine  = 'trident';
      result.browser = 'ie';
      result.version = parseFloat(RegExp.$1);
    }
    return result;
  };

  return function(req, res, next){
    var ua = req.headers['user-agent'];
    var b = getBrowserInfo(ua);
    var redirect_url = null;
    //redirect to the defined url
    if(redirect_url = rules[b.browser+b.version]){

      //if file in ignore list
      for(item in ignores){
        if(url.parse(req.url).pathname === ignores[item]){
          return next();
        }
      }
      res.statusCode = 302;
      res.setHeader('Location', redirect_url);
      res.setHeader('Content-Length', '0');
      res.end();
      return;
    }
    return next();
  };
};