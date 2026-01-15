'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class booking extends Model {
        static associate(models) {
            booking.belongsTo(models.trip);

            booking.belongsTo(models.user);
        }

        isCancellable() {
            return ['pending', 'confirmed'].includes(this.status);
        }
    }

    booking.init(
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
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            seats_booked: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0,
                },
            },
            status: {
                type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
                allowNull: false,
                defaultValue: 'pending',
            },
            booked_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'booking',
            tableName: 'bookings',
            timestamps: true,
            createdAt: 'booked_at',
            updatedAt: 'updated_at',
        }
    );

    return booking;
};
