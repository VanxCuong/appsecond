var express = require('express');
var  upload = require('../lib/multer').upload;
var slug = require('../lib/slug');
var category=require('../models/category');
var user=require('../models/user');
var news=require('../models/news');
var router = express.Router();
router.get('/', function(req, res, next) {
  res.render('./admin/index', { title: 'Express' });
});

/**
 * Category
 */
router.get('/category', function(req, res, next) {
    var checkInputCategory=req.flash("message");
    category.getDocument().then(value=>{
        res.render('./admin/managerCategory', { title: 'Express',data:value,checkInputCategory:checkInputCategory[0]});
    }).catch(err=>{
        console.log(err);
    });
});
router.post('/category', function(req, res, next) {
    var data={name:req.body.name};
    req.check("name","Bạn Chưa nhập tên").notEmpty();
    var errors=req.validationErrors();
    if(!errors){
        category.createDocument(data).then(value=>{
            res.redirect("/admin/category");
        }).catch(err=>{
            console.log(err);
            
        });
    }else{
        req.flash("message","Mời bạn nhập tên danh mục");
        res.redirect("/admin/category");
    }
});
router.get('/category/remove/:id', function(req, res, next) {
    var id=req.params.id;
    category.deleteDocument(id).then(value=>{
        res.redirect('/admin/category');
    }).catch(err=>
        console.log(err)
    );
});
router.post('/category/save/:id', function(req, res, next) {
    var id=req.params.id,
        data={name:req.body.name};
    category.updateDocument(id,data).then(value=>{
        return res.send(true);
        
    }).catch(err=>{
        return res.send(false);
    });
});
// Kết thúc category
router.get('/cards', function(req, res, next) {
  res.render('./admin/cards', { title: 'Express' });
});
router.get('/blank', function(req, res, next) {
  res.render('./admin/blank', { title: 'Express' });
});
router.get('/charts', function(req, res, next) {
  res.render('./admin/charts', { title: 'Express' });
});
router.get('/register', function(req, res, next) {
    var obj={status:true,text:""};
    var message=req.flash("mess-register");
    if(message[0]){
        obj=message[0];
    }
    console.log(obj);
    
    res.render('./admin/register',{message:obj});
});
router.get('/navbar', function(req, res, next) {
  res.render('./admin/navbar', { title: 'Express' });
});
router.get('/tables', function(req, res, next) {
  res.render('./admin/tables', { title: 'Express' });
});
// thêm tin tức.
router.get('/addNews', function(req, res, next) {
    var obj=[{status:true,text:""}];
    var message=req.flash("message-add");
    if(message[0]) obj=message;
    category.getDocument().then(value=>{
        res.render('./admin/add_News', {data:value,message:obj[0]});
    }).catch(err=>{
        console.log(err);
    });
});
router.post('/addNews',upload, function(req, res, next) {
    var {title,category,description,newsdetail}=req.body;
    var image=req.file.path.split("\\");
    var data={
        title:title,
        image:image[2],
        category_id:category,
        description:description,
        news_detail:newsdetail,
        token:slug(title)
    }
    news.createDocument(data).then(value=>{
        req.flash("message-add",{status:true,text:"Thêm mới thành công"});
            res.redirect('/admin/addNews');
    }).catch(err=>{
        req.flash("message-add",{status:false,text:"Insert thất bại"});
        res.redirect('/admin/addNews');
    });
});
router.get('/News', function(req, res, next) {
    var data={status:1};
    news.getLimitDocument(data,1,0).then(value=>{
        res.render('./admin/managerNews',{data:value});
    }).catch(err=>{
        console.log("News"+err);
    });
});
router.post('/News/showInterface', function(req, res, next) {
    var data={},
        perform=req.body.perform,
        position=req.body.position;
    perform==true?data={status:1}:data={status:0};
    news.getLimitDocument(data,1,position).then(value=>{
        res.send(value)
    }).catch(err=>{
        console.log("News"+err);
    });
});
router.get('/news/del/:id', function(req, res, next) {
    var id=req.params.id;
    news.deleteDocument(id).then(value=>res.send(true)).catch(err=>res.send(false));
});

router.get('/news/edit/:id', function(req, res, next) {
    var id=req.params.id;
    var obj=[{status:true,text:""}];
    var message=req.flash("mess-edit");
    if(message[0]){
        obj=message
    }
    Promise.all([news.findIDDocument(id),category.getDocument()]).then(data=>{
        res.render("./admin/edit_news",{dataNews:data[0],dataCtg:data[1],message:obj[0]});
    }).catch(err=>{
        cb(false,err)
    })
});
router.post('/news/edit/:id',upload, function(req, res, next) {
    var id=req.params.id;
    var {title,category,description,newsdetail}=req.body;
    var data={
        title:title,
        category_id:category,
        description:description,
        news_detail:newsdetail,
        token:slug(title)
    }
    if(req.file){
        var image=req.file.path.split("\\");
        data.image=image[2];
    }
    news.updateDocument(id,data).then(value=>{
        req.flash("mess-edit",{status:true,text:"Sửa thành công"})
        return  res.redirect("/admin/news/edit/"+id);
    }).catch(err=>{
        req.flash("mess-edit",{status:false,text:"Sửa thất bại"});
        return  res.redirect("/admin/news/edit/"+id);
    });

});
router.get('/news/hidden/:id', function(req, res, next) {
    var id=req.params.id;
    var data={status:0};
    news.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/news/show/:id', function(req, res, next) {
    var id=req.params.id;
    var data={status:1};
    news.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/news/hidden', function(req, res, next) {
    var data={status:0};
    news.getLimitDocument(data,1,0).then(value=>{
        res.render("./admin/hidden_news",{data:value});
    }).catch(err=>{
        console.log("News"+err);
    });
});


// 
/**
 * Xử Lý Users
 */
router.get('/Users', function(req, res, next) {
    var condition={status:1};
    Promise.all([user.findOption(condition,1,0),user.countDocument(condition)]).then(value=>{
        res.render('./admin/managerUsers', {data:value[0],countUsers:value[1]});
    })
});
router.get('/Users/hidden', function(req, res, next) {
    var condition={status:0};
    Promise.all([user.findOption(condition,1,0),user.countDocument(condition)]).then(value=>{
        res.render('./admin/AccountLocks', {data:value[0],countUsers:value[1]});
    })
});
router.post('/Users/showInterface', function(req, res, next) {
    var data={},
        perform=req.body.perform,
        position=req.body.position;
    perform==true?data={status:1}:data={status:0};
    user.findOption(data,1,position).then(value=>{
        res.send(value);
    }).catch(err=>{
        res.send(false);
    })
});
router.get('/Users/del/:id', function(req, res, next) {
    var id=req.params.id;
    user.removeDocument(id).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/Users/lock/:id', function(req, res, next) {
    var id=req.params.id;
    var data={status:0};
    user.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/Users/show/:id', function(req, res, next) {
    var id=req.params.id;
    var data={status:1};
    user.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/Users/edit/:id', function(req, res, next) {
    res.render("./admin/edit_users");
});

module.exports = router;
