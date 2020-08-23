"use strict";

const router         = express.Router();
const userController = require( appRoot+"/controllers/userController" );
const middleware     = require( appRoot+"/middleware/middleware");


// user crud operation
router.post("/user/create", userController.create );
router.post("/user/signin", userController.signin );
router.get("/user/validateToken/:access_token", userController.validateToken );

router.use(middleware.validateToken);
router.patch("/user/update/:id", userController.update );
router.get("/users", userController.getUsers );
router.delete("/user/delete/:id", userController.delete );

module.exports = router;
