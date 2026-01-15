'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class trip extends Model {
    static associate(models) {
      trip.hasMany(models.trip_category);

      trip.hasMany(models.booking);
    }

    hasAvailableSeats(requestedSeats = 1) {
      return this.available_seats >= requestedSeats;
    }

    isBookable() {
      return this.status === 'published' && this.available_seats > 0;
    }
  }

  trip.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      destination: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      max_capacity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      available_seats: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
    },
    {
      sequelize,
      modelName: 'trip',
      tableName: 'trips',
      timestamps: true,
      validate: {
        datesValid() {
          if (this.end_date < this.start_date) {
            throw new Error('End date must be after or equal to start date');
          }
        },
        seatsValid() {
          if (this.available_seats > this.max_capacity) {
            throw new Error('Available seats cannot exceed max capacity');
          }
        },
      },
    }
  );

  return trip;
};