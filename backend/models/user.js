
import { model, Schema } from 'mongoose'
import mongoose from '../database/database';
import { stringify } from 'querystring';

const userSchema = new Schema({
  name: {type:String,required:true},
  gaurdian: {type:String},
  g_relation:{type:String},
  age:{type:Number,default:0},
  gen:{type:String,default:0 },
},{timestamps:true})
export default model('user',userSchema); 

  