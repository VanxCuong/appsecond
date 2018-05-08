const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    text:{type:String,trim:true},
    level:{type:Number,trim:true,required:true}
},{collection:"evaluate"})
module.exports=mongoose.model("Evaluate",schema);