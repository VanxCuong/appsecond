const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema=new Schema({
    title:{type:String,trim:true,default:true,required:true},
    image:{type:String,trim:true},
    token:{type:String,trim:true},
    link:{type:String,trim:true,required:true},
    user_id:{type:Schema.Types.ObjectId,ref:"User"},
    status:{type:Boolean,default:1},
    create_at:{type:Date,default:Date.now}
},{collection:"live"});
var Lives=module.exports=mongoose.model("Live",schema);
module.exports.createDocument=(data)=>{
    return new Promise((resolve,reject)=>{
        Lives.create(data,(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.removeDocument=(id)=>{
    return new Promise((resolve,reject)=>{
        Lives.remove({_id:id},(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.findOption=(condition)=>{
    return new Promise((resolve,reject)=>{
        Lives.find(condition).sort({_id:-1}).exec((err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.updateDocument=(id,data)=>{
    return new Promise((resolve,reject)=>{
        Lives.updateOne ({_id:id},data,(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
