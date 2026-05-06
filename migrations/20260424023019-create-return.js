'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Returns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      loan_id: {
        type: Sequelize.BIGINT
      },
      total_item: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.TEXT
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

    await queryInterface.addConstraint("Returns", {
      fields: ["loan_id"], //column FK
      type: "foreign key",
      name: "fk_custom_loan_id", //nama FK
      references: { //PK nya ada dimana
        table: "Loans",
        field: "id"
      },
      onDelete: "CASCADE", //jika pk dihapus, data FK juga ikut terhapus
      onUpdate: "CASCADE" //jika pk(id) diupdate, data FK juga ikut terupdate
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Returns');
  }
};