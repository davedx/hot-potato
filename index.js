var http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    url = require('url');

if(process.argv.length < 4) {
  console.error('Usage: node index <HOST> <LOCAL_PORT>');
  console.error('Please supply a host to proxy, e.g. http://myapi.com:321, and the local port to bind to, e.g. 5050');
  return;
}
var proxyHost = process.argv[2];
var localPort = process.argv[3];

var proxy = httpProxy.createProxyServer({});

var spudCache = {};

function getSpud(spudId) {
  var path = 'spuds'+spudId;
  if(spudCache[spudId]) {
    console.info('Found cached spud for '+spudId);
    return spudCache[spudId];
  } else if(fs.existsSync(path)) {
    console.info('Loading spud for '+spudId);
    spudCache[spudId] = fs.readFileSync(path);
    return spudCache[spudId];
  }
}

function putSpud(spudId, spud) {
  var path = 'spuds'+spudId;
  if(spud === null) {
    fs.unlinkSync(path);
    delete spudCache[spudId];
  } else {
    fs.writeFileSync(path, spud);
    spudCache[spudId] = spud;
  }
}

var server = http.createServer(function(req, res) {
  if(req.headers.cookie) {
    //TODO
    console.log('cookie: ', req.headers.cookie)
  }
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
  res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  console.log('url: '+req.url+' method: '+req.method);
  if(req.url.indexOf('/hotpotato/public') === 0) {
    var m = req.url.match(/\/hotpotato\/public\/(.*)/);
    //console.log('matches: ', m);
    if(m[1]) {
      console.log('sending "public/'+m[1]+'"');
      return res.end(fs.readFileSync('public/'+m[1]));
    }
  }

  if(req.url.indexOf('/hotpotato/spud/') === 0) {
    var m = req.url.match('/hotpotato/spud/(.+)');
    console.log('spud: '+m[1]);
    switch(req.method) {
      case 'GET':
        console.log('serving spud '+m[1]);
        return res.end(getSpud('/' + m[1]));
        break;
      case 'POST':
        console.log('saving spud '+m[1]+' with body ');
        var body = [];
        req.on('data', function(chunk) {
          body.push(chunk);
        }).on('end', function() {
          body = Buffer.concat(body).toString();
          putSpud('/' + m[1], body);
          return res.end('OK');
        });
        break;
      case 'DELETE':
        console.log('deleting spud '+m[1]);
        putSpud('/' + m[1], null);
        return res.end('OK');
        break;
    }
    return;
  }

  var spud = getSpud(req.url);
  if(spud) {
    return res.end(spud);
  }
  var opts = {
    target: proxyHost
  };
  if (proxyHost.indexOf('https') !== -1) {
    var proxyHostUrl = url.parse(proxyHost);
    opts = Object.assign(opts, {
      agent: https.globalAgent,
      changeOrigin: true,
      headers: {
        host: proxyHostUrl.hostname
      },    
      https: true
    });
  }
  proxy.web(req, res, opts);
});

console.log('Proxying '+proxyHost+' on port '+localPort);
server.listen(localPort);
