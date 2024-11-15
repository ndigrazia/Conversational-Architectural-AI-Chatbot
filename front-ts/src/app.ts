import * as client from 'openid-client'
import { Strategy, type VerifyFunctionWithRequest } from 'openid-client/passport'

import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login'
import http from "http";
import path from 'path';

let app = express();


// Prerequisites oidc


let server = new URL("http://10.249.16.123:8080/realms/realm2/.well-known/openid-configuration"); // Authorization server's Issuer Identifier URL
let clientId = "appr2"; // Client identifier at the Authorization Server
let clientSecret = "NYlFGl1kKhxyYEgAaAvMWkp5P3a6LlCi"; // Client Secret
let scope = 'openid';
let sessionSecret = "secret"; // Secret to sign session cookies with

// End of prerequisites

declare global {
  namespace Express {
    interface User {
      sub: string
      email?: string
    }
  }
}


let config : client.Configuration = await client.discovery(server, clientId, clientSecret)

console.log("Soporta PKCE");
console.log(config.serverMetadata().supportsPKCE());


app.use(cookieParser())
app.use(
  session({
    saveUninitialized: false,
    resave: true,
    secret: sessionSecret,
  }),
)
app.use(passport.authenticate('session'))

let verify: VerifyFunctionWithRequest = (req,tokens, verified) => {
  //console.log("tokens: " + JSON.stringify(tokens));

  req.res?.cookie('token', tokens.access_token);
  verified(null, tokens.claims())
}


passport.use('oidc',new Strategy({ config, scope , passReqToCallback: true,
                                  callbackURL: 'http://localhost:8888/login/callback',
                                  }, verify))

passport.serializeUser((user: Express.User, cb) => {
  cb(null, user)
})

passport.deserializeUser((user: Express.User, cb) => {
  return cb(null, user)
})

let token = ""
;

// Rutas de aplicación
let frontStaticDir = path.join(path.dirname(import.meta.filename),'..','..', 'front-static')

app.get('/',ensureLoggedIn('/login'), (req: any, res: any) => {
  res.redirect('/index.html');
});
app.get('/index.html',ensureLoggedIn('/login'), (req: any, res: any) => {
  console.log("Se invocó /index.html")
  res.sendFile(path.join(frontStaticDir, 'index.html'));
});

app.use(express.static(frontStaticDir));


import api from './routes/bff-api.js';
app.use(express.json());
app.use('/api',api);

// fin rutas

// rutas de login
app.get(
  '/login',
  ensureLoggedOut('/logout'),
  //passport.authenticate(server.hostname),
  passport.authenticate('oidc',{scope:"openid",state:"12345"})
)

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(
      client.buildEndSessionUrl(config, {
        post_logout_redirect_uri: `${req.protocol}://${req.host}`,
      }).href,
    )
  })
})

  
  app.get('/login/callback',(req,res,next) =>{
  
      console.log('-----------------------------');
      console.log('estoy en /login/callback');
      console.log("session: " + req.session);
      console.log("session.id: " + req.session.id);
      console.log("originalUrl: " + req.originalUrl);
      console.log("user.username: " + JSON.stringify(req.user) );

  
  
      let result = passport.authenticate('oidc',{ 
           successRedirect: '/index.html',
           failureRedirect: '/login' 
          })(req, res, next)
      console.log("result: " + result);    
  }
    
  )
  

  app.get("/error",(req,res) =>{
    console.log('-----------------------------');
    console.log('estoy en /error');
  
    console.log("tokenset:");
    //console.log(req.session.tokenSet);
  
    res.send(" <a href='/login'>Error, reintentar</a>")
  })
  app.get("/apilogin",(req,res) =>{
    console.log('-----------------------------');
    console.log('estoy en /apilogin');
  
    res.status(403);
    res.send({"logged":"false"})
  })
  app.get ("/user",(req,res) =>{
  
      console.log('-----------------------------');
      console.log('estoy en /user');
  
      console.log("req.session:");
      console.log(req.session);
      //console.log(req.session.tokenSet);
  
      res.header("Content-Type",'application/json');
  
  
      let curl = "curl --request POST 'http://10.249.16.123:8080/realms/realm2/tef-jwt-bearer' \
       --header 'Content-Type: application/x-www-form-urlencoded' \
       --data-urlencode 'assertion="+token+"'"
  
  
       res.writeHead(200, { 'Content-Type':'text/html'});
       res.end("<div><a href='/login'> regenerar </a><p>"+curl+"<p></div>");
       //res.send("<a href='/login'> regenerar </a><div>" + curl + "</div>")
  
  })




const httpServer = http.createServer(app)
    //const server= https.createServer(options,app).listen(3003);
    httpServer.listen(8888,() =>{
        console.log(`Http Server Running on port 8888`)
  })