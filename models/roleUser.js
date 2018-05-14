const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    user_id:{type: Schema.Types.ObjectId, ref: 'User' },
    role_id:{type: Schema.Types.ObjectId, ref: 'Role'},
},{collection:"roleuser"});
var RoleUsers=module.exports=mongoose.model("RoleUser",schema);
module.exports.createDocument=(data)=>{
    return new Promise((resolve,reject)=>{
        RoleUsers.create(data,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.updateDocument=(condition,data)=>{
    return new Promise((resolve,reject)=>{
        RoleUsers.updateOne(condition ,data,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.findOption=(condition)=>{
    return new Promise((resolve,reject)=>{
        RoleUsers.find(condition).populate("user_id").populate("role_id").exec((err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.removeRoleDocument=(id)=>{
    return new Promise((resolve,reject)=>{
        RoleUsers.remove({role_id:id},(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
