document.addEventListener("DOMContentLoaded",function () {
    SetComment();
    //  Xử Lý hiển thị khung hình ảnh.
    HandleImg();
    roomInterFace();
    evaluate();
});

var HTML_CHECK_LOGIN=(res)=>{
    return `<div class="form-group text-center">
<div class="check" style="color:#ce2a2a;">${res}</div>
</div>`;
}
const submitLogin=(elm)=>{
    var urlMain=location.pathname;
    var a=document.getElementById("username-access").value,
        b=document.getElementById("password-access").value,
        url="/login",
        d={username:a,password:b};
    loadDoc(url,d,res=>{
        res=JSON.parse(res);
        if(res.success==true){
            location.reload(urlMain);
        }else{
            elm.parentElement.insertAdjacentHTML("beforebegin",HTML_CHECK_LOGIN(res.message));
        }
    })
}
/**
 * Đánh Giá Bài Viết
 * @param {*} elm 
 */
var textEvaluateSucces=`<p style="color:#3cca3c">Đánh giá của bạn đã được gửi thành công .</p>`;
var submitEvaluate=elm=>{
    if(confirm("Bạn có muốn gửi đánh giá của mình ???")){
        var modalValueEvaluate=document.querySelector(".frames-evaluate .handle-evaluate .text-evaluate");
            modalEvaluate=document.querySelector(".frames-evaluate"),
            framesEvaluate=document.querySelector(".news-detail .news-evaluate"),
            url="/session/users",
            startEvaluate=modalValueEvaluate.getAttribute("data-start"),
            content=document.getElementById("content-Evaluate").value,
            name=document.getElementById("name-Evaluate").value,
            idNews=elm.getAttribute("data-idNews");
        loadMethodGet(url,res=>{
            res=JSON.parse(res);
            data={idNews:idNews,level:startEvaluate,text:content,name:name};
            let url="/evaluate/"+res._id;
            loadDoc(url,data,res=>{
                if(res=="true"){
                    framesEvaluate.innerHTML=textEvaluateSucces;
                    modalEvaluate.classList.remove("show");
                    return;
                }
                if(res=="false"){

                }
            })
        })
    }
}
/**
 * AJAX POST
 * @param {*} url 
 * @param {*} data 
 * @param {*} cb 
 */
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
/**
 * AJAX GET
 * @param {*} url 
 * @param {*} cb 
 */
var loadMethodGet=(url,cb)=>{
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
    xhr.open("GET",url,true);
    xhr.send();
}

