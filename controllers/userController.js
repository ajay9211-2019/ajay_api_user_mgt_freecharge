"use strict";

const jwt             = require("jsonwebtoken");
const bcrypt          = require("bcryptjs");
const baseModel       = require( appRoot+"/models/baseModel");
const validaterHelper = require( appRoot+'/helpers/validaterHelper');


exports.create = async (req, res) => {

  console.log("body",req.body);

  let payloadValid = await validaterHelper.validatefields(req.body, {
      "fname": "", 
      "lname": "",
      "email": "",
      "password":""
    }, ["fname", "lname","email","password"] );
    
  if (false === payloadValid.success) {
    return res.json({"success":false,"error":payloadValid.response['errorMessage']});
  }

  let userResponse =  await baseModel.read(`SELECT * FROM users WHERE email='${req.body['email']}'`);
  console.log("userResponse",userResponse);
  if(userResponse.length > 0 ){
    return res.json({"success":false,"error":"Duplicate Email address.Please try another."});
  }

  let strSqlQuery = `INSERT INTO users SET ?`;
  const userData  = {
                    "f_name":req.body['fname'],
                    "l_name":req.body['lname'],
                    "email":req.body['email'],
                    "encrypted_password":bcrypt.hashSync(req.body['password'], 8),
                    "status":1,
                    "created_at":new Date()
                  };
          console.log(userData);

  let response =  await baseModel.create(strSqlQuery, userData);

  userResponse =  await baseModel.read(`SELECT id,f_name,l_name,email FROM users WHERE id=${response['insertId']}`);

  console.log( "userData",);

  return res.json({'success':true,"msg":"","data":userResponse[0]});
  
 };

exports.signin = async (req, res) => {

  let payloadValid = await validaterHelper.validatefields(req.body, {
      "email": "",
      "password":""
    }, ["email","password"] );
    
  if (false === payloadValid.success) {
    return res.json({"success":false,"error":payloadValid.response['errorMessage']});
  }

  let userResponse =  await baseModel.read(`SELECT * FROM users WHERE email='${req.body['email']}'`);

  if( userResponse.length === 0){
    return res.status(401).json({'success':false});
  }


  let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        userResponse[0]['encrypted_password']
      );

  if (!passwordIsValid) {
    return res.status(401).json({'success':false});
  }

  let userid = userResponse[0].id+'|FREECHARGE|'+userResponse[0].encrypted_password;
  const token = jwt.sign({ id: userid }, process.env.SECRET, {
        expiresIn: 86400 // 24 hours
      });

  res.set('access_token', token );
  return res.json({'success':true,"data":
                                    {'email':userResponse[0]['email'],
                                    'name':`${userResponse[0]['f_name']} ${userResponse[0]['l_name']}`
                                  },'access_token': token});

}

//validate token
exports.validateToken = async function(req, res, next) {
  
  let token = req.params["access_token"];

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
    let splitTotoken = decoded.id.split('|FREECHARGE|');

    let userResponse =  await baseModel.read(`SELECT * FROM users WHERE id='${splitTotoken[0]}'`);
  console.log("userResponse",userResponse);
  if(userResponse.length === 0 ){
    return res.json({"success":false,"error":"User id OR invalid token."});
  }

  if(userResponse[0]['encrypted_password'] != splitTotoken[1] ){
    return res.json({"success":false,"error":"Token is regenrate please use updated token."});
  }

    return res.json({'success':true,"data":{'userId':splitTotoken[0]}});
  });

};


exports.update = async (req, res) => {

  console.log("body",req.body);

  let payloadValid = await validaterHelper.validatefields(req.body, {
      "fname": "", 
      "lname": "",
      "email": "",
      "password":""
    }, [] );
    
  if (false === payloadValid.success) {
    return res.json({"success":false,"error":payloadValid.response['errorMessage']});
  }

  let userResponse =  await baseModel.read(`SELECT * FROM users WHERE id='${req.params['id']}'`);
  console.log("userResponse",userResponse);
  if(userResponse.length === 0 ){
    return res.json({"success":false,"error":"User id not found."});
  }

  userResponse =  await baseModel.read(`SELECT * FROM users WHERE email="${req.body['email']}" AND id !='${req.params['id']}'`);
  console.log("userResponse",userResponse);
  if(userResponse.length > 0 ){
    return res.json({"success":false,"error":"Please try another email id."});
  }


  let strSql = 'UPDATE users SET ';
  if( req.body['fname'] ){
    strSql +=` f_name='${req.body['fname']}'`;
  }
  if( req.body['lname'] ){
    strSql +=`, l_name='${req.body['lname']}'`;
  }
  if( req.body['email'] ){
    strSql +=`, email='${req.body['email']}'`;
  }
  if( req.body['password'] ){
    let hash = bcrypt.hashSync(req.body['password'], 8)

    strSql +=`, encrypted_password='${hash}'`;
  }
  strSql +=`, updated_at='${new Date()}' WHERE id=${req.params['id']}`;

  console.log( strSql );


  let response =  await baseModel.update(strSql );

  userResponse =  await baseModel.read(`SELECT id,f_name,l_name,email FROM users WHERE id=${req.params['id']}`);

  console.log( "userData",);

  return res.json({'success':true,"msg":"","data":userResponse[0]});
  
 };


exports.getUsers = async function(req, res, next) {
  
  let userResponse =  await baseModel.read(`SELECT id as userId, email as email,f_name as firstName,l_name as lastName,status as active FROM users order by id desc`);
  
  if(userResponse.length === 0 ){
    return res.json({"success":false,"error":"Users not found."});
  }

  return res.json({'success':true,"data":userResponse});
};

exports.delete = async function(req, res, next) {
  
  let userResponse =  await baseModel.read(`DELETE FROM users WHERE id=${req.params['id']}`);
  
  console.log(userResponse );
  if(userResponse.length === 0 ){
    return res.json({"success":false,"error":"Users not found."});
  }

  return res.json({'success':true,"data":{'isDeleted':userResponse['affectedRows']} });
};
