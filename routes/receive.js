var express = require('express');
var news=require("../models/news");
var category=require("../models/category");
var lib=require("../lib/lib");
var UserRegisterNew=require("../models/UserRegisterNew");
var router = express.Router();
router.post('/news', function(req, res, next) {
    var {name,email}=req.body;
    var data={name:name,email:email};
    req.check("name","Bạn chưa nhập tên").notEmpty();
    req.check("email","Sai định dạng Email").isEmail();
    var errors=req.validationErrors();
    if(errors){
        res.send(errors);
    }else{
        UserRegisterNew.findOne({email:email}).then(value=>{
            if(!value){
                UserRegisterNew.createDocument(data).then(value=>{
                    res.send(true);
                })
            }else{
                res.send(false);
            }
        })
    }
});
module.exports = router;