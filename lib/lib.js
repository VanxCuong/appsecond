module.exports.escapeRegex=function escapeRegex(text) {
    return text.replace(/[-[\]({})*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports.BrowserNews=function BrowserNews(array){
    var xHTML="";
    array.forEach(element => {
        var view=element.view<10&&element.view>0? "0"+element.view: element.view;
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