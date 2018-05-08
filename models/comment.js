const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    text:{type:String,trim:true,required:true},
    level:{type:Number,trim:true,default:1}
},{collection:"comment"})
module.exports=mongoose.model("Comment",schema);