var ShowGroupNews=(element)=>{
    var position=element.getAttribute("data-sl"),
        GroupID=element.getAttribute("data-GroupId"),
        EffectLoad=document.querySelector(".loaditem"),
        framesShow=document.querySelector(".av-content .frames-news-main:last-child"),
        data={position:position},
        url="/groups/ShowInterFace/"+GroupID;
    EffectLoad.classList.remove("d-none");
    loadDoc(url,data,res=>{
        var res=JSON.parse(res);
        console.log(res);
        framesShow.insertAdjacentHTML("afterend",res.value);
        if(res.status){
            element.setAttribute("data-sl",Number(position)+4);
        }else{
            element.classList.add("d-none");
        }
        
        EffectLoad.classList.add("d-none");
    })
}
var OptimalFor=(array,cb)=>{
    for (let i = 0; i < array.length; i++) {
        cb(i);
    }
}
//  Xử lý click tab bar
var roomInterFace=()=>{
    var element=document.querySelector(".icon-toogle-menu"),
        frameLeft=document.getElementById("frames-left"),
        frameRight=document.getElementById("frames-right"),
        elementMain=document.querySelector("main.main"),
        elementRemove=document.querySelector(".remove-frames-left");
    element.onclick=()=>{
        var widthBody=window.document.documentElement.clientWidth;
        if(widthBody>568){
            frameLeft.classList.toggle("small-left");
            frameRight.classList.toggle("small-right");
        }else{
            elementMain.style.overflow="hidden";
            frameLeft.classList.toggle("phone-left");
            frameRight.classList.toggle("phone-right");
        }
        console.log(widthBody);
    }
    elementRemove.onclick=()=>{
        elementMain.style.overflow=null;
        frameLeft.classList.remove("phone-left");
        frameRight.classList.remove("phone-right");
    }
}
// Xử lý cmt tự động
var SetComment=()=>{
    var content=document.querySelectorAll("section#frames-left .list-comment .list-comment-content .list-comment-ul li"); 
    var autoMoveComment=setInterval(()=>{
        let ContentActive=document.querySelector("section#frames-left .list-comment .list-comment-content .list-comment-ul li.active");
        var position=0;
        for (position = 0;ContentActive=ContentActive.previousElementSibling; position++) {}
        removeAllClassArray(content,"active");
        if(!content[position].nextElementSibling)
            content[0].classList.add("active");
        else
            content[position].nextElementSibling.classList.add("active");
    },2000)
}
//  Xử lý slides giao diện
var HandleImg=()=>{
    let elementsFather=document.querySelectorAll(".list-photo li"),
        elementsChildren=document.querySelectorAll(".Slides-img li"),
        slideShow=document.querySelector(".Slides-img"),
        removeSlide=document.querySelector(".remove"),
        BodyRemoveSlide=document.querySelector(".Slides-img .black"),
        prev=document.querySelector(".Slides-img .prev"),
        next=document.querySelector(".Slides-img .next");
    // Hiển Thị SLide
    for (let i= 0; i < elementsFather.length; i++) {
        elementsFather[i].onclick=function(){
            slideShow.classList.add("show");
            elementsChildren[i].classList.add("active");
        }
    }
    // Ẩn Slide
    BodyRemoveSlide.onclick=()=>{
        slideShow.classList.remove("show");
        removeAllClassArray(elementsChildren,"active");
    }
    removeSlide.onclick=()=>{
        slideShow.classList.remove("show");
        removeAllClassArray(elementsChildren,"active");
    }
    /**
     * prev click hiển thị img bên trái
     */
    prev.onclick=()=>{
        slides("prev");
    }
    /**
     * prev click hiển thị img bên phải
     */
    next.onclick=()=>{
        slides("next");
    }
    
    /**
     * Fix Lỗi Click nhiều lần.
     * statusNext : Mặc định trạng thái ban đầu true;
     */
    var statusNext=true;
    /**
     * 
     * @param {*} value : nhận 2 giá trị "next" , "prev"
     * next: click nhảy sang phải
     * prev: click nhảy sang trái
     */
    var slides=(value)=>{
        let ChildrenActive=document.querySelector(".Slides-img li.active");
        var pstActive=0;
        if(statusNext){
            statusNext=false;
            // Xác định vị trí ảnh đc active
            pstActive=findPstSlide(pstActive,ChildrenActive);
            var pstNow=elementsChildren[pstActive];
            value=="next"?pstActive=NumberPst(pstNow,pstActive,"next"):pstActive=NumberPst(pstNow,pstActive,"prev");
            var pstPrev=elementsChildren[pstActive];
            ani(pstNow,pstPrev);
        }
    }
    /**
     * 
     * @param {*} pstActive : Vị trí ban slide đc active =>VD: 1 2 3 4 5 6 ...
     * @param {*} ChildrenActive : Thẻ chứa class active.
     * Hàm trả về vị trí của slide " đang " được active.
     * Lúc này chưa xử lý gì cả. Mới chỉ tìm slide đang được active
     */
    var findPstSlide=(pstActive,ChildrenActive)=>{
        for (let i = 0; i < elementsChildren.length; i++) {
            if(elementsChildren[i]==ChildrenActive)
                break;
            pstActive++;
        }
        return pstActive;
    }
    /**
     * 
     * @param {*} pstNow : Vị trí hiện tại.
     * @param {*} pstActive : Vị trí ban slide đc active =>VD: 1 2 3 4 5 6 ...
     * @param {*} value : nhận 2 giá trị "next" , "prev"
     * Hàm này kiểm tra xem. Người dùng click vào nút nào. Nếu click vào nút "next" hoặc "prev" thì tăng thêm 1 hoặc giảm 1.
     * Nếu vị trí slides ở đầu tiên thì trả về giá trị bằng tổng số lượng slides.
     * Nếu vị trí slides ở cuối cùng thì trả về giá trị 0
     */
    var NumberPst=(pstNow,pstActive,value)=>{
        //  Giải nghĩa đoạn dưới: 
        // nếu value=next =>
        // nếu pstNow.nextElementSibling != null thì pstActive++:pstActive=0
        // nếu pstNow.previousElementSibling !=null thì pstActive--:pstActive=elementsChildren.length-1;
        value=="next" ? pstNow.nextElementSibling ? pstActive++:pstActive=0 : pstNow.previousElementSibling ? pstActive--:pstActive=elementsChildren.length-1;
        return pstActive;
    }
    /**
     * 
     * @param {*} a : Vị trí slides hiện tại
     * @param {*} b : Vị trí slides tiếp theo
     * 
     */
    var ani=(a,b)=>{
        let c=0;
        a.classList.add("movedown");
        b.classList.add("moveup");
        // Kết thúc animation ẩn
        var Now=()=>{
            a.classList.remove("movedown");
            a.classList.remove("active");
            c++;
            if(c==2){
                statusNext=true;
                c=0;
            }
        }
        // Kết thúc animation hiển thị
        var Prev=()=>{
            b.classList.remove("moveup");
            b.classList.add("active");
            c++;
            if(c==2){
                statusNext=true;
                c=0;
            }
        }
        a.addEventListener("webkitAnimationEnd",Now);
        b.addEventListener("webkitAnimationEnd",Prev);
    }
}
// Xử lý đánh giá
/**
 * statusEvaluate: Trạng thái đánh giá: Nếu click vào thì statusEvaluate=false => người dùng k thể hover tự động nữa mà chỉ có thể click.s
 */
