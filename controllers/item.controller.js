const Validator = require("fastest-validator");
const v = new Validator();
const { Item } = require('../models');
const { response } = require('../helpers/response.formatter');
const { Op } = require("sequelize");
const fs = require('fs'); //file system, untuk menghapus file lama ketika update data dengan gambar baru yang berhubungan dengan lokasi file
const path = require('path'); //path, untuk mengakses lokasi file yang akan dihapus ketika update

module.exports = {
    createItem: async (req, res) => {
        try {
            //ambil imputan payload dari body request
            const { name, stock } = req.body;
            // const { image } = req.file; //ambil nama file yang diupload, jika tidak ada maka null

            //validasi
            const schema = {
                name: { type: "string", min: "3" },
                stock: { type: "number", positive: true, integer: true }
            }

            const data = {
                name: name,
                stock: Number(stock)
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                //jika ad error validasi ada error
                return res.status(400).json(response(400, "Validasi Error", validate));
            }
            //cek jika image tidak di upload (req.file : mengambil input file)
            if (!req.file) {
                return res.status(400).json(response(400, "Validasi Error", "Image not found"));
            }

            //proses penyimpanan data ke database
            // I Item nya besar karna disamakan di model
            const item = await Item.create({
                name: data.name, //ambil dari object data yang sudah divalidasi sebelumnya
                stock: data.stock,
                image: req.file.filename //ambil filename hasil dari middleware multer
            });
            return res.status(201).json(response(201, 'created', item));
        } catch (error) {
            // penggunaa err kodingan di try
            // res: parameter func untuk memberikan response
            // response: method dari helpers formatter untuk format hasil outputnya, output dalam bentuk json
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getItem: async (req, res) => {
        try {
            // req.query : ambil params di postman / ambil data acuan untuk search/sort
            // sortBy : urutin berdasarkan field apa
            // order : ASC/DSC, opsi pengurutan
            const { name, sortBy, order, } = req.query;

            const items = await Item.findAll({
                where: name ? {
                    name: {
                        [Op.like]: `%${name}%`
                    } 
                } : {}, // cari berdasarkan field name di db dari name req.query
                // kalau di params postman ada sortby dan order, jalanin pengurutan, kalo gaada pake default. misal sortBy 'stock' order DESC
                order : sortBy && order ? [
                    [sortBy, order] 
                ] : []
            });

            const { page, limit } = req.query;
            // page : ambil data di halaman ke berapa, limit : munculin data berapa
            // offset : menentukan data yang dimunculkan mulai dari berapa
            const offset = (Number(page-1)) * Number(limit);
            // contoh : page 1 : 1-1 = 0 : limitnya 10 : 0 * 10 = 0 jadi offset 0 datanya mulai dari 1, halaman ke satu datanya 1-10
            // contoh : page 2 : 2-1 = 1 : limitnya 10 : 1 * 10 = 10 jadi offset 10 datanya mulai dari 11, halaman ke dua datanya 11-20

            const { count, rows } = await Item.findAndCountAll({
                offset: Number(offset),
                limit: Number(limit),
                // include: [ Item, Return ]// mengambil lebih dari satu relasi, dari nama model
            });
            const formatPagination = {
                data: rows, // data yang dimunculkan
                limit: limit,
                rows: (Number(offset)+1) + "-" + (Number(offset)+rows.length), // munculin angka 1-20 atau 21-30 sesuai yang diambil : misal offset 20 : (20+1) (20+10) : 21-30
                total: count, // jumlah data keseluruhan
                page: page, // sedang di halaman ke berapa
            }
            return res.status(200).json(response(200, "Success", formatPagination));
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message));
        }
    },

    showItem: async (req, res) => {
        try {
            // req.params : ambil path dinamis, /item/2, ambil angka 2 (id)
            const { id } = req.params;
            // findByPk : mencari berdasarkan primary key, yaitu id
            const item = await Item.findByPk(id);
            //jika data yang dicari tidak ada di database (artinya angka id nya salah)
            if (!item) {
                return res.status(404).json(response(404, "Data [id] not found"));
            }
            return res.status(200).json(response(200, "Success", item));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    updateItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, stock } = req.body;
            const schema = {
                name: { type: "string", min: "3" },
                stock: { type: "number", positive: true, integer: true }
            }

            const data = {
                name: name,
                stock: Number(stock)
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                //jika ad error validasi ada error
                return res.status(400).json(response(400, "Validasi Error", validate));
            }
            //cek jika image tidak di upload (req.file : mengambil input file)
            if (!req.file) {
                return res.status(400).json(response(400, "Validasi Error", "Image not found"));
            }
            // validasi stok gaboleh kurang dari stok sebelumnya
            const item = await Item.findByPk(id);
            if (!item) {
                return res.status(404).json(response(404, "Validasi error", "Data not found"));
            }

            // kalau ada file baru, file lama di hapus
            if (req.file) {
                // karna image uda diganti jadi link di getter model, jadi ambil yang aslinya pake detDataValue
                const imageName = item.getDataValue('image'); //ambil nama file yang lama dari database
                // cari image ke folder uploads
                const filePath = path.join(__dirname, "../uploads", imageName);
                // cek jika file ada di folder tersebut, baru dihapus
                if (fs.existsSync(filePath)) { // cek jika file ada di folder uploads
                    fs.unlinkSync(filePath); // hapus file lama
                }
            }

            // hasil dari update proses hanya true/false bukan data terbaru
            const updateProcess = await Item.update({
                name: data.name,
                stock: data.stock,
                image: (req.file ? req.file.filename : item.getDataValue('image')) //jika ada file baru, pakai filename baru, jika tidak ada ambil data asli tanpa link (nama gambar sebelumnya)
            }, {
                where: { id: id }
            });
            // ambil data baru yang uda di update
            const newItem = await Item.findByPk(id); // untuk dimunculkan
            return res.status(200).json(response(200, "Success", newItem));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    deleteItem: async (req, res) => {
        try {
            // buat mencari yang mau dihapus, jika tidak ada maka tidak bisa dihapus
            const { id } = req.params;

            // ambil data item untuk di ambil gambar dan dihapus
            const item = await Item.findByPk(id);
            const imageName = item.getDataValue('image');
            const filePath = path.join(__dirname, "../uploads", imageName);
            if (fs.existsSync(filePath)) { // cek jika file ada di folder uploads
                fs.unlinkSync(filePath); // hapus file lama
            }
            const deleteProcess = await Item.destroy({
                where: { id: id }
            });
            return res.status(200).json(response(200, "Deleted"));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
}