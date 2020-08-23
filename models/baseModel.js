var mysqlConnection   = require( appRoot+'/config/dbConnection' ).mysqlConnection();
//var mysqlConnection   = require( appRoot+'/config/dbConnection' ).mysqlCreatePoolConnection();

exports.create = ( strSql , jsonData ) => {
  // console.log( mysqlConnection  );
  return new Promise(function(fulfill, reject) {
    //console.log( storeQuery +"mmmm" );
    mysqlConnection.query(strSql, jsonData, function(error, results, fields) {
      if (error) {
        console.log(`Error from create query ${error}`);
        //mysqlConnection.destroy();
        //throw error;
        reject(error);
      } else {
        fulfill(results);
      }
    });
  });

  mysqlConnection.end();
};

exports.update = ( strSql)  => {
  // console.log( mysqlConnection  );
  return new Promise(function(fulfill, reject) {
    //console.log( storeQuery +"mmmm" );
    mysqlConnection.query(strSql, function(error, results, fields) {
      if (error) {
        console.log(`Error from select query ${error}`);
        //mysqlConnection.destroy();
        //throw error;
        reject(error);
      } else {
        fulfill(results);
      }
    });
  });

  mysqlConnection.end();
};

exports.read = strSql => {
  // console.log("read query : ", strSql);
  return new Promise(function(fulfill, reject) {
    //console.log( strSql +"mmmm" );
    mysqlConnection.query(strSql, function(error, results, fields) {
      if (error) {
        console.log(`Error from select query ${error}`);
        //mysqlConnection.destroy();
        //throw error;
        reject(error);
      } else {
        fulfill(results);
      }
    });
  });

  mysqlConnection.end();
};

exports.delete = () => {};
