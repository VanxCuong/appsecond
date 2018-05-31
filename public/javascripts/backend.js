document.addEventListener("DOMContentLoaded",function () {
    Category();
    performNews();
    performRouter();
    performCtgChild();
});

var changeCategoryNow=(element)=>{
    var id=element.value;
    var url="/admin/category/"+id;
    var ctgChild=document.querySelector("#categoryChild");
    loadMethodGet(url,res=>{
        console.log(res);
        
        ctgChild.innerHTML=OptionCtgChild(JSON.parse(res));
    })
}
var OptionCtgChild=(value)=>{
    var html="";
    value.categorychild.forEach(element => {
        html+=`<option value='${element._id}'>${element.name}</option>`
    });
    return html;
}
var OptionSetCtgChild=(value,idCtgChild)=>{
    var html="";
    value.categorychild.forEach(element => {
        if(element._id.toString()===idCtgChild.toString()){
            html+=`<option value='${element._id}' selected>${element.name}</option>`
        }else{
            html+=`<option value='${element._id}'>${element.name}</option>`
        }
    });
    return html;
}
var performCtgChild=()=>{
    var elementEdit=document.querySelectorAll(".manager-Category .edit-ctg-child"),
        elementModal=document.querySelector(".manager-Category .method-edit-router"),
        elementTitleCtgChild=document.querySelector(".manager-Category .method-edit-router .title-role span"),
        elementIdCtgChild=document.querySelector(".method-edit-router .title-id span"),
        elementOptionCtgParent=document.querySelectorAll(".method-edit-router .ctg-parent option"),
        elementCtgChild=document.querySelector("#categoryChild");
    OptimalFor(elementEdit,i=>{
        elementEdit[i].onclick=()=>{
            var id=elementEdit[i].getAttribute("href");
                name=elementEdit[i].getAttribute("data-ctg");
                idParent=elementEdit[i].getAttribute("data-id-parent");
            elementModal.classList.add("show");
            elementIdCtgChild.innerHTML=id;
            elementTitleCtgChild.innerHTML=name;
            OptimalFor(elementOptionCtgParent,i=>{
                if(elementOptionCtgParent[i].innerHTML==name){
                    elementOptionCtgParent[i].selected="selected";
                }
            })
            var url="/admin/category/"+idParent;
            loadMethodGet(url,res=>{
                elementCtgChild.innerHTML=OptionSetCtgChild(JSON.parse(res),id);
            })
            return false;
        }
    })
    
}
var performRouter=()=>{
    var elementEdit=document.querySelectorAll(".manager-router .method-router .edit"),
        elementModal=document.querySelector(".method-edit-router"),
        elementModalBlack=document.querySelector(".method-edit-router .black"),
        elementModalUpdate=document.querySelector(".method-edit-router .save"),
        elementTitleRole=document.querySelector(".method-edit-router .title-role span"),
        elementIdRole=document.querySelector(".method-edit-router .title-id span"),
        elementInputEditRouter=document.querySelector(".method-edit-router #RouterID"),
        elementOptionRole=document.querySelectorAll(".method-edit-router option");
        OptimalFor(elementEdit,i=>{
            elementEdit[i].onclick=()=>{
                var value=elementEdit[i].parentElement.previousElementSibling.textContent,
                    role=elementEdit[i].getAttribute("data-role"),
                    router_id=elementEdit[i].getAttribute("data-router"),
                    id=elementEdit[i].getAttribute("href");
                // Set giá trị cho title
                elementTitleRole.innerHTML=role;
                elementIdRole.innerHTML=id;
                elementIdRole.setAttribute("data-router",router_id);
                elementInputEditRouter.value=value;
                OptimalFor(elementOptionRole,i=>{
                    if(elementOptionRole[i].innerHTML==role){
                        elementOptionRole[i].selected="selected";
                    }
                })
                elementModal.classList.add("show");
                return false;
            }
        })
}
// Update Role Router
var UpdateRouterNow=(element)=>{
    var txtRouter=document.querySelector(".method-edit-router #RouterID").value,
        txtIdRole=document.querySelector(".method-edit-router #select-role").value,
        elementId=document.querySelector(".method-edit-router .title-id span"),
        txtIdRouterRole=elementId.textContent,
        router_id=elementId.getAttribute("data-router"),
        data={role_id:txtIdRole,name:txtRouter,id:txtIdRouterRole,router_id:router_id},
        url="/admin/router/update";
    loadDoc(url,data,res=>{
        if(res=="true"){
            alert('Sửa Thành Công !!');
        }
        $('#show_CTG').load(location.href + " #show_CTG>*");
    });
}
/**
 * Hàm Xử lý ẩn form sửa // url - router
 * @param {} elementModalRemove : đối tượng truyền vào
 */
