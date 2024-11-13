import * as client from 'openid-client';
import { Strategy } from 'openid-client/passport';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login';
import http from "http";
// Prerequisites
let app = express();
let server = new URL("https://accounts.google.com"); // Authorization server's Issuer Identifier URL
let clientId = "130111239997-3mfisgk3lev8dqfsasnuamf4hvbodtp4.apps.googleusercontent.com"; // Client identifier at the Authorization Server
let clientSecret = "6R1tVzBfNUJmvn7XI3J47zQ5"; // Client Secret
let scope = 'openid email';
let sessionSecret = "secret"; // Secret to sign session cookies with
let config = await client.discovery(server, clientId, clientSecret);
app.use(cookieParser());
app.use(session({
    saveUninitialized: false,
    resave: true,
    secret: sessionSecret,
}));
app.use(passport.authenticate('session'));
let verify = (tokens, verified) => {
    verified(null, tokens.claims());
};
passport.use(new Strategy({ config, scope }, verify));
passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((user, cb) => {
    return cb(null, user);
});
let token = "";
app.get('/', ensureLoggedIn('/login'), (req, res) => {
    var _a, _b;
    res.send(`Welcome ${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.sub)}`);
});
app.get('/login', ensureLoggedOut('/logout'), passport.authenticate(server.hostname));
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect(client.buildEndSessionUrl(config, {
            post_logout_redirect_uri: `${req.protocol}://${req.host}`,
        }).href);
    });
});
app.get('/login/callback', (req, res, next) => {
    console.log('-----------------------------');
    console.log('estoy en /login/callback');
    console.log(req.session);
    passport.authenticate('oidc', {
        successRedirect: '/user',
        failureRedirect: '/error'
    })(req, res, next);
});
/*
app.get("/",(req,res) =>{

  console.log('-----------------------------');
  console.log('estoy en /');

  res.send(" <a href='/login'>Log In with OAuth 2.0 Provider </a>")

})
  */
app.get("/error", (req, res) => {
    console.log('-----------------------------');
    console.log('estoy en /error');
    console.log("tokenset:");
    //console.log(req.session.tokenSet);
    res.send(" <a href='/login'>Error reintenta </a>");
});
app.get("/user", (req, res) => {
    console.log('-----------------------------');
    console.log('estoy en /user');
    console.log("tokenset:");
    //console.log(req.session.tokenSet);
    res.header("Content-Type", 'application/json');
    let curl = "curl --request POST 'http://10.249.16.123:8080/realms/realm2/tef-jwt-bearer' \
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
//# sourceMappingURL=passport.js.map