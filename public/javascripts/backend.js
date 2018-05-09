document.addEventListener("DOMContentLoaded",function () {
    Category();
    performNews();
});
/**
 * 
 * @param {*} status : Trạng thái boolean gửi true false.
 * True: Hiển thị bên  show tin
 * false: hiển thị bên ẩn tin
 * @param {*} table : Vị trí nhận giá trị thêm vào
 * @param {*} element: Vị trí phần tử được click
 */
var OptimalShowNews=(status,element,table)=>{
    element.previousElementSibling.classList.remove("d-none");
    var position=element.getAttribute("data-sl"),
        data={position:position},
        url="/admin/News/showInterface";
    status==true?data.perform=true:data.perform=false;
    console.log(data);
    
    element.setAttribute("data-sl",Number(position)+1);
    loadDoc(url,data,(res)=>{
        if(res){
            element.previousElementSibling.classList.add("d-none");
            // table.insertAdjacentHTML("afterend",DivNewsHTML(res,Number(position)));
            table.appendChild(DivNewsHTML(res,Number(position)));
            // sử dụng hàm performnews này để lấy lại giá trị hành động vừa thêm vào.
            performNews();
        }
    })
}
var DivNewsHTML=(data,position)=>{
    var data=JSON.parse(data);
    var content="";
    var others="";
    console.log(data);
    
    data.forEach((x,y)=>{
        x.status===true?others=`<a href="${x._id}" class="btn btn-outline-success hidden"><i class="fa fa-eye-slash"></i> Ẩn</i> </a>`:others=`<a href="${x._id}" class="btn btn-outline-success show"><i class="fa fa-eye-slash"></i> Show</i> </a>`;
        content+=`
            <tr>
                <td>${++position}</td>
                <td><a href="">${x.title}</a></td>
                <td><img src="/uploads/${x.image}" style="width:50px;height:50px" alt=""></td>
                <td>${ x.description}</td>
                <td>${getDateTime(x.create_at)}</td>
                <td>
                <div class="btn-group">
                    ${others}
                    <a href="/admin/news/edit/${x._id}" class="btn btn-outline-danger edit" ><i class="fa fa-pencil"> Sửa</i> </a>
                    <a href="${x._id}" class="btn btn-outline-warning del"><i class="fa fa-remove"> Xóa</i> </a>
                </div>
                </td>
            </tr>
        `
    })
    return content;
}
var showNewsInterFace=(element)=>{
    element.previousElementSibling.classList.remove("d-none");
    var table=document.querySelector(".manager-news #reload tbody"),
        position=element.getAttribute("data-sl"),
        url="/admin/News/showInterface";
    element.setAttribute("data-sl",Number(position)+1);
    loadDoc(url,{position:position,perform:true},(res)=>{
        if(res){
            element.previousElementSibling.classList.add("d-none");
            // console.log(DivNewsHTML(res,Number(position)));
            
            // table.insertAdjacentHTML("afterend",DivNewsHTML(res,Number(position)));
            // // sử dụng hàm performnews này để lấy lại giá trị hành động vừa thêm vào.
            performNews();
        }
    })
}
var showNewsInterFaceHidden=(element)=>{
    var table=document.querySelector(".hidden-news #reload tbody");
    
    // OptimalShowNews(false,element,table);
    
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

var OptimalFor=(array,cb)=>{
    for (let i = 0; i < array.length; i++) {
       cb(i);
    }
}
var Category=()=>{
    var edit=document.querySelectorAll(".manager-Category .edit");
    var save=document.querySelectorAll(".manager-Category .perform-save .save");
    var reset=document.querySelectorAll(".manager-Category .perform-save .reset");
    console.log(edit);
    
    OptimalFor(edit,i=>{
        edit[i].onclick=()=>{
            var element=edit[i].parentElement;
            findElementPrev(element).children[0].style.display="none";
            findElementPrev(element).children[1].style.display="block";
            element.nextElementSibling.style.display="block";
            element.style.display="none";
            return false;
        }
    })
    // Click Lưu
    OptimalFor(save,i=>{
        save[i].onclick=()=>{
            var id=save[i].getAttribute("href");
            var element=save[i].parentElement;
            var valueInput=findElementPrev(element).children[1].value;
            backElementEdit(element);
            findElementPrev(element).children[0].innerHTML=valueInput;
            var data={
                name:valueInput
            }
            console.log(data);
            loadDoc("/admin/category/save/"+id,data,(res)=>{
                if(res){
                    alert('Thay đổi thành công');
                }else{
                    alert('Thay đổi thất bại');
                }
            });
            return false;
        }
    })
    // Click Hủy Edit
    OptimalFor(reset,i=>{
        reset[i].onclick=()=>{
            var element=reset[i].parentElement;
            backElementEdit(element);
            return false;
        }
    })
    var backElementEdit=(element)=>{
        findElementPrev(element).children[0].style.display="block";
        findElementPrev(element).children[1].style.display="none";
        element.previousElementSibling.style.display="block";
        element.style.display="none";
    }
}
/**
 * 
 * @param {*} element : Mảng giá trị các element html
 * @param {*} url : địa chỉ cần truyền đến 
 * Ví dụ: http://localhost:3000/admin/news/edit/5aee648df8586917e8d297a1 
 * Thì chỉ cần tuyền vào url: /admin/news/edit/    .. và id sẽ tự động lấy trong href.. với yêu cầu phần tử click là thẻ a và gắn id ở href
 * @param {*} cb : callback nhận 2 giá trị i , res: 
 * i : là phần tử thứ i trong mảng element.
 * res: kết quả server trả về.
 */
var removeElement=(element,url,cb)=>{
    OptimalFor(element,i=>{
        element[i].onclick=()=>{
            // Fix lỗi mỗi khi click xóa - ẩn - hiện.
            var ButtonShowNews=document.querySelector(".shownews"),
                position=ButtonShowNews.getAttribute("data-sl");
            ButtonShowNews.setAttribute("data-sl",Number(position)-1);

            var id=element[i].getAttribute("href");
            if(confirm("Bạn có muốn thực hiện không ?")){
                loadMethodGet(url+id,(res)=>{
                        cb(i,res)
                })
            }
            return false;
        }
    })
}
var performNews=()=>{
    var elementDelNewsShow=document.querySelectorAll(".manager-news .del");
    var elementDelNewsHidden=document.querySelectorAll(".hidden-news .del");
    var elementHidden=document.querySelectorAll(".manager-news .hidden");
    var elementShow=document.querySelectorAll(".hidden-news .show");
    var urlRemove="/admin/news/del/";
    var urlHidden="/admin/news/hidden/";
    var urlShow="/admin/news/show/";
    removeElement(elementDelNewsShow,urlRemove,(i,res)=>{
        if(res)
            elementDelNewsShow[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elementDelNewsHidden,urlRemove,(i,res)=>{
        if(res)
            elementDelNewsHidden[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elementHidden,urlHidden,(i,res)=>{
        elementHidden[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elementShow,urlShow,(i,res)=>{
        elementShow[i].parentElement.parentElement.parentElement.remove();
    })

}

var findElementPrev=(element)=>{
    return element.parentElement.previousElementSibling;
}
var findElementNext=(element)=>{
    return element.parentElement.nextElementSibling;
}
var getDateTime=(a)=>{
    var date = new Date(a);
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return hour + ":" + min + ":" + sec+" - "+day + "/" + month + "/" + year;
  }
