# Connect Browser-filter Middleware

This middleware is used to check the User-Agent, and redirect the incompatible UA to another URL.

## Usage

```js
var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(require('connect-browser-filter')(
    //The filter and redirect map.
    //Now only support 'ieX' series.
    {
      '/legacyIE.html': ['ie6', 'ie7']
    },
    {
      //Ignore files list.(Optional)
      ignores: ['/images/logo.png', '/images/sprite.png']
    }
  ))
  .use(connect.static('public'))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

http.createServer(app).listen(3000);
```

## License

View the LICENSE file.