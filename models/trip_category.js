'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class trip_category extends Model {
        static associate(models) {
            trip_category.belongsTo(models.trip);
            trip_category.belongsTo(models.category);
        }
    }

    trip_category.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            tripId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'trips',
                    key: 'id',
                },
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'trip_category',
            tableName: 'trip_categories',
            timestamps: false,
        }
    );

    return trip_category;
};
