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
            tripId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'trips',
                    key: 'id',
                },
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
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
