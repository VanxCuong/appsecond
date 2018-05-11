const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema=new Schema({
    role_id:{type: Schema.Types.ObjectId, ref: 'Role'},
    router_id:{type: Schema.Types.ObjectId, ref: 'Router'},
},{collection:"routerrole"});
var RouterRoles=module.exports=mongoose.model("RouterRole",schema);
module.exports.createDocument=(data)=>{
    return new Promise((resolve,reject)=>{
        RouterRoles.create(data,(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.removeDocument=(id)=>{
    return new Promise((resolve,reject)=>{
        RouterRoles.remove({_id:id},(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.findOption=(condition)=>{
    return new Promise((resolve,reject)=>{
        RouterRoles.find(condition,(err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}
module.exports.findExtend=(condition)=>{
    return new Promise((resolve,reject)=>{
        RouterRoles.find(condition).populate("role_id").populate("router_id").exec((err,result)=>{
            if(err) return reject(new Error(err));
            return resolve(result);
        })
    })
}