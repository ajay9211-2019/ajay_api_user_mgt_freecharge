"use strict";

global.express   = require('express');
const rootPath   = require('path');
const app        = express();
global.appRoot   = rootPath.resolve(__dirname);
const bodyParser = require('body-parser');

const apiRouter = require(appRoot + '/routes/apiRouter');
const port = 3000;
const swaggerUi = require('swagger-ui-express');

const swaggerDocument    = require(appRoot + '/swagger/swagger.json');

swaggerDocument["paths"] = { ...swaggerDocument["paths"] }

swaggerDocument.host = 'localhost';
console.log('swagger base url : ',swaggerDocument.host)
const options = {
  //customCss: '.swagger-ui .topbar { display: none }',
  docExpansion:"none"
};

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument,false,options));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
	//res.status(200);
	res.send('200 ok');
});

app.use(apiRouter);

app.listen(port, () => {

	console.log('Server is up on ' + port)
	//console.log(process.env)
});
