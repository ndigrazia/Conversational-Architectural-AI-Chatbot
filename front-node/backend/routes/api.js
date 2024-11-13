// routes/index.js
const express = require("express");
const { handleMessage } = require("../controllers/messageController");

const router = express.Router();

router.post("/message", handleMessage);


router.post("/example", (req, res, next) => {
   // setTimeout( function () {

        res.json({answer:"algo que te respondo, debe ser mas largo para poder probar a interface con una respuesta replesentativa. No tiene gracia probar con algo corto, ya que seguramente va a ser mucho mas larga la respuesta. Y esto es bastante corto.", 
                link_references:["http://pepe.com/link2","http://pepe.com/link3"]
            });
   //     }, 20000)

   });

module.exports = router;
