document.addEventListener('DOMContentLoaded', function (event) {
    LoadUser();
});
var height=null;
var removeUserChoose=()=>{
    let elmRemove=document.querySelector(".frames-value .icon");
    elmRemove.onclick=()=>{
        elmRemove.parentElement.parentElement.parentElement.remove();
    }
}
var LoadUser=()=>{
    var input=document.querySelector(".form-add #fullname"),
        container=document.querySelector(".container-fluid"),
        elmShowUser=document.querySelector(".frames-select-user ul"),
        elmShow=document.querySelector(".frames-select-user"),
        elmInput=document.getElementById("user-choose"),
        url="/admin/showUser";
    
    // user client input
    loadDoc(url,{fullname:""},res=>{
        elmShowUser.innerHTML=res;
        hoverElm();
    })
    input.addEventListener("click",()=>{
        elmShow.setAttribute("frames-selected","true");
    })
    container.onclick=()=>{
        elmShow.setAttribute("frames-selected","false");
    }
    input.addEventListener('keyup', function (event) {
        let value=input.value.length>0?input.value:"";
        let data={
            fullname:value
        }
        var key = event.key || event.keyCode;
        if(key==="Enter"||key==="ArrowDown"||key==="ArrowUp"||key==="Tab"){
            return false;
        }
        loadDoc(url,data,res=>{
            elmShowUser.innerHTML=res;
            elmShow.setAttribute("frames-selected","true");
            hoverElm();
        })
    });
    
    document.addEventListener('keyup', function (event) {
        var elmShowUser=document.querySelector(".frames-select-user"),
            sttShowUser=elmShowUser.getAttribute("frames-selected"),
            allElmUser=document.querySelectorAll(".frames-select-user ul li"),
            addChoose=document.querySelector(".frames-choose ul li");
        if (event.defaultPrevented) {
            return;
        }
        var key = event.key || event.keyCode;
        /**
         * Xử lý nút tab và enter
         */
        if(key==="Enter"||key==="Tab"&& sttShowUser==="true"){
            for (let i = 0; i < allElmUser.length; i++) {
                const element = allElmUser[i];
                if(element.getAttribute("data-selected","true")=="true"){
                    var id= element.getAttribute("id");
                    let value=element.innerHTML;
                    var xHTML=`<li>
                                <div class="frames-value">
                                <div class="badge badge-info" id="123">
                                    <div class="text">${value}</div>
                                    <div class="icon"><i class="fa fa-remove"></i></div>
                                </div>
                                </div>
                            </li>`;
                    addChoose.insertAdjacentHTML("beforeend",xHTML);
                    elmShow.setAttribute("frames-selected","false");
                    elmInput.value=id;
                    removeUserChoose();
                    break;
                }
            }
        }
        /**
         * Xử lý nút di xuống
         */
        if (key === "ArrowDown" && sttShowUser==="true") {
            for (let i = 0; i < allElmUser.length; i++) {
                if(allElmUser[i].getAttribute("data-selected")==="true"){
                    var pstCorrent=allElmUser[i];
                    for (let i = 0; i < allElmUser.length; i++) {
                        editAttribute(allElmUser[i],"data-selected","false");
                    }
                    var pstNext=i;
                    var pstNext=pstCorrent.nextElementSibling;
                    pstNext=pstCorrent.nextElementSibling ? i+1:0;
                    editAttribute(allElmUser[pstNext],"data-selected","true");
                    return;
                }
            }
        }
        /**
         * Xử lý nút di lên
         */
        if (key === "ArrowUp" &&sttShowUser==="true") {
            for (let i = 0; i < allElmUser.length; i++) {
                if(allElmUser[i].getAttribute("data-selected")=="true"){
                    var pstCorrent=allElmUser[i];
                    var pstNext=0;
                    var pstNext=pstCorrent.nextElementSibling;
                    pstNext=!pstCorrent.previousElementSibling? allElmUser.length-1:i-1;
                    for (let i = 0; i < allElmUser.length; i++) {
                        editAttribute(allElmUser[i],"data-selected","false");
                    }
                    editAttribute(allElmUser[pstNext],"data-selected","true");
                    break;
                }
            }
        }
        
    });
}
/**
 * Xử lý hiệu ứng hover
 */
var hoverElm=()=>{
    var allElmUser=document.querySelectorAll(".frames-select-user ul li"),
        elmShow=document.querySelector(".frames-select-user"),
        elmInput=document.getElementById("user-choose"),
        addChoose=document.querySelector(".frames-choose ul li");
    for (let i = 0; i < allElmUser.length; i++) {
        const element = allElmUser[i];
        element.onmouseover=()=>{
            for (let k = 0; k < allElmUser.length; k++) {
                editAttribute(allElmUser[k],"data-selected","false");
            }
            editAttribute(element,"data-selected","true");
        }
        element.onclick=()=>{
            var id= element.getAttribute("id");
            let value=element.innerHTML;
            var xHTML=`<li>
                            <div class="frames-value">
                                <div class="badge badge-info" id="123">
                                    <div class="text">${value}</div>
                                    <div class="icon"><i class="fa fa-remove"></i></div>
                                </div>
                            </div>
                        </li>`;
            addChoose.insertAdjacentHTML("beforeend",xHTML);
            elmShow.setAttribute("frames-selected","false");
            elmInput.value=id;
            removeUserChoose();
            return false;
        }
    }
}
var editAttribute=(elm,a,b)=>{
    elm.setAttribute(a,b);
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