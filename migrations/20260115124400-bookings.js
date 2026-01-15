'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tripId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'trips',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      seats_booked: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      bookedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('bookings', ['tripId'], {
      name: 'idx_bookings_trip',
    });
    await queryInterface.addIndex('bookings', ['userId'], {
      name: 'idx_bookings_user',
    });
    await queryInterface.addIndex('bookings', ['status'], {
      name: 'idx_bookings_status',
    });
    await queryInterface.addIndex('bookings', ['bookedAt'], {
      name: 'idx_bookings_booked_at',
    });
    
    await queryInterface.addIndex('bookings', ['tripId', 'userId'], {
      name: 'idx_unique_active_booking',
      unique: true,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE bookings
      ADD CONSTRAINT chk_seats_positive CHECK (seats_booked > 0)
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  },
};