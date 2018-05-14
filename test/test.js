const axios = require('axios');
const express = require('express');
const http = require('http');
const passport = require('passport');
const uuid = require('uuid/v4');
const Middleware = require('..');

const mw = new Middleware('foo');

mw.use('getKey', async(keyId) => {
  // FIXME: real key data
  return {id: keyId, owner: 'https://example.com/identity/x'};
});

const app = express();

let options = null;
let server = null;
let socket = null;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, {});
  // User.findById(id, function (err, user) {
  //   done(err, user);
  // });
});

app.use(passport.initialize());
passport.use(mw);

app.get('/foo', passport.authenticate('foo'), (req, res) => {
  console.log('USER INFO', req.user);
  res.end();
});

describe('foo', () => {
  before(() => {
    socket = '/tmp/.' + uuid();
    options = {
      socketPath: socket,
      headers: {}
    };
    server = http.createServer(app);
    server.listen(socket);
  });

  after(() => {
    server.close();
  });

  it('makes a request', async() => {
    await axios.get('http://localhost/foo', options);
  });
});