var removePerformRouter=(elementModalRemove)=>{
    var elementModal=document.querySelector(".method-edit-router");
    elementModalRemove.onclick=()=>{
        elementModal.classList.remove("show");
    }
}
var QuantityShow=20;
/**
 * Kiểm tra định dạng email. Đúng thì trả về email sai thì null
 * @param {*} email
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
var HTMLcheckTrue='<i class="fa fa-check" style="color:green"></i>';
var HTMLcheckFalse='<i class="fa fa-times" style="color:red;"></i>';
var changeRegisterEmail=(element)=>{
    var text=element.value;
    var elementCheck=document.querySelector(".form-register .checkEmail");
    if(!validateEmail(text)){
        return elementCheck.innerHTML=HTMLcheckFalse;
    }
    var url ="/users/register/check";
    var data={email:text};
    loadDoc(url,data,(res)=>{
        if(res=="true"){
            while(elementCheck.firstChild){
                elementCheck.removeChild(elementCheck.firstChild);
            }
            elementCheck.innerHTML=HTMLcheckTrue;
        }else{
            elementCheck.innerHTML=HTMLcheckFalse;
        }
    })
}
/**
 * 
 * @param {*} status : Trạng thái boolean gửi true false.
 * True: Hiển thị bên  show tin
 * false: hiển thị bên ẩn tin
 * @param {*} table : Vị trí nhận giá trị thêm vào
 * @param {*} element: Vị trí phần tử được click
 */
