import user from '../models/user';
import  responseObj from '../utility/responseObject';
import log from '../utility/chalk';
import mailer from '../utility/mail';
import  bcrypt  from  'bcrypt';
import jwt from 'jsonwebtoken';
import csvtojson from 'csvtojson'
import mongoose from '../database/database'
import secret from '../utility/config';
import {alreadyVerified,mailString,mailErrorString} from '../public/htmlStrings/servehtml';

class AuthController {
static async parsecsv(req,res){
  let csv = __dirname+ "/../da_task (1).csv"
  let json = await csvtojson().fromFile(csv)
  if(json){
    for await ( let j of json){
      j.name = j.name.toLowerCase(); 
     let userIns =  await user.create(j)
      await userIns.save();
    } 
  }



}
static async authenticateUser(req, res) {
  if(req.body.username){
    let currentUser = await user.findOne({name:req.body.username.toLowerCase()}).catch((e)=>{log(`Error while fetching user: ${e}`,false)}); 
    if(currentUser){
        const token = jwt.sign({ userId: currentUser._id }, secret,{ expiresIn: '1h' })
        if(token){
          res.setHeader('x-access-token', token);
          log("access granted",true); 
          res.status(200).send(responseObj(200,'ok',[{"id":currentUser._id}]));
        }else{
          log("Check secret",false);
          res.status(200).send(responseObj(400,'error',null))
        }
       }else{
      log("no user found",false); 
      res.status(200).send(responseObj(404,'user not found',null))
    }
   }else{
      log("please supply all the inputs",false); 
      res.status(500).send(responseObj(500,'Error',null));
   }
  }
  static async fetchUsers(req,res){
    if(req.body.limit && req.body.pageNumber){
       let skip = req.body.pageNumber * req.body.limit
       let userdetails = await user.find({}).skip(skip).limit(req.body.limit);
       if(userdetails){
        res.status(200).send(responseObj(200,'ok',userdetails))
       }else{
        res.status(200).send(responseObj(500,'error',[]))
       }
    }

  }
  static async verifyUser(req, res) {
    if(req.query && 'id' in req.query ){
      const userIdHash = req.query.id.toString();
      const isVerified = await user.findOne({userHash:userIdHash}).catch((e)=>{log(e,false)});
      log(req.query.id,isVerified,false); 
      if(isVerified && isVerified.active != true){
        const verifiedUser = await user.findOneAndUpdate({userHash:userIdHash},{"active":true,userHash:''},{new:true}).catch((e)=>{log(e,false)});     
        if(verifiedUser.active == true){
          log("user verified ",true); 
          res.status(200).send(mailString);
        }else{
          log("user not updated",false); 
          res.status(200).send(mailErrorString);
        }
  
      
      }else{
        console.log(alreadyVerified,'test')
        res.status(500).send(alreadyVerified);
      }
     
    }
  }
  
  
  
  }
 

export default AuthController;
