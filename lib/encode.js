var bcrypt=require("bcryptjs");
function hash_password(password){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
}
function compare_password(password,hash){
    return bcrypt.compareSync(password, hash); // true 
}
module.exports={
    hash_password:hash_password,
    compare_password:compare_password
}