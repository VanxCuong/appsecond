var socket=io("/");
var delay=0,TimeReset=0;
var statusChat=true;
var myInterval,addActivePermiss="";
var Arr=["admin","quản trị","nhân viên"];
document.addEventListener("DOMContentLoaded",function(event){
    var btnSendChat=document.getElementById("onSendChat");
    var contentChat=document.getElementById('contentChat');
    var url=location.pathname;
    setTimeout(() => {
        var sleepChat=document.querySelectorAll(".handle-other .seconds");
        sleep(sleepChat);
    }, 2000);
    // Send room cho server
    socket.emit("client-send-room",url);
    // người dùng gửi tin nhắn
    btnSendChat.onclick=()=>{
        loadMethodGet("/session/users",res=>{
            res=JSON.parse(res);
            // nếu người gửi là người có quyền trong quản trị web site thì thêm active
            if(Arr.indexOf(res.role.toLowerCase())>-1){
                addActivePermiss="active";
            }else{
                addActivePermiss="";
            }
            // Xử lý gửi nội dung lên server và trả ra interface
            if(res.status){
                var data={
                    fullname:res.fullname,
                    _id:res._id,
                    content:contentChat.value
                }
                if(statusChat){
                    socket.emit("client-send-content",data);
                    contentChat.value="";
                    setDelayChat(delay);
                }else{
                    alert(`Bạn vui lòng đợi sau ${TimeReset} để Chat`);
                }
            }
        })
    }
    // Nhận nội dung chat và hiển thị trên interface
    socket.on("server-send-content",data=>{
        var elm=document.querySelector(".frames-show-chat ul li:last-child");
        var xHTML=`
            <li data-user=${data._id} class="${addActivePermiss}">
                <div class="user">
                    <i class="fas fa-user"></i> ${data.fullname}
                </div>
                <div class="content">${data.content}</div>
            </li>
        `;
        elm.insertAdjacentHTML("afterend",xHTML);
        scrollBottomFramesChat();
    })
    // Edit delay chat
    socket.on("server-send-delay",data=>{
        delay=data;
        TimeReset=data;
        setDelayChat(delay);
    })
    // Load view
    setInterval(function() {
        socket.emit("client-reload-view",url);
    }, 2000);
    socket.on("server-reload-view",data=>{
        var elmView=document.getElementById("view");
        var view=Number(data)<10? "0"+data:data;
        elmView.innerHTML=view;
    })
})

var sleep=(elm)=>{
    const url=location.pathname;
    for (let i = 0; i < elm.length; i++) {
        const element = elm[i];
        element.onclick=()=>{
            for (let j = 0; j < elm.length; j++) {
                elm[j].parentElement.classList.remove("active");
            }
            elm[i].parentElement.classList.add("active");
            var data={time:elm[i].children[0].innerHTML,url:url};
            socket.emit("sever-send-sleep",data);
            return false;
        }
    }
}

var setDelayChat=(time)=>{
    console.log('object');
    statusChat=false;
    myInterval=setInterval(() => {
        if(TimeReset===0){
            statusChat=true;
            TimeReset=delay;
            clearInterval(myInterval);
        }else{
            TimeReset--;
        }
    },1000);
}
var scrollBottomFramesChat=()=>{
    var scroll=document.querySelector(".frames-show-chat .list-chat");
    scroll.scrollTop=scroll.scrollHeight-scroll.clientHeight;
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