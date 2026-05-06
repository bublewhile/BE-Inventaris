'use strict';
const { Item } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // ambil data semua item, untuk akses idnya bukan FK item_id
    const items = await Item.findAll();
    let dummyData = [];
    // loop sebanyak 20 data
    for (let index = 1; index <= 20; index++) {
      // mengambil secara acak id dari data item
      const itemId = items[Math.floor(Math.random() * items.length)];
      // math random:  menghasilkan angka 0-1 (termasuk destinasi), item length : itung jumlah item contoh: hasil random 0,5 length itemsnya 3
      // 0.5 * 3 = 1.5 : kemudian di math floor diambil angka seebelum koma = 1 jadi item_id atau 0.9 * 3 = 2.7 jadi item_id nya 2 atau 1 * 3 = 3 jadi item_id nya 3
      let data = {
        item_id: itemId.id, // itemId isinya 
        name: `Peminjam ke-${index}`,
        total_item: 1,
        date: new Date(), // tanggal peminjaman
        createdAt: new Date(),
        updatedAt: new Date()
      };
      dummyData.push(data); // simpan ke data array
    }
    await queryInterface.bulkInsert('Loans', dummyData);
  },

  async down (queryInterface, Sequelize) {
    // kosongkan data
    await queryInterface.bulkDelete('Loans', null, {});
  }
};
