'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('trips', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            destination: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            max_capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            available_seats: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('draft', 'published'),
                allowNull: false,
                defaultValue: 'draft',
            },
            createdAt: {
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

        await queryInterface.addIndex('trips', ['status'], {
            name: 'idx_trips_status',
        });
        await queryInterface.addIndex('trips', ['destination'], {
            name: 'idx_trips_destination',
        });
        await queryInterface.addIndex('trips', ['start_date'], {
            name: 'idx_trips_start_date',
        });
        await queryInterface.addIndex('trips', ['price'], {
            name: 'idx_trips_price',
        });
        await queryInterface.addIndex('trips', ['available_seats'], {
            name: 'idx_trips_available_seats',
        });
        await queryInterface.addIndex('trips', ['status', 'start_date', 'destination', 'price'], {
            name: 'idx_trips_discovery',
        });

        await queryInterface.sequelize.query(`
      ALTER TABLE trips
      ADD CONSTRAINT chk_price_positive CHECK (price >= 0),
      ADD CONSTRAINT chk_capacity_positive CHECK (max_capacity > 0),
      ADD CONSTRAINT chk_seats_non_negative CHECK (available_seats >= 0),
      ADD CONSTRAINT chk_seats_capacity CHECK (available_seats <= max_capacity),
      ADD CONSTRAINT chk_dates CHECK (end_date >= start_date)
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('trips');
    },
};
