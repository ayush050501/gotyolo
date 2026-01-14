module.exports = (sequelize, DataTypes) => {
    const demo_table = sequelize.define('demo_table', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
    return demo_table;
};