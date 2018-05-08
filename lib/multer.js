var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
    cb(null, Date.now()+ '-' + file.originalname) 
    }
})
function fileFilter (req, file, cb) {
if(!file.originalname.match(/\.(jpg|png|gif|jpeg|PNG)$/)){
    cb(new Error('Bạn Chỉ được upload file ảnh'));
}else{
    cb(null, true);
}
}
module.exports.upload = multer({ storage: storage,fileFilter:fileFilter }).single('images');