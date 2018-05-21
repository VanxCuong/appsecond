const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,required:true},
},{collection:"categorychild"});
module.exports=mongoose.model("CategoryChild",schema);