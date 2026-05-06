const express = require('express')
const app = express()
const port = 3000

const db = require("./models");
const methodOverride = require('method-override');
const itemRoutes = require('./routes/item.routes');
const loanRoutes = require('./routes/loan.routes');
const loginRoutes = require('./routes/login.routes');
const { checkToken } = require('./middlewares/auth');
//cek apakah model - migration - proyek sequelize sudah terhubung dengan baik
db.sequelize.authenticate()
.then(() => console.log('Database (model) terkoneksi.'))
.catch((error) => console.error(error));

// app.use : mendaftarkan routing atau config header lain, urutannya sebelum app.get
app.use(express.json()); //mengambil req-body format json
app.use(methodOverride('_method')); //menggunakan method override untuk mendukung method PUT dan DELETE di form HTML
app.use('/uploads', express.static('uploads')); // agar gambat yang disimpan di folder uploads bisa dibolehkan untuk mengambil/dimunculkan di brouser FE
app.use('/items', checkToken, itemRoutes); // mendaftarkan routes di prefixnya
app.use('/loans', checkToken, loanRoutes);
app.use('/', loginRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
