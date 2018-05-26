var express = require('express');
var news=require("../models/news");
var category=require("../models/category");
var router = express.Router();
var numberPage=4;
router.get('/:token.:id', function(req, res, next) {
    var {token,id}=req.params;
    Promise.all([
        news.getLimitDocument({status:1},numberPage,0),
        category.getDocument({}),
        news.getLimitDocument({status:1,_id:{'$ne':id}},numberPage,0),
        news.findOne({_id:id})])
        .then(value=>{
            Promise.all([
                category.getDocument({'categorychild._id':value[3].categorychild_id}),
                news.getLimitDocument({status:1,_id:{'$ne':id},'categorychild_id':value[3].categorychild_id},numberPage,0),
                news.updateOne({_id:id},{view:++value[3].view})
                ]).then(result=>{
                    res.render('news_detail', {news:value[0],news_detail:value[3],category:value[1],news_Other:value[2],categorychild:result[0],newsCtg:result[1]});
                    /**
                     * news: Các Tin 
                     * news_detail: Chi Tiết tin
                     * category: Danh Mục
                     * categorychild:  Danh Mục Con
                     * news_Other: Tin Mới Nhất
                     * newsCtg: Tin Liên Quan
                     */
            })
    }).catch(err=>{
         return res.redirect('/');
         
    })
});
module.exports = router;