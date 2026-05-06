const multer = require("multer");
//path: agar bisa mengakes folder dile di project
const path = require("path");

//pressupload multer disimpan di middleware karena
//middleware: penghubung/tengah proses (route - middleware0 controller)
//sblm file di akses controller, oleh middleware di proses dulu agar siap digunakan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //cb: callback, untuk menentukan folder penyimpanan file yang diupload
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        //cb: callback, untuk menentukan nama file yang diupload
        const ext = path.extname(file.originalname); //ambil ekstensi file yang diupload
        //uniqueSuffix isinya nama file random, ext isinya .jpg jadi perlu digabung
        const name = file.fieldname + "-" + uniqueSuffix + ext; //nama file yang diupload akan menjadi fieldname + uniqueSuffix + ekstensi file
        cb(null, name);
    }
});

module.exports = multer({ storage: storage });