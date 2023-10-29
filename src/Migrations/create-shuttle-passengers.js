"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ShuttlePassengers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      shuttleRouteId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "ShuttleRoutes", key: "id" },
      },
      reservationId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "Reservations", key: "id" },
      },
      status: {
        defaultValue: "0",
        allowNull: false,
        type: Sequelize.ENUM("0", "1"),
        /** 
         *   0 [note: 'unchecked']
              1 [note: 'checked'] 
         */
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ShuttlePassengers");
  },
};