var OptimalShowNews=(status,url,element,table,cb)=>{
    element.previousElementSibling.classList.remove("d-none");
    var position=element.getAttribute("data-sl"),
        data={position:position};
    status==true?data.perform=true:data.perform=false;
    loadDoc(url,data,(res)=>{
        cb(position,res);
    })
}
var DivNewsHTML=(data,position)=>{
    var data=JSON.parse(data);
    var content="";
    var others="";
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
var DivUsersHTML=(data,position)=>{
    var data=JSON.parse(data);
    var content="";
    var others="";
    data.forEach((x,y)=>{
        x.status===true?others=`<a href="${x._id}" class="btn btn-outline-success locks"><i class="fa fa-pencil">Khóa</i> </a>`:others=`<a href="${x._id}" class="btn btn-outline-success show"><i class="fa fa-pencil">Mở Khóa</i> </a>`;
        content+=`
            <tr>
              <td>${++position}</td>
              <td>${x.email}</td>
              <td>${x.level}</td>
              <td>${getDayTime(x.create_at)}</td>
              <td>${getDayTime(x.update_at)}</td>
              <td>
                <div class="btn-group">
                  ${others}
                  <a href="/admin/users/edit/${x._id}" class="btn btn-outline-danger edit"><i class="fa fa-pencil">Sửa</i> </a>
                  <a href="${x._id}" class="btn btn-outline-warning remove"><i class="fa fa-remove">Xóa</i> </a>
                </div>
              </td>
            </tr>
        `
    })
    return content;
}
var OptimalShowOption=(element,position,res,cb)=>{
    if(JSON.parse(res).length>0){
        element.setAttribute("data-sl",Number(position)+QuantityShow);
        cb();
        // sử dụng hàm performnews này để lấy lại giá trị hành động vừa thêm vào.
        performNews();
    }
    if(JSON.parse(res).length<QuantityShow){
        element.classList.add("d-none");
    }
}
var showNewsInterFace=(element)=>{
    var table=document.querySelector(".manager-news #reload tr:last-child");
    var url="/admin/News/showInterface";
    OptimalShowNews(true,url,element,table,(position,res)=>{
        element.previousElementSibling.classList.add("d-none");
        OptimalShowOption(element,position,res,()=>{
            table.insertAdjacentHTML("afterend",DivNewsHTML(res,Number(position)));
        })
    });
}
var showNewsInterFaceHidden=(element)=>{
    var url="/admin/News/showInterface";
    var table=document.querySelector(".hidden-news #reload tr:last-child");
    OptimalShowNews(false,url,element,table,(position,res)=>{
        element.previousElementSibling.classList.add("d-none");
        OptimalShowOption(element,position,res,()=>{
            table.insertAdjacentHTML("afterend",DivNewsHTML(res,Number(position)));
        })
    });
}
var showUserInterface=(element)=>{
    var url="/admin/Users/showInterface";
    var table=document.querySelector(".manager-users #reload tr:last-child");
    OptimalShowNews(true,url,element,table,(position,res)=>{
        element.previousElementSibling.classList.add("d-none");
        OptimalShowOption(element,position,res,()=>{
            table.insertAdjacentHTML("afterend",DivUsersHTML(res,Number(position)));
        })
    });
}
var showUserInterfaceHidden=(element)=>{
    var url="/admin/Users/showInterface";
    var table=document.querySelector(".AccountLocks #reload tr:last-child");
    OptimalShowNews(false,url,element,table,(position,res)=>{
        element.previousElementSibling.classList.add("d-none");
        OptimalShowOption(element,position,res,()=>{
            table.insertAdjacentHTML("afterend",DivUsersHTML(res,Number(position)));
        })
    });
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
    /**
     * Xử Lý page News
     */
    var elementDelNewsShow=document.querySelectorAll(".manager-news .del");
    var elementDelNewsHidden=document.querySelectorAll(".hidden-news .del");
    var elementHidden=document.querySelectorAll(".manager-news .hidden");
    var elementShow=document.querySelectorAll(".hidden-news .show");
    var urlRemove="/admin/news/del/";
    var urlHidden="/admin/news/hidden/";
    var urlShow="/admin/news/show/";
    removeElement(elementDelNewsShow,urlRemove,(i,res)=>{
        FixShowElement(".shownews","data-sl");
        elementDelNewsShow[i].parentElement.parentElement.parentElement.remove();

    })
    removeElement(elementDelNewsHidden,urlRemove,(i,res)=>{
        FixShowElement(".shownews","data-sl");
        elementDelNewsHidden[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elementHidden,urlHidden,(i,res)=>{
        // Fix lỗi mỗi khi click xóa - ẩn - hiện.
        FixShowElement(".shownews","data-sl");
        elementHidden[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elementShow,urlShow,(i,res)=>{
        FixShowElement(".shownews","data-sl");
        elementShow[i].parentElement.parentElement.parentElement.remove();
    })
    /**
     * Kết thúcXử Lý page News
     */
    // Xử Lý Trang users
    var elmLockUser=document.querySelectorAll(".manager-users .locks"),
        elmRemoveUser=document.querySelectorAll(".manager-users .remove"),
        elmShowUser=document.querySelectorAll(".AccountLocks .show"),
        elmRemoveUserLock=document.querySelectorAll(".AccountLocks .del"),
        urlLockUser="/admin/users/lock/",
        urlRemoveUser="/admin/users/del/",
        urlShowUser="/admin/users/show/";
    removeElement(elmRemoveUser,urlRemoveUser,(i,res)=>{
        FixShowElement(".shownews","data-sl");
        elmRemoveUser[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elmLockUser,urlLockUser,(i,res)=>{
        FixShowElement(".shownews","data-sl");
        elmLockUser[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elmShowUser,urlShowUser,(i,res)=>{
        FixShowElement(".shownews","data-sl");
        elmShowUser[i].parentElement.parentElement.parentElement.remove();
    })
    removeElement(elmRemoveUserLock,urlRemoveUser,(i,res)=>{
        FixShowElement(".shownews","data-sl");
        elmRemoveUserLock[i].parentElement.parentElement.parentElement.remove();
    })

    // Kết thúc Xử Lý Trang users
}
var FixShowElement=(element,attribute)=>{
    // Fix lỗi mỗi khi click xóa - ẩn - hiện.
    var ButtonShowNews=document.querySelector(element),
    position=ButtonShowNews.getAttribute(attribute);
    ButtonShowNews.setAttribute(attribute,Number(position)-1);
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
var getDayTime=(a)=>{
    var date = new Date(a);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return day + "/" + month + "/" + year;
  }
