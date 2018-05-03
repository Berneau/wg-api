function color(text, color) {
  if (color == 'y') return `\x1b[33m${text}\x1b[0m`;
  if (color == 'c') return `\x1b[36m${text}\x1b[0m`;
}

function createKv(key, value) {
  value = color(value, 'y');
  return `${key}: "${value}"`
}


function logger(req, res, next) {
  let kvs = [
    [ 'url', req.url ],
    [ 'token', req.headers.authorization ? true : false ],
    [ 'method', req.method ]
  ]
  
  let text = color("Logger:", 'c') + " { "
  
  for (var i = 0; i < kvs.length; i++) {
    text = text + createKv(kvs[i][0], kvs[i][1]);
    if (i < kvs.length - 1) text = text + ', ';
  }
  
  text = text + ' }'
  
  console.log(text);
  
  next();
}

module.exports = logger;