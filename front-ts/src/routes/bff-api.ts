import * as express from 'express';
import { handleMessage } from '../controllers/messageController.js';
import { ensureLoggedIn } from 'connect-ensure-login'
import { authenticateJWT } from '../services/jwtUtils.js'
import { rateLimit } from "express-rate-limit";

// rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req: any, res: any) => {
                                      //console.log("user: " + JSON.stringify(req.user))
                                      return req.user.preferred_username},
});


const router: express.Router = express.Router();

//router.use(limiter);

//router.all('*',ensureLoggedIn('/apilogin'));

//router.post('/message',ensureLoggedIn('/apilogin'),limiter, handleMessage);

router.post('/message', authenticateJWT, limiter,  handleMessage);

/*

router.get('/example', (req: express.Request, res: express.Response) => {
    res.json({
      answer: 'algo que te respondo, debe ser mas largo para poder probar a interface con una respuesta representativa. No tiene gracia probar con algo corto, ya que seguramente va a ser mucho mas larga la respuesta. Y esto es bastante corto.',
      link_references: ['http://pepe.com/link2', 'http://pepe.com/link3']
    });
  
});
*/
export default router;
