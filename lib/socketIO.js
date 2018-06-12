var live=require("../models/live");

/**
 * @server: khởi tạo app. lấy từ file bin
 */
var sockit=(server)=>{
    var io=require("socket.io")(server);
     io.on('connection', (socket) => {
        socket.on("client-send-room",(data)=>{
            socket.join(data);
            socket.RoomUser=data;
        })
        socket.on("client-send-content",(data)=>{
            console.log(socket.adapter.rooms);
            io.sockets.in(socket.RoomUser).emit("server-send-content",data);
        });
    });
}
module.exports=sockit;
