const mysql      = require('mysql');

exports.mysqlConnection = ( ) => {
	console.log( process.env.MYSQL_HOSTNAME , process.env.MYSQL_DATABASE);
	return mysql.createConnection(
									{
				                      host     : process.env.MYSQL_HOSTNAME,
				                      user     : process.env.MYSQL_USERNAME,
				                      password : process.env.MYSQL_PASSWORD,
				                      port     : process.env.MYSQL_PORT,
				                      database : process.env.MYSQL_DATABASE
				                    }
	                    		);
	};

exports.mysqlCreatePoolConnection = ( ) => {
	console.log( "env=="+process.env.RDS_MYSQL_HOSTNAME+" db="+process.env.MYSQL_DATABASE );
	return mysql.createPool(
									{
										connectionLimit : 200,   
										host     : process.env.MYSQL_HOSTNAME,
										user     : process.env.MYSQL_USERNAME,
										password : process.env.MYSQL_PASSWORD,
										port     : process.env.MYSQL_PORT,
										database : process.env.MYSQL_DATABASE,
										multipleStatements: true
									}
								);
	};