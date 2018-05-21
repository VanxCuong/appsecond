document.addEventListener("DOMContentLoaded",function () {
    scrollPage();
});
var load_content=()=>{
    return `<div class="card text-white frames-news">
    <a href=""><div class="img-news" style="background-image:url('../images/1.jpg')"></div></a>
    <div class="card-body">
        <h4 class="card-title title-news"><a href="">123</a></h4>
        <div class="card-text des-news">123123</div>
    </div>
    <div class="card-footer">
        <div class="evaluate">
            <span class="quantity">3</span>
            <span class="element-evl like"><i class="far fa-thumbs-up"></i></span>
            <span class="quantity">3</span>
            <span class="element-evl heart"><i class="far fa-heart"></i></span>
        </div>
        <div class="detail-news"><i class="fas fa-arrow-right"></i></div>
    </div>`   
}
var loadStatus=true;
function scrollPage(){
    var url="/load";
    var page=1;
    var heightPage=screen.height;
    var elementLoad=document.querySelector(".tab-content .handleOrther");
    window.addEventListener("scroll",()=>{
        var positionScroll=window.scrollY;
        var sumHeightPage=document.documentElement.scrollHeight;
        var elementContent=document.querySelector(".tab-content .av-content .frames-news-main:last-child");
        console.log(sumHeightPage);
        
        if(heightPage+positionScroll>=sumHeightPage&&loadStatus==true){
            elementLoad.classList.remove("d-none");
            loadStatus=false;
            page+=1;
            var data={page:page};
            loadDoc(url,data,(res)=>{
                if(res){
                    elementLoad.classList.add("d-none");
                    if(res=="false"){
                        return loadStatus=false;
                    }
                    console.log(res);
                    elementContent.insertAdjacentHTML("afterend",res);
                    setTimeout(()=>{
                        loadStatus=true;
                    },200)
                } 
            })
        }
    })
}

var loadDoc=(url,data,cb)=>{
    if (window.XMLHttpRequest) {
        //code for IE7+, Firefox, Chrome and Opera
        xhr = new XMLHttpRequest();
    }else {
        //code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(this.responseText);
        }
    };
    xhr.open("POST",url,true);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("content-type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
}