const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    name:{type:String,trim:true},
    text:{type:String,trim:true,required:true},
    level:{type:Number,trim:true,required:true} /** Điểm Đánh Giá */
},{collection:"evaluate"})
module.exports=mongoose.model("Evaluate",schema);

