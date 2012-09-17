var url = require('url');
var useragent = require('useragent');
require('useragent/features');

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
      for(i in rule){
        if(rule.hasOwnProperty(i) && typeof rule[i] === "string"){
          result[i.toLowerCase()].ruile[i] = file;
        }
      }
    };

    return result;
  })(rules_obj);

  return function(req, res, next){
    var agent = useragent.lookup(req.headers['user-agent']);
    var rule = rules[agent.family.toLowerCase()];
    //redirect to the defined url
    if(rule != null){
      for(item in rule){
        if(rule.hasOwnProperty(item) && agent.satisfies(item)){
          //if file in ignore list
          for(item in ignores){
            if(url.parse(req.url).pathname === ignores[item]){
              return next();
            }
          }
          res.statusCode = 302;
          res.setHeader('Location', rule[item]);
          res.setHeader('Content-Length', '0');
          res.end();
          return;
        }
      }
    }
    return next();
  };
};
