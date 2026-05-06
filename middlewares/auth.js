const jwt = require('jsonwebtoken');
const { response } = require('../helpers/response.formatter');
const { auth_secret } = require('../config/base.config');

module.exports = {
    checkToken: async (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) {
            // 401: err untuk pengguna yang belum login
            return res.status(401).json(response(401, "unauthorized", "Please login and try again!"));
        }

        try {
            // cek token aktif atau engga (blm expired)
            const check = jwt.verify(token, auth_secret);
            // karena nanti pengguna perlu data identitas pengguna, panggil payload yang dikirimjwt.sign() di login controller dan simpan di req
            // data payload tersimpan di const check (hasil verify), ada userId, nama, email
            req.user = check;
            next(); // lanjutkan proses routing yang diminta
        } catch (error) {
            // jika terjadi error, ini hubungannya dengan token, jadi kasi 401 (karna login lagi)
            return res.status(401).json(response(401, "unauthorized", "Please login and try again!"));
        }
    }
}