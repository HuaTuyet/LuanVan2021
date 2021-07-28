const fs = require('fs');
const util = require('util');
const unlinkP = util.promisify(fs.unlink);

exports.deleteFile = function(path){
    if(fs.existsSync('src/public/images' +`/${path}`)){
        unlinkP('src/public/images' +`/${path}`);
        return true;
    }
    else{
        return false;
    }
}