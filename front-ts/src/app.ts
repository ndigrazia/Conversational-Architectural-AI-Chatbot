
import dotenvFlow  from 'dotenv-flow';

console.log("env: " + process.env.DOTENV_FLOW_PATH);

if ( typeof process.env.DOTENV_FLOW_PATH !== 'undefined')
  dotenvFlow.config({path: process.env.DOTENV_FLOW_PATH});
else
  dotenvFlow.config();

import * as client from 'openid-client'
import { Strategy, type VerifyFunctionWithRequest } from 'openid-client/passport'

import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login'
import http from "http";
import path from 'path';
import { ensureError } from './utils/errorUtils.js';


//console.log("dotEnvFlowfiles: " + JSON.stringify(dotenvFlow.listFiles(), null, 2));

let app = express();


// Prerequisites oidc

let server = new URL(process.env.AUTH_SERVER_WELL_KNOW_URL ?? "AUTH_SERVER_WELL_KNOW_URL undefined" ); // Authorization server's Issuer Identifier URL
let clientId = process.env.APP_CLIENT_ID ?? "CLIENT_ID undefined"; // Client identifier at the Authorization Server
let clientSecret = process.env.APP_CLIENT_SECRET ?? "CLIENT_SECRET undefined"; // Client Secret
let scope = process.env.APP_SCOPE;
let callbackURL = process.env.APP_CALLBACK_URL;
let sessionSecret = process.env.SESSION_SECRET ?? "SESSION_SECRET undefined"; // Secret to sign session cookies with

// End of prerequisites

console.log("auth server: " + server);

declare global {
  namespace Express {
    interface User {
      sub: string
      email?: string
    }
  }
}
var config : client.Configuration;

try {
  
  var config : client.Configuration = await client.discovery(server, clientId, clientSecret )
} catch (err) {
  const error = ensureError(err)

  console.log(error);
  process.exit(1);
}

console.log("Soporta PKCE");
console.log(config.serverMetadata().supportsPKCE());


app.use(cookieParser())
app.use(
  session({
    saveUninitialized: false,
    resave: true,
    secret: sessionSecret,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true,   // eliminar si usa token almacenado en cookie para invocar apis
      //secure: true,   // agregar en prod 
      sameSite: 'lax' 
    }
  }),
)
app.use(passport.authenticate('session'))

let verify: VerifyFunctionWithRequest = (req,tokens, verified) => {

  checkJWT(tokens.access_token, (err: any, user: any) => {

  if (err) {
    console.log("JWT inválido en login." + err);
    return verified(new Error("Login error."));
  }
  console.log("jwt valido en login " + JSON.stringify(user));

  // habilitar solo si se envia token por cookie, seteando adicionalmente los valores de seguridad para cookie.
  //req.res?.cookie('token', tokens.access_token);
  return verified(null, tokens.claims())

});
}

passport.use('oidc',new Strategy({ config, scope , passReqToCallback: true,
                                  callbackURL: callbackURL,
                                  }, verify))

passport.serializeUser((user: Express.User, cb) => {
  cb(null, user)
})

passport.deserializeUser((user: Express.User, cb) => {
  return cb(null, user)
})


var baseUrl = process.env.APP_BASE_URL ?? "APP_BASE_URL undefined"

// Rutas de aplicación
let frontStaticDir = path.join(path.dirname(import.meta.filename),'..', 'front-static')

app.get('/',ensureLoggedIn(baseUrl + '/login'), (req: any, res: any) => {

  res.redirect(baseUrl + '/index.html');
});
app.get('/index.html',ensureLoggedIn(baseUrl + '/login'), (req: any, res: any) => {

  console.log("Se invocó /index.html")
  res.sendFile(path.join(frontStaticDir, 'index.html'));
});

app.use(express.static(frontStaticDir));


import api from './routes/bff-api.js';
const{ checkJWT } = await import('./utils/jwtUtils.js');

app.use(express.json());
app.use('/api',api);

// fin rutas

// rutas de login
app.get(
  '/login',
  ensureLoggedOut(baseUrl + '/logout'),
  passport.authenticate('oidc',{scope:"openid"})//,state:"12345"})
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
      console.log("session.id: " + req.session.id);
  
      let result = passport.authenticate('oidc',{ 
           successRedirect: baseUrl + '/index.html',
           failureRedirect: baseUrl + '/login' 
          })(req, res, next)
      console.log("result: " + result);    
  }
    
  )
  
  app.get("/apilogin",(req,res) =>{
    console.log('-----------------------------');
    console.log('estoy en /apilogin');
  
    res.status(403);
    res.send({"logged":"false"})
  })
  



const httpServer = http.createServer(app)
    httpServer.listen(80,() =>{
        console.log(`Http Server Running on port 80`)
  })