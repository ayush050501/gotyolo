'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('trip_categories', {
            tripId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'trips',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'categories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        });

        await queryInterface.addIndex('trip_categories', ['categoryId'], {
            name: 'idx_trip_categories_category',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('trip_categories');
    },
};
