const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema=new Schema({
    name:{type:String,trim:true,default:true}
},{collection:"role"});
var Roles=module.exports=mongoose.model("Role",schema);
module.exports.createDocument=(data)=>{
    return new Promise((resolve,reject)=>{
        Roles.create(data,(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.removeDocument=(id)=>{
    return new Promise((resolve,reject)=>{
        Roles.remove({_id:id},(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.findOption=(condition)=>{
    return new Promise((resolve,reject)=>{
        Roles.find(condition,(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.updateDocument=(id,data)=>{
    return new Promise((resolve,reject)=>{
        Roles.find({_id:id},data,(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
