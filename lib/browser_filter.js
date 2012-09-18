var url = require('url');
var useragent = require('useragent');
require('useragent/features');

module.exports = browser_filter = function(rules_obj, options){

  //the files to ignore check
  var ignores = (options != undefined ? options.ignores : null) || [];

  //caculate the rules for filter
  var rules = (function(rules_obj){
    var result = {};

    for(var key in rules_obj){
      if(rules_obj.hasOwnProperty(key)){
        ignores.push(key);
        caculateRule(result, rules_obj[key], key);
      }
    }

    //caculate a rule
    function caculateRule(result, rule, file){
      for(var i in rule){
        if(rule.hasOwnProperty(i) && typeof rule[i] === "string"){
          var node = result[i.toLowerCase()];
          if(node == undefined){
            node = result[i.toLowerCase()] = {};
          }
          node[rule[i]] = file;
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
      for(var item in rule){
        if(rule.hasOwnProperty(item) && agent.satisfies(item)){
          //if file in ignore list
          for(var file in ignores){
            if(url.parse(req.url).pathname === ignores[file]){
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
