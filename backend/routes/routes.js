import express from "express";
import AuthController from "../controllers/AuthController";
import  TransactionController from '../controllers/transactionController';
import checktoken from '../middlewares/authenticate'
const router = express.Router();
router.get('/',function(req,res){res.render("serverup",{title:"Demo api",message:"Server is up and running"})});
router.post("/login", AuthController.authenticateUser);
router.get('/csv',AuthController.parsecsv)
router.post('/fetchUsers',checktoken,AuthController.fetchUsers);
export default router
