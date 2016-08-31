var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs');

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
  proxy.web(req, res, { target: 'http://local.vandebron.nl' });
});

console.log("listening on port 5050")
server.listen(5050);