const nodemailer =require("nodemailer");
const key=require("../lib/key");
const userRegisterNew=require("../models/UserRegisterNew");
module.exports.escapeRegex=function escapeRegex(text) {
    return text.replace(/[-[\]({})*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports.BrowserNews=function BrowserNews(array){
    var xHTML="";
    array.forEach(element => {
        var view=element.view<10 && element.view>0? "0"+element.view: element.view;
        xHTML+=`
        <div class="frames-news-main">
            <div class="card text-white frames-news">
                <a href="/news/${element.token}.${element._id}"><div class="img-news" style="background-image:url('/uploads/${element.image}')"></div></a>
                <div class="card-body">
                    <h4 class="card-title title-news"><a href="/news/${element.token}.${element._id}">${element.title}</a></h4>
                    <div class="card-text des-news">${element.description}</div>
                </div>
                <div class="card-footer">
                    <div class="evaluate">
                        <span class="quantity">
                            ${view} lượt xem
                        </span>
                    </div>
                    <div class="detail-news"><i class="fas fa-arrow-right"></i></div>
                </div>
            </div>
        </div>`
    });
    return xHTML;
}
module.exports.sessionURL=(req,res,next)=>{
    if(!req.session.url){
        req.session.url=req.protocol + '://' + req.get('host') + req.originalUrl;
    }else{
        req.session.url=req.protocol + '://' + req.get('host') + req.originalUrl;
    }
    next();
}

module.exports.sendMail=(data)=>{
    var output=`
        <div style="width: 80%;margin: auto;background: #e0e0e0;border-radius: 3px;padding: 26px 0;">
            <h1 style="padding-left: 22px;color: #d23434;font-size: 28px;">Bài Viết Mới</h1>
            <hr/>
            <div style="padding: 20px 0;">
                
                <div style="padding: 20px;background: #9e959559;font-size: 14px;">${data.title}</div>
                <div style="font-size: 13px;color: gray;padding-left: 20px;">${data.news_detail}</div>
            </div>
        </div>
        
        `;
        var transporter=nodemailer.createTransport({
            service:"gmail",
            host: 'imap.gmail.com',
            port: 993,
            secure: true, // true for 465, false for other ports
            auth:{
            user:key.username,
            pass:key.password,
            },
            tls:{
                rejectUnauthorized:false
            }
        })
    userRegisterNew.find({},(err,result)=>{
        result.forEach(item=>{
            setTimeout(() => {
                var mail={
                    from:'"Văn Cương" <xNo1xTLTxLvv@gmail.com>',
                    to:item.email,
                    subject:'Support WebSite:MasterTVC.herokuapp.com',
                    text:"Bài viết mới",
                    html: output // html body
                }
                transporter.sendMail(mail,function (err,result) {
                    if(err){
                        console.log('Lỗi Send Email:'+err);
                        res.send(false);
                    }else{
                        console.log('Email sent');
                        res.send(true);
                    }
                }) 
            }, 100);
        })
        
    })
    
        
}