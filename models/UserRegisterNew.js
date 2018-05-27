const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema=new Schema({
    name:{type:String,trim:true},
    email:{type:String,trim:true,required:true,lowercase:true}
},{collection:"userregisternew"});
var UserRegisterNew=module.exports=mongoose.model("UserRegisterNew",schema);

module.exports.createDocument=dl=>{
    return new Promise((resolve,reject)=>{
        UserRegisterNew.create(dl,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}