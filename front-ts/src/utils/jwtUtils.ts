
import jwt from 'jsonwebtoken';

import  jwksClient from 'jwks-rsa';

console.log("jwtUtils, AUTH_SERVER_JWKS_URL: " + process.env.AUTH_SERVER_JWKS_URL);

var client = jwksClient({
  jwksUri: process.env.AUTH_SERVER_JWKS_URL ?? "JWKS_URI undefined",

});
function getKey(header: any, callback: any){
  client.getSigningKey(header.kid, function(err, key: any) {
    if (err) { return callback(err); }
    var signingKey = key?.publicKey || key?.rsaPublicKey;
    callback(null, signingKey);
  });
}

let options = {
  issuer : process.env.JWT_VERIF_ISSUER,
  audience : process.env.JWT_VERIF_AUDIENCE
}

export function checkJWT(token: string, cb: any) {

  console.log("token to check: " + token);

  jwt.verify(token, getKey, options,(err: any, user: any) => {
    if (err) {
      console.log ("JWT verification Error. " + err);
      return cb(err);
    }
    // more checks
    
    return cb(null,user);

  })
}


export function authenticateJWT(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
      checkJWT(token, (err: any, user: any) => {
        console.log(err)
    
        if (err) return res.sendStatus(403)
    
        console.log("jwt ok")
        req.user = user
    
        next()
      })
      /*
      jwt.verify(token, getKey, options,(err: any, user: any) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      console.log("jwt ok")
      req.user = user
  
      next()
      
    })
    */
  }