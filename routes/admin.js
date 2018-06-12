var express = require('express');
var  upload = require('../lib/multer').upload;
var slug = require('../lib/slug');
var passportjs = require('../lib/passport');
var lib = require('../lib/lib');
var category=require('../models/category');
var user=require('../models/user');
var news=require('../models/news');
var role=require('../models/role');
var routers=require('../models/router');
var live=require('../models/live');
var routerRole=require('../models/RouterRole');
var roleUser=require('../models/roleUser');

var router = express.Router();
var quantityShow=20;
function checkRoleRouter(req,res,next){
    var url="admin"+req.url;
    var arrUrl=url.split("/");
    var k=2;
    if(passportjs.arrRole.indexOf(arrUrl[0])>=0){
        k=1;
        if(passportjs.arrRole1.indexOf(arrUrl[1])>=0){
            k=true;
            if(arrUrl[2]){
                if(passportjs.arrRole2.indexOf(arrUrl[2])>=0){
                    k=true;
                }else{
                    k=false;
                }
            }
        }else{
            k=false;
        }
    }
    next();
    // if(k==true){
    //     next();
    // }else if(k==false){
    //     res.send("hihi k đủ quyền");
    // }else{
    //     res.redirect("/");
    // }
}
router.get('/',checkRoleRouter, function(req, res, next) {
  res.render('./admin/index', { title: 'Express' });
});

/**
 * Category
 */
