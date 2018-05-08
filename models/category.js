const mongoose=require("mongoose");
var Schema = mongoose.Schema;
const schema=new Schema({
    name:{type:String,required:true},
},{collection:"category"});
var Category=module.exports=mongoose.model("Category",schema);
module.exports.createDocument=(dl)=>{
    return new Promise((resolve,reject)=>{
        Category.create(dl,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.getDocument=()=>{
    return new Promise((resolve,reject)=>{
        Category.find({},(err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}
module.exports.deleteDocument=(id)=>{
    return new Promise((resolve,reject)=>{
        Category.remove({_id:id},(err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}
module.exports.updateDocument=(id,data)=>{
    return new Promise((resolve,reject)=>{
        Category.updateOne({_id:id},data,(err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}