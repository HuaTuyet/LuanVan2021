const util = require('util');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
let dirPath = path.join(`${__dirname}/../../public/images/products`);

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, dirPath);
    },

    filename: (req, file, callback) =>{
        // const filetypes = /jpeg|jpg|png|gif/;
        // const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
        // const mimetype = filetypes.test(file.mimetype);
        // if(mimetype && extname){
            let math = ["image/png", "image/jpeg"];
            if (math.indexOf(file.mimetype) === -1) {
              let errorMess = `file ${file.originalname} không hợp lệ. Chỉ cho phép upload hình ảnh theo kiểu .jpg.`;
              return callback(errorMess, null);
            }
            let filename = `${new Date().valueOf()}${path.extname(file.originalname)}`;
            callback(null, filename);
            // if(fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(1)}.png`)) || fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(1)}.jpg`))){
            //     if(fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(2)}.png`)) || fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(2)}.jpg`))){
            //         if(fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(3)}.png`)) || fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(3)}.jpg`))){
            //             if(fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(4)}.png`)) || fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(4)}.jpg`))){
            //                 if(fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(5)}.png`)) || fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(5)}.jpg`))){
            //                     // if(fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(6)}.png`)) || fs.existsSync(path.join(`${dirPath}/${req.body.masp}H${String(6)}.jpg`))){
            //                     //     let test = "ahihi";
            //                     //     return callback(test, null);
            //                     // }
            //                     // else{
            //                         let filename = `${req.body.masp}H${String(6)}${path.extname(file.originalname)}`;
            //                         callback(null, filename);
            //                     // }
            //                 }
            //                 else{
            //                     let filename = `${req.body.masp}H${String(5)}${path.extname(file.originalname)}`;
            //                     callback(null, filename);
            //                 }
            //             }
            //             else{
            //                 let filename = `${req.body.masp}H${String(4)}${path.extname(file.originalname)}`;
            //                 callback(null, filename);
            //             }
            //         }
            //         else{
            //             let filename = `${req.body.masp}H${String(3)}${path.extname(file.originalname)}`;
            //             callback(null, filename);
            //         }
            //     }
            //     else{
            //         let filename = `${req.body.masp}H${String(2)}${path.extname(file.originalname)}`;
            //         callback(null, filename);
            //     }
            // }
            // else{
            //     let filename = `${req.body.masp}H${String(1)}${path.extname(file.originalname)}`;
            //     callback(null, filename);
            // }
        // }
        // else{
        //     let errorMess = `file ${file.originalname} không hợp lệ. Chỉ cho phép các các kiểu hình như jpeg, jpg, png hoặc gif.`;
        //     callback(errorMess, null);
        // }
    }
});

//Khởi tạo middleware uploadFiles với cấu hình như ở trên,
// Bên trong hàm .array() truyền vào name của thẻ input, ở đây mình đặt là "many-files", và tham số thứ hai là giới hạn số file được phép upload mỗi lần.
let uploadFiles = multer({
    storage: storage, 
    // fileFilter: (req, file, cb) => {
    //     let files = fs.readdirSync(dirPath);
    //     if(req.body.tenhinh == null){
    //         cb(null, true)
    //     }
    //     else{
    //         if(Array.isArray(req.body.tenhinh)){
    //             req.body.tenhinh.forEach(ten => {
    //                 if(files.includes(ten)){
    //                     fs.unlinkSync(path.join(`${dirPath}/${ten}`));
    //                 }
    //                 else{
    //                     cb(null, true)
    //                 }
    //             })
    //         }
    //         else{
    //             if(files.includes(req.body.tenhinh)){
    //                 fs.unlinkSync(path.join(`${dirPath}/${req.body.tenhinh}`));
    //             }
    //             else{
    //                 cb(null, true)
    //             }
    //         }
    //         cb(null, true)
    //     }
        
    // },
}).array("many-files", 6);
// Mục đích của util.promisify() là để bên controller có thể dùng async-await để gọi tới middleware này
let uploadMiddleware = util.promisify(uploadFiles);

module.exports = uploadMiddleware;