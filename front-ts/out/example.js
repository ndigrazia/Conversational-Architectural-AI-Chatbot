import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import passport from 'passport';
import http from "http";
//import { Issuer } from 'openid-client';
//import { Strategy } from 'openid-client';
import * as client1 from 'openid-client';
const app = express();
let server = "https://accounts.google.com"; // Authorization server's Issuer Identifier URL
let clientId = "130111239997-3mfisgk3lev8dqfsasnuamf4hvbodtp4.apps.googleusercontent.com"; // Client identifier at the Authorization Server
let clientSecret = "6R1tVzBfNUJmvn7XI3J47zQ5"; // Client Secret
let scope = 'openid email';
let sessionSecret = "secret"; // Secret to sign session cookies with
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(session({ secret: 'secret',
    resave: false,
    saveUninitialized: true, }));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
let token = "";
passport.serializeUser(function (user, done) {
    console.log('-----------------------------');
    console.log('serialize user');
    console.log(user);
    console.log('-----------------------------');
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    console.log('-----------------------------');
    console.log('deserialize user');
    console.log(user);
    console.log('-----------------------------');
    //done(null, user);
    done(null);
});
//const oidcIssuer = await Issuer.discover('https://accounts.google.com');
let config = await client1.discovery(server, clientId, clientSecret);
console.log('Discovered issuer %s %O', config.issuer, config.metadata);
console.log('--------------');
console.log('Creando client');
var client = new oidcIssuer.Client({
    client_id: 'appr2',
    client_secret: 'NYlFGl1kKhxyYEgAaAvMWkp5P3a6LlCi',
    redirect_uris: ["http://localhost:8888/login/callback"],
    //,"http://10.249.16.123:9999/login/callback"],
    response_types: ['code'],
});
passport.use('oidc', new Strategy({ client, passReqToCallback: true }, (req, tokenSet, userinfo, done) => {
    console.log("tokenSet", tokenSet);
    console.log("userinfo", userinfo);
    token = tokenSet.access_token;
    req.session.tokenSet = tokenSet;
    req.session.userinfo = userinfo;
    return done(null, tokenSet.claims());
}));
/*
Issuer.discover('http://10.249.16.123:8080/realms/realm2/.well-known/openid-configuration')
  .then(function (oidcIssuer) {

    console.log('Discovered issuer %s %O', oidcIssuer.issuer, oidcIssuer.metadata);

    console.log('--------------')
    console.log('Creando client')

    var client = new oidcIssuer.Client({
      client_id: 'appr2',
      client_secret: 'NYlFGl1kKhxyYEgAaAvMWkp5P3a6LlCi',
      redirect_uris: ["http://localhost:8888/login/callback"],
      //,"http://10.249.16.123:9999/login/callback"],
      response_types: ['code'],
      
    });

    passport.use(
      'oidc',
      new Strategy({ client,passReqToCallback: true}, (req, tokenSet, userinfo, done) => {
        console.log("tokenSet",tokenSet);
        console.log("userinfo",userinfo);

        token=tokenSet.access_token;

        req.session.tokenSet = tokenSet;
        req.session.userinfo = userinfo;
        return done(null, tokenSet.claims());
      }
      
      )
    );
  });
*/
app.get('/login', function (req, res, next) {
    console.log('-----------------------------');
    console.log('/Start login handler');
    next();
}, passport.authenticate('oidc', { scope: "openid" }));
app.get('/login/callback', (req, res, next) => {
    console.log('-----------------------------');
    console.log('estoy en /login/callback');
    console.log(req.session);
    passport.authenticate('oidc', {
        successRedirect: '/user',
        failureRedirect: '/error'
    })(req, res, next);
});
app.get("/", (req, res) => {
    console.log('-----------------------------');
    console.log('estoy en /');
    res.send(" <a href='/login'>Log In with OAuth 2.0 Provider </a>");
});
app.get("/error", (req, res) => {
    console.log('-----------------------------');
    console.log('estoy en /error');
    console.log("tokenset:");
    console.log(req.session.tokenSet);
    res.send(" <a href='/login'>Error reintenta </a>");
});
app.get("/user", (req, res) => {
    console.log('-----------------------------');
    console.log('estoy en /user');
    console.log("tokenset:");
    console.log(req.session.tokenSet);
    res.header("Content-Type", 'application/json');
    curl = "curl --request POST 'http://10.249.16.123:8080/realms/realm2/tef-jwt-bearer' \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'assertion=" + token + "'";
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end("<div><a href='/login'> regenerar </a><p>" + curl + "<p></div>");
    //res.send("<a href='/login'> regenerar </a><div>" + curl + "</div>")
});
const httpServer = http.createServer(app);
//const server= https.createServer(options,app).listen(3003);
httpServer.listen(8888, () => {
    console.log(`Http Server Running on port 8888`);
});
//# sourceMappingURL=example.js.map