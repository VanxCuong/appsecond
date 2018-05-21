var express = require('express');
var news=require("../models/news");
var category=require("../models/category");
var router = express.Router();
var numberPage=4;
router.get('/:id', function(req, res, next) {
    var id=req.params.id;
    var nameCtg="";
    Promise.all([
        news.getLimitDocument({status:1},numberPage,0),
        category.getDocument({}),
        news.getLimitDocument({status:1,'categorychild_id':id},numberPage,0),
        category.findOne({'categorychild._id':id})
        ]).then(value=>{
            value[3].categorychild.forEach(element => {
                if(element._id==id){
                    nameCtg=element.name;
                }
            });
            res.render('groups_category', {news:value[0],category:value[1],dataNews:value[2],ctgNews:nameCtg });
    }).catch(err=>{
        return res.redirect("/")
    })
});
module.exports = router;