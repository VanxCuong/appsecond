const mongoose=require("mongoose");
var Schema = mongoose.Schema;
var evaluate=require("./evaluate.js");
var comment=require("./comment.js");
var evaluate=require("./evaluate");
const schema=new Schema({
    title:{type:String,required:true,trim:true},
    image:{type:String,required:true},
    description:{type:String,trim:true},
    news_detail:{type:String,trim:true},
    token:{type:String,trim:true},
    categorychild_id:{type: Schema.Types.ObjectId, ref: 'Category' },
    status:{type:Boolean,default:1},
    view:{type:Number,default:0},
    heart:{type:Number,default:0},
    like:{type:Number,default:0},
    evaluate:[evaluate.schema],
    comment:[comment.schema],
    create_at:{type:Date,default:Date.now}
},{collection:"news"});
var News=module.exports=mongoose.model("News",schema);
module.exports.createEvaluate=(idNews,dataEvaluate)=>{
    return new Promise((resolve,reject)=>{
        var newEvalaute=new evaluate(dataEvaluate);
        newEvalaute.save((err,result)=>{
            News.findOne({_id:idNews}).then(value=>{
                value.evaluate.push(newEvalaute);
                value.save((err,result)=>{
                    if(err) return reject(new Error("Đánh giá lỗi"));
                    return resolve(result);
                });
            })
        })
    })
}
module.exports.createDocument=(dl)=>{
    return new Promise((resolve,reject)=>{
        News.create(dl,(err,result)=>{
            if(err) return reject(err);
            return resolve(result);
        })
    })
}
module.exports.getDocument=()=>{
    return new Promise((resolve,reject)=>{
        News.find({},(err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}
/**
 * 
 * @param {*} condition : điều kiện cần tìm
 * @param {*} number : số lượng bản ghi
 * @param {*} position : vị trí
 */
module.exports.getLimitDocument=(condition,number,position)=>{
    return new Promise((resolve,reject)=>{
        News.find(condition).limit(Number(number)).sort({_id:-1}).skip(Number(position)).exec((err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}
module.exports.findIDDocument=(id)=>{
    return new Promise((resolve,reject)=>{
        News.findById(id).populate("category_id").exec((err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}
module.exports.findOrtherDocument=(condition)=>{
    return new Promise((resolve,reject)=>{
        News.find(condition,(err,result)=>{
            if(err) return reject(new Error("Tìm kiếm lỗi"));
            return resolve(result);
        })
    })
}
module.exports.deleteDocument=(condition)=>{
    return new Promise((resolve,reject)=>{
        News.remove(condition,(err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}
module.exports.updateDocument=(id,data)=>{
    return new Promise((resolve,reject)=>{
        News.updateOne({_id:id},data,(err,result)=>{
            if(err) return reject(new Error("Lỗi rồi:"+err));
            return resolve(result);
        })
    })
}