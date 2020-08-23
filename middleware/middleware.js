"use strict";

const jwt             = require("jsonwebtoken");
const bcrypt          = require("bcryptjs");
const baseModel       = require( appRoot+"/models/baseModel");

exports.validateToken = async function(req, res, next) {
  
  let token = req.headers["access_token"];

  console.log( req.path );

  if(req.path === '/api-docs'){
    next();
  }

  if (!token) {
    return res.status(403).send({
      success: false,"msg":"provide `access_token` in header"
    });
  }

  jwt.verify(token, process.env.SECRET, async(err, decoded) => {
    if (err) {
      return res.status(401).send({
        msg: "Unauthorized!","success":false
      });
    }

  console.log( decoded.id );
  let splitTotoken = decoded.id.split('|FREECHARGE|');

  let userResponse =  await baseModel.read(`SELECT * FROM users WHERE id='${splitTotoken[0]}'`);
  console.log("userResponse",userResponse);
  if(userResponse.length === 0 ){
    return res.json({"success":false,"error":"User id OR invalid token."});
  }

  if(userResponse[0]['encrypted_password'] != splitTotoken[1] ){
    return res.json({"success":false,"error":"Token is regenrate please use updated token."});
  }

    //return res.json({'success':true,"data":{'userId':splitTotoken[0]}});

    next();
  });

};