router.get('/category',checkRoleRouter, function(req, res, next) {
    var checkInputCategory=req.flash("message");
    category.getDocument({}).then(value=>{
        res.render('./admin/managerCategory', { title: 'Express',data:value,checkInputCategory:checkInputCategory[0]});
    }).catch(err=>{
        console.log(err);
    });
});
router.post('/category',checkRoleRouter, function(req, res, next) {
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
router.get('/categorychild',checkRoleRouter, function(req, res, next) {
    category.getDocument({}).then(value=>{
        res.render('./admin/CategoryChild', {data:value});
    }).catch(err=>{
        console.log(err);
    });
});
router.post('/categorychild',checkRoleRouter, function(req, res, next) {
    var {category_id,name}=req.body;
    var data={name:name};
    category.getDocument({_id:category_id}).then(value=>{
       value[0].categorychild.push(data);
       value[0].save((err,result)=>{
            res.redirect('/admin/categorychild');
       })
    })
});
router.get('/categorychild/del/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    category.findOne({'categorychild._id':id}).then(value=>{
        value.categorychild.pull(id);
        value.save((err,result)=>{
            res.redirect('/admin/categorychild');
        })
    }).catch(err=>{
        console.log(err);
    })
});
router.post('/categorychild/update/:id',checkRoleRouter, function(req, res, next) {
    var idchild=req.params.id;
    var {id,name}=req.body;
    console.log(req.body);
    console.log(idchild);
    
    category.findOne({'categorychild._id':idchild}).then(value=>{
        value.categorychild.pull(idchild);
        value.save((err,result)=>{
            if(result){
                category.getDocument({_id:id}).then(value=>{
                    value[0].categorychild.push({name:name});
                    value[0].save((err,result)=>{
                         res.send(true);
                    })
                 }).catch(err=>{
                     res.send(false);
                 });
            }
        })
        
    }).catch(err=>{
        res.send(false);
    })
   
});
router.get('/category/:id', function(req, res, next) {
    var id=req.params.id;
    category.findOne({_id:id}).then(value=>{
        
        res.send(value);
    }).catch(err=>{
        res.send(false);
    });
});
router.get('/category/remove/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var conditionDelNews={category_id:id};
    Promise.all([category.deleteDocument(id),news.deleteDocument(conditionDelNews)]).then(value=>{
        res.redirect('/admin/category');
    }).catch(err=>
        console.log(err)
    );
});
router.post('/category/save/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id,
        data={name:req.body.name};
    category.updateDocument(id,data).then(value=>{
        return res.send(true);
        
    }).catch(err=>{
        return res.send(false);
    });
});
// Kết thúc category
router.get('/cards',checkRoleRouter, function(req, res, next) {
  res.render('./admin/cards', { title: 'Express' });
});
router.get('/blank',checkRoleRouter, function(req, res, next) {
  res.render('./admin/blank', { title: 'Express' });
});
router.get('/charts',checkRoleRouter, function(req, res, next) {
  res.render('./admin/charts', { title: 'Express' });
});
router.get('/register',checkRoleRouter, function(req, res, next) {
    var obj={status:true,text:""};
    var message=req.flash("mess-register");
    if(message[0]){
        obj=message[0];
    }
    res.render('./admin/register',{message:obj});
});
router.get('/navbar', function(req, res, next) {
  res.render('./admin/navbar', { title: 'Express' });
});
router.get('/tables', function(req, res, next) {
  res.render('./admin/tables', { title: 'Express' });
});
// thêm tin tức.
router.get('/addNews',checkRoleRouter, function(req, res, next) {
    var obj=[{status:true,text:""}];
    var message=req.flash("message-add");
    if(message[0]) obj=message;
    category.getDocument({}).then(value=>{
        res.render('./admin/add_News', {data:value,message:obj[0]});
    }).catch(err=>{
        console.log(err);
    });
});
router.post('/addNews',checkRoleRouter,upload, function(req, res, next) {
    var {title,categorychild,description,newsdetail}=req.body;
    var image=req.file.path.split("\\");
    var data={
        title:title,
        image:image[2],
        categorychild_id:categorychild,
        description:description,
        news_detail:newsdetail,
        token:slug(title)
    }
    news.createDocument(data).then(value=>{
        req.flash("message-add",{status:true,text:"Thêm mới thành công"});
        res.redirect('/admin/addNews');
        lib.sendMail(data);
    }).catch(err=>{
        req.flash("message-add",{status:false,text:"Insert thất bại"});
        res.redirect('/admin/addNews');
    });
});
router.get('/News',checkRoleRouter, function(req, res, next) {
    var data={status:1};
    news.getLimitDocument(data,quantityShow,0).then(value=>{
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
router.get('/news/del/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var condition={_id:id};
    news.deleteDocument(condition).then(value=>res.send(true)).catch(err=>res.send(false));
});

router.get('/news/edit/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var obj=[{status:true,text:""}];
    var message=req.flash("mess-edit");
    if(message[0]){
        obj=message
    }
    Promise.all([news.findIDDocument(id),category.getDocument({})]).then(data=>{
        category.getDocument({'categorychild._id':data[0].categorychild_id}).then(value=>{
            res.render("./admin/edit_news",{dataNews:data[0],dataCtg:data[1],message:obj[0],categoryChild:value});
        })
    }).catch(err=>{
        cb(false,err)
    })
});
router.post('/news/edit/:id',upload,checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var {title,categorychild,description,newsdetail}=req.body;
    var data={
        title:title,
        categorychild_id:categorychild,
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
router.get('/news/hidden/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var data={status:0};
    news.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/news/show/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var data={status:1};
    news.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/news/hidden',checkRoleRouter, function(req, res, next) {
    var data={status:0};
    news.getLimitDocument(data,quantityShow,0).then(value=>{
        res.render("./admin/hidden_news",{data:value});
    }).catch(err=>{
        console.log("News"+err);
    });
});


// 
/**
 * Xử Lý Users
 */
router.get('/Users', checkRoleRouter,function(req, res, next) {
    var condition={status:1};
    Promise.all([user.findOption(condition,quantityShow,0),user.countDocument(condition)]).then(value=>{
        res.render('./admin/managerUsers', {data:value[0],countUsers:value[1]});
    })
});
router.get('/Users/hidden',checkRoleRouter, function(req, res, next) {
    var condition={status:0};
    Promise.all([user.findOption(condition,quantityShow,0),user.countDocument(condition)]).then(value=>{
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
router.get('/Users/del/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var condition={_id:id};
    user.removeDocument(condition).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/Users/lock/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var data={status:0};
    user.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/Users/show/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    var data={status:1};
    user.updateDocument(id,data).then(value=>res.send(true)).catch(err=>res.send(false));
});
router.get('/Users/edit/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    Promise.all([roleUser.findOption({user_id:id}),role.findOption({})]).then(value=>{
        res.render("./admin/edit_users",{user:value[0][0],role:value[1]});
    })
});
router.post('/Users/edit/:id',checkRoleRouter, function(req, res, next) {
    var {fullname,address,role_id}=req.body,
        user_id=req.params.id,
        dataUser={fullname:fullname,address:address},
        conditionRoleUser={user_id:user_id},
        dataRoleUser={role_id:role_id};
    Promise.all([roleUser.updateDocument(conditionRoleUser,dataRoleUser),user.updateDocument(user_id,dataUser)]).then(value=>{
        res.redirect("/admin/Users/edit/"+user_id);
    }).catch(err=>{
        console.log(err);
        
    })
    
});
// Kết thúc xử lý Users
router.get('/role',checkRoleRouter, function(req, res, next) {
    var obj={status:true,text:""};
    var message=req.flash("mess-role");
    if(message[0]) obj=message[0];
    role.findOption({}).then(value=>{
        res.render("./admin/role",{data:value,message:obj});
    })
});
router.get('/role/remove/:id',checkRoleRouter, function(req, res, next) {
    var id=req.params.id;
    Promise.all([routerRole.removeRoleDocument(id),roleUser.removeRoleDocument(id),role.removeDocument(id)]).then(value=>{
        res.redirect("/admin/role");
    }).catch(err=>{
        res.send("Xóa Không Thành Công");
    })

});
router.post('/role',checkRoleRouter, function(req, res, next) {
    var data={name:req.body.role};
    role.createDocument(data).then(value=>{
        req.flash("mess-role",{status:true,text:"Thêm mới thành công"})
        return res.redirect("/admin/role");
    }).catch(err=>{
        req.flash("mess-role",{status:false,text:"Thêm mới thất bại"});
        return res.redirect("/admin/role");
    })
});
router.get('/router',checkRoleRouter, function(req, res, next) {
    var obj={status:true,text:""};
    var message=req.flash("mess-router");
    if(message[0]) obj=message[0];
    Promise.all([routerRole.findExtend({}),role.findOption({})]).then(value=>{
        res.render("./admin/router",{data:value[0],role:value[1],message:obj});
    })
});
router.post('/router',checkRoleRouter, function(req, res, next) {
    var ir={name:req.body.router};
    var role_id=req.body.role_id;
    var insertRouter=new routers(ir);
    insertRouter.save((err,result)=>{
        var data={
            router_id:insertRouter._id,
            role_id:role_id
        }
        routerRole.createDocument(data).then(value=>{
            req.flash("mess-router",{status:true,text:"Thêm mới thành công"})
            return res.redirect("/admin/router");
        }).catch(err=>{
            req.flash("mess-router",{status:false,text:"Thêm mới thất bại"});
            return res.redirect("/admin/router");
        })
    })
    
});
router.post('/router/update',checkRoleRouter, function(req, res, next) {
    var {role_id,name,id,router_id}=req.body;
    var data={role_id:role_id};
    var updateRole={name:name};
    Promise.all([routerRole.updateDocument(id,data),routers.updateDocument(router_id,updateRole)]).then(value=>{
        res.send(true);
    }).catch(err=>{
        res.send(false);
    })

});
router.get('/router/remove/:id/:idRouter',checkRoleRouter,
 function(req, res, next) {
    var id=req.params.id,
        idRouter=req.params.idRouter;
    Promise.all([routerRole.removeDocument(id),routers.removeDocument(idRouter)]).then(value=>{
        res.redirect("/admin/router");
    }).catch(err=>{
        res.send("Xóa Không Thành Công");
    })
});


/**
 * Live Stream
 */
router.get('/live',(req,res,next)=>{
    live.findOption({}).then(value=>{
        res.render("./admin/live",{data:value});
    }).catch(err=>{
        req.redirect("/admin/live");
    })
    
})
router.get('/addLive',(req,res,next)=>{
    var obj=[{status:true,text:""}];
    var message=req.flash("mess-edit");
    if(message[0]){
        obj=message
    }
    res.render("./admin/add_live",{message:obj[0]});
})
router.get('/live/del/:id',(req,res,next)=>{
    var id=req.params.id;
    live.removeDocument(id).then(value=>{
         res.redirect('/admin/live');
    }).catch(err=>{
        res.redirect('/admin/live');
    })
})
router.get('/live/edit/:id',(req,res,next)=>{
    var id=req.params.id;
    var obj=[{status:true,text:""}];
    var message=req.flash("mess-edit");
    if(message[0]){
        obj=message
    }
    live.findOne({_id:id}).populate("user_id").then(value=>{
         res.render("./admin/edit_live",{data:value,message:obj[0]});
    }).catch(err=>{
        res.redirect('/admin/live');
    })
})
router.post('/live/edit/:id',upload,(req,res,next)=>{
    var {title,link,user_id}=req.body;
    var data={
        title:title,link:link,user_id:user_id
    }
    var id=req.params.id;
    if(req.file){
        var image=req.file.path.split("\\");
        data.image=image[2];
    }
    live.updateDocument(id,data).then(value=>{
        req.flash("mess-edit",{status:true,text:"Update thành công !!!"});
        res.redirect('/admin/live/edit/'+id);
    }).catch(err=>{
        req.flash("mess-edit",{status:false,text:"Update thất bại !!!"});
        res.redirect('/admin/live/edit/'+id);
    })
})
router.post('/live/update/:id',(req,res,next)=>{
    var id=req.params.id;
    var data={status:Number(req.body.status)};
    live.updateDocument(id,data).then(value=>{
        res.send(true);
    }).catch(err=>{
        res.send(falsef);
    })
})
router.post('/addLive',upload,(req,res,next)=>{
    var {title,link,user_id}=req.body;
    var image=req.file.path.split("\\");
    var data={
        title:title,
        image:image[2],
        token:slug(title),
        link:link,
        user_id:user_id
    }
    live.createDocument(data).then(value=>{
        req.flash('mess-edit',{status:true,text:"Thêm thành công"});
        req.redirect("/admin/addLive");
    }).catch(err=>{
        req.flash("mess-edit",{status:false,text:"Thêm thất bại"})
        res.redirect("/admin/addLive");
    })

})
router.post('/showUser',(req,res,next)=>{
    var fullname=req.body.fullname;
    var txtSearch=slug(fullname);
    const regex=new RegExp(lib.escapeRegex(txtSearch),'gi');
    var xHTML="";
    if(Object.is(fullname,"")){
        user.findOption({},5,0).then(value=>{
            xHTML=xHTML=lib.BrowserLiUser(value);
            res.send(xHTML);
        })
        return;
    }
    user.findOption({token:regex},5,0).then(value=>{
        xHTML=lib.BrowserLiUser(value);
        res.send(xHTML);
    })
    
})

module.exports = router;
