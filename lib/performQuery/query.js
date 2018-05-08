var category=require('../../models/category');
var news=require('../../models/news');
/**
 * Hàm search document theo điều kiện truyền vào.
 * @param {*} token : Từ khóa - findNews 
 * @param {*} condition : Là 1 object - bao gồm điều kiện find. VD: {_id:id}
 * @param {*} cb : callback nhận 2 giá trị (status,result) => status: true-false tương đương đúng sai...result là kết quả trả về tương đương với status
 */
module.exports.findCondition=(token,condition,cb)=>{
    switch(token){
        case "findNews":findNews(condition,cb); break;
    }
}
/**
 * Hàm lấy toàn bộ document của collection
 * @param {*} token :Từ khóa getNews
 * @param {*} cb : callback nhận 2 giá trị (status,result) => status: true-false tương đương đúng sai...result là kết quả trả về tương đương với status
 */
module.exports.getAll=(token,cb)=>{
    switch(token){
        case "getNews":getAllNews(cb);break;
        case "getCategory":getCategory(cb);break;
    }
}
/**
 * Hàm search document
 * @param {*} token :Từ khóa :getIdAndAllNew
 * từ khóa getIdAndAllNew: Hàm search document theo ID và all danh mục.
 * @param {*} id : id truyền vào
 * @param {*} cb :callback nhận 2 giá trị (status,result) => status: true-false tương đương đúng sai...result là kết quả trả về tương đương với status
 */
module.exports.getOthers=(token,id,cb)=>{
    switch(token){
        case "getIdAndAllNew":getAllCtgAndIdNews(id,cb);break;
    }
}
/**
 * 
 * @param {*} token :Từ khóa updateNews
 * @param {*} id :id cần cập nhật
 * @param {*} data : Dữ liệu cần cập nhật
 * @param {*} cb :callback nhận 2 giá trị (status,result) => status: true-false tương đương đúng sai...result là kết quả trả về tương đương với status
 */
module.exports.updateID=(token,id,data,cb)=>{
    switch(token){
        case "updateNews":updateNews(id,data,cb);break;
        case "updateCategory":updateCategory(id,data,cb);break;
    }
}
/**
 * 
 * @param {*} token :Từ khóa updateNews
 * @param {*} id :id cần cập nhật
 * @param {*} cb :callback nhận 2 giá trị (status,result) => status: true-false tương đương đúng sai...result là kết quả trả về tương đương với status
 */
module.exports.removeID=(token,id,cb)=>{
    switch(token){
        case "removeNews":removeNews(id,cb);break;
        case "removeCategory":removeCategory(id,cb);break;
    }
}
module.exports.add=(token,data,cb)=>{
    switch(token){
        case "addNews":addNews(data,cb);break;
        case "addCategory":addCategory(data,cb);break;
    }
}
var addCategory=(data,cb)=>{
    category.createDocument(data).then(value=>cb(true,value)).catch(err=>cb(false,err));
}
var removeCategory=(id,cb)=>{
    category.deleteDocument(id).then(value=>cb(true,value)).catch(err=>cb(false,err));
}
var updateCategory=(id,dl,cb)=>{
    category.updateDocument(id,dl).then(value=>cb(true,value)).catch(err=>cb(false,err));
}
var getCategory=(cb)=>{
    category.getDocument().then(value=>cb(true,value)).catch(err=>cb(false,err));
}
var removeNews=(id,cb)=>{
    news.deleteDocument(id).then(value=>cb(true,value)).catch(err=>cb(false,err))
}
var addNews=(data,cb)=>{
    news.createDocument(data).then(value=>cb(true,value)).catch(err=>cb(false,err));
}
var findNews=(data,cb)=>{
    news.findOrtherDocument(data).then(value=>cb(true,value)).catch(err=>cb(ferr));
}
var updateNews=(id,dl,cb)=>{
    news.updateDocument(id,dl).then(value=>cb(true,value)).catch(err=>cb(false,err));
}
var getAllNews=(cb)=>{
    news.getDocument().then(value=>{cb(true,value)}).catch(err=>cb(false,err));
}
var getAllCtgAndIdNews=(id,cb)=>{
    Promise.all([news.findIDDocument(id),category.getDocument()]).then(value=>{cb(true,value)}).catch(err=>{cb(false,err)})
}