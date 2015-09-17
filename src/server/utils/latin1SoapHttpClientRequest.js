var iconv = require('iconv-lite');

function latin1SoapHttpClientRequest(rurl, data, callback, exheaders, exoptions) {
  var self = this;
  var options = self.buildRequest(rurl, data, exheaders, exoptions);
  options.encoding = null;
  var headers = options.headers;
  var req = self._request(options, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    body = iconv.decode(body, "ISO-8859-1");
    body = self.handleResponse(req, res, body);
    callback(null, res, body);
  });
  if (headers.Connection !== 'keep-alive') {
    req.end(data);
  }
  return req;
}

module.exports = latin1SoapHttpClientRequest;
