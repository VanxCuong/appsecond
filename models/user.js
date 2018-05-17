const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    fullname:{type:String,default:"Khách hàng"},
    email:{type:String,required:true,trim:true,unique:true},
    password:{type:String,required:true},
    birthday:{type:String,default:"01/01/1970"},
    phone:{type:String},
    id:{type:Number},
    address:{type:String},
    sex:{type:Boolean,default:1},
    resetPasswordToken:{type:String},
    resetPasswordExpires:{type:Date},
    create_at:{type:Date,default:Date.now},
    update_at:{type:Date,default:Date.now},
    status:{type:Boolean,default:1},
    level:{type:Number,default:1}
},{collection:"user"});
var Users=module.exports=mongoose.model("User",schema);
module.exports.findOption=(condition,number,position)=>{
    return new Promise((resolve,reject)=>{
        Users.find(condition).limit(Number(number)).sort({_id:-1}).skip(Number(position)).exec((err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}
module.exports.createDocument=(data)=>{
    return new Promise((resolve,reject)=>{
        Users.create(data,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.removeDocument=(condition)=>{
    return new Promise((resolve,reject)=>{
        Users.remove(condition,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.countDocument=(condition)=>{
    return new Promise((resolve,reject)=>{
        Users.count(condition,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.updateDocument=(id,data)=>{
    return new Promise((resolve,reject)=>{
        Users.updateOne({_id:id},data,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}