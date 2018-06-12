var socket=io("/");

document.addEventListener("DOMContentLoaded",function(event){
    var btnSendChat=document.getElementById("onSendChat");
    var contentChat=document.getElementById('contentChat');
    var url=location.pathname;
    
    // Send room cho server
    socket.emit("client-send-room",url);
    // người dùng gửi tin nhắn
    btnSendChat.onclick=()=>{
        loadMethodGet("/session/users",res=>{
            res=JSON.parse(res);
            if(res.status){
                var data={
                    fullname:res.fullname,
                    _id:res._id,
                    content:contentChat.value
                }
                socket.emit("client-send-content",data);
            }
        })
        
    }
    socket.on("server-send-content",data=>{
        console.log(data);
        
    })
})
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