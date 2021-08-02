const util = require('util');
const path = require('path');
const multer = require('multer');
let dirPath = path.join(`${__dirname}/../../public/dist/image/brands`);

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(`${__dirname}/../../public/images/${req.body.path}`));
    },
 
    filename: (req, file, callback) =>{
        // const filetypes = /jpeg|jpg|png|gif/;
        // const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
        // const mimetype = filetypes.test(file.mimetype);
        // if(mimetype && extname){
            let math = ["image/jpeg"];
            if (math.indexOf(file.mimetype) === -1) {
              let errorMess = `file ${file.originalname} không hợp lệ. Chỉ cho phép upload hình ảnh theo kiểu .jpg.`;
              return callback(errorMess, null);
            }
            let filename = `${new Date().valueOf()}${path.extname(file.originalname)}`;
            callback(null, filename);
        // }
        // else{
        //     let errorMess = `file ${file.originalname} không hợp lệ. Chỉ cho phép các các kiểu hình như jpeg, jpg, png hoặc gif.`;
        //     callback(errorMess, null);
        // }
    }
});

//Khởi tạo middleware uploadFiles với cấu hình như ở trên,
// Bên trong hàm .array() truyền vào name của thẻ input, ở đây mình đặt là "file", và tham số thứ hai là giới hạn số file được phép upload mỗi lần.
let uploadFile = multer({storage: storage}).single("file");
// Mục đích của util.promisify() là để bên controller có thể dùng async-await để gọi tới middleware này
//let uploadMiddleware = util.promisify(uploadFile);

module.exports = uploadFile;