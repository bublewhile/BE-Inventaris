'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      item_id: {
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      total_item: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint("Loans", {
      fields: ["item_id"], //column FK
      type: "foreign key",
      name: "fk_loans_items", //nama FK
      references: { //PK nya ada dimana
        table: "Items",
        field: "id"
      },
      //ini optional tapi, dia gak bisa dihapus kalau masih ada data yang mengacu ke PK, jadi harus dihapus dulu data yang mengacu ke PK baru bisa dihapus PK nya
      onDelete: "CASCADE", //jika pk dihapus, data FK juga ikut terhapus
      onUpdate: "CASCADE" //jika pk(id) diupdate, data FK juga ikut terupdate
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Loans');
  }
};