
import jwt from 'jsonwebtoken';

import  jwksClient from 'jwks-rsa';
var client = jwksClient({
  jwksUri: "http://10.249.16.123:8080/realms/realm2/protocol/openid-connect/certs",

});
function getKey(header: any, callback: any){
  client.getSigningKey(header.kid, function(err, key: any) {
    if (err) { return console.log(err); }
    var signingKey = key?.publicKey || key?.rsaPublicKey;
    callback(null, signingKey);
  });
}

let options = {
  issuer : "http://10.249.16.123:8080/realms/realm2",
  audience : "account",
  //subject : "ad7aafa4-7461-4288-9820-e118507b4638"
}
export function authenticateJWT(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, getKey, options,(err: any, user: any) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      console.log("jwt ok")
      req.user = user
  
      next()
    })
  }