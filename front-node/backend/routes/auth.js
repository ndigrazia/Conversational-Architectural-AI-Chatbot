// routes/index.js
const express = require("express");
const router = express.Router();

const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('passport');
const http    = require("http");
import { Issuer } from 'openid-client';
const Strategy = require('openid-client').Strategy;
const path = require("path");


router.use(cookieParser());
router.use(express.urlencoded({
  extended: true,
}));


router.use(express.json({ limit: '15mb' }));
router.use(session({secret: 'secret', 
                 resave: false, 
                 saveUninitialized: true,}));
router.use(helmet());
router.use(passport.initialize());
router.use(passport.session());

token="";
console.log("iniciando rutas auth")

passport.serializeUser(function(user, done) {
    console.log('-----------------------------');
    console.log('serialize user');
    console.log(user);
    console.log('-----------------------------');
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    console.log('-----------------------------');
    console.log('deserialize user');
    console.log(user);
    console.log('-----------------------------');
    done(null, user);
});

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

router.get("/test",(req,res) =>{
    res.send(" <a href='/login'>Log In with OAuth 2.0 Provider </a>")
 })

router.get('/login',
    function (req, res, next) {
        console.log('-----------------------------');
        console.log('/Start login handler');
        next();
    }, passport.authenticate('oidc',{scope:"openid"}) );
    
router.get('/login/callback',(req,res,next) =>{
    
        console.log('-----------------------------');
        console.log('estoy en /login/callback');
        console.log(req.session);
    
    
    
        passport.authenticate('oidc',{ 
             successRedirect: '/user',
             failureRedirect: '/error' 
            })(req, res, next)
    }
      
    )
    
router.get("/error",(req,res) =>{
      console.log('-----------------------------');
      console.log('estoy en /error');
    
      console.log("tokenset:");
      console.log(req.session.tokenSet);
    
      res.send(" <a href='/login'>Error reintenta </a>")
    })
router.get ("/user",(req,res) =>{
    
        console.log('-----------------------------');
        console.log('estoy en /user');
    
        console.log("tokenset:");
        console.log(req.session.tokenSet);
    
        res.header("Content-Type",'application/json');
    
    
        curl = "curl --request POST 'http://10.249.16.123:8080/realms/realm2/tef-jwt-bearer' \
         --header 'Content-Type: application/x-www-form-urlencoded' \
         --data-urlencode 'assertion="+token+"'"
    
    
         res.writeHead(200, { 'Content-Type':'text/html'});
         res.end("<div><a href='/login'> regenerar </a><p>"+curl+"<p></div>");
         //res.send("<a href='/login'> regenerar </a><div>" + curl + "</div>")
    
    })
    

router.post("/nada", (req, res, next) => {
   // setTimeout( function () {

        res.json({algo:"nada"});
   //     }, 20000)

   });





module.exports = router;