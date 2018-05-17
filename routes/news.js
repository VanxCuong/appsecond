var express = require('express');
var news=require("../models/news");
var router = express.Router();
var numberPage=4;
router.get('/:token.:id', function(req, res, next) {
    var {token,id}=req.params;
    Promise.all([news.getLimitDocument({status:1},numberPage,0),news.findIDDocument(id)]).then(value=>{
        res.render('news_detail', {news:value[0],news_detail:value[1]});
    })
});
module.exports = router;