var statusEvaluate=true;
var evaluate=()=>{
    var star_All=document.querySelectorAll(".news-detail .content-main .news-evaluate ul li");
    var textEvaluate=document.querySelector(".news-detail .content-main .news-evaluate .text-evaluate");
    var modalEvaluate=document.querySelector(".frames-evaluate");
    var modalPeopleEvaluate=document.querySelectorAll(".frames-evaluate ul li");
    // Xử lý hiệu ứng click đánh giá
    OptimalFor(star_All,(i)=>{
        star_All[i].addEventListener("click",()=>{
            var modalValueEvaluate=document.querySelector(".frames-evaluate .handle-evaluate .text-evaluate");
            statusEvaluate=false;
            checkClick=true;
            handleAddClassActive(i);
            modalEvaluate.classList.add("show");
            for (let k = 0; k <= i; k++) {
                modalPeopleEvaluate[k].classList.add("active");
            }
            modalValueEvaluate.setAttribute("data-start",i);
            handleTextEvalue(Number(i),modalValueEvaluate);
        })
    })
    //  Xử lý hiệu ứng hover
    OptimalFor(star_All,i=>{
        star_All[i].onmouseout=()=>{
            if(statusEvaluate){
                removeAllClassArray(star_All,"active");
                setTextEvaluate(textEvaluate,"");
            }
        }
        star_All[i].onmouseover=()=>{ 
            if(statusEvaluate){
                handleAddClassActive(i,textEvaluate);
            }
        }
    })
    // Xử lý phụ
    var handleAddClassActive=(i)=>{
        removeAllClassArray(star_All,"active");
        for (let j = 0; j<=i; j++) {
            star_All[j].classList.add("active");
        }
        handleTextEvalue(i,textEvaluate);
    }
    var handleTextEvalue=(i,elm)=>{
        switch(i){
            case 0:setTextEvaluate(elm,"Yếu");break;
            case 1:setTextEvaluate(elm,"Tạm được");break;
            case 2:setTextEvaluate(elm,"Được");break;
            case 3:setTextEvaluate(elm,"Hay");break;
            case 4:setTextEvaluate(elm,"Rất hay");break;
            default:setTextEvaluate(elm,"Rất hay");break;
        }
    }
}
var setTextEvaluate=(element,value)=>{
    element.innerHTML=value;
}

var removeAllClassArray=(array,nameClass)=>{
    for (let i = 0; i < array.length; i++) {
        array[i].classList.remove(nameClass);
    }
}


