const db = require('../models');

const getAllTrips = async (params) => {
    try {
        let where = 'WHERE status = \'published\'';

        if (params.destination) {
            where += ` AND destination = :destination`;
        }
        if (params.min_price) {
            where += ` AND price >= :min_price`;
        }
        if (params.max_price) {
            where += ` AND price <= :max_price`;
        }
        if (params.start_date) {
            where += ` AND start_date >= :start_date`;
        }
        if (params.category) {
            where += ` AND categories.slug = :category`;
        }
        if (params.sort_by) {
            where += ` ORDER BY :sort_by`;
        }
        if (params.sort_order) {
            where += ` :sort_order`;
        }
        const statement = `
            SELECT trips.*
            FROM trips
            JOIN trip_categories ON trips.id = trip_categories.tripId
            JOIN categories ON trip_categories.categoryId = categories.id
            ${ where }
        `;

        const data = await db.sequelize.query(statement, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: params
        });

        return { success: true, data };
    } catch (error) {
        console.log(error);
        return { success: false, error };
    }
};

module.exports = {
    getAllTrips
};
