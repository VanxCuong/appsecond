var live=require("../models/live");
var status=function(items){
    this.items=items || {};
    this.add=(url,time)=>{
        var statusRoom=items[url];
        if(!statusRoom){
            statusRoom=this.items[url]={time:time};
        }
        return statusRoom;
    }
    this.show=()=>{
        for(var item in this.items){
            console.log(this.items[item]);
        }
    }
    this.delete=(id)=>{
        delete this.items[id];
    }
    this.convertArray=()=>{
        var arr=[];
        for (const item in this.items) {
            arr.push(this.items[item]);
        }
        return arr;
    }
    this.updateOne=(url,time)=>{
        var item=this.items[url];
        if(item){
            item.time=time;
        }
    }
    this.getTime=(url)=>{
        var item=this.items[url];
        return item.time;
    }
}
var items={};
var Delay=new status(items);
// Tạo room cho những trạng Phòng đang live stream
var addRoom=(socket)=>{
    live.findOption({status:1}).then((value) => {
        value.forEach(e => {
            const room="/live/"+e.token+"."+e.id;
            socket.join(room);
            Delay.add(room,0);
        });
    })
}

/**
 * @server: khởi tạo app. lấy từ file bin
 */
var sockit=(server)=>{
    // let arr=new Array;
    var io=require("socket.io")(server);
     io.on('connection', (socket) => {
        addRoom(socket);
        // Client click vào xem live stream => server tự động tạo room cho client đós
        socket.on("client-send-room",(data)=>{
            socket.join(data);
            socket.RoomUser=data;
            socket.emit("server-send-delay",Delay.getTime(data));
        })
        // client gửi nội dung chat
        socket.on("client-send-content",(data)=>{
            io.sockets.in(socket.RoomUser).emit("server-send-content",data);
        });
        // Nhận lời lấy thông tin room trả về client
        socket.on("client-reload-view",(url)=>{
            if(socket.adapter.rooms[url]){
                socket.emit("server-reload-view",socket.adapter.rooms[url].length);
            }
        })
        // Client gửi chế độ delay chat
        socket.on("sever-send-sleep",delay=>{
            Delay.updateOne(delay.url,delay.time);
            socket.emit("server-send-delay",Delay.getTime(delay.url));
        })
    });
}
module.exports=sockit;
