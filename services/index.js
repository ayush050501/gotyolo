const db = require('../models');

const getAllTrips = async (params) => {
    try {
        let where = 'WHERE status = \'published\'';

        if (params.destination) {
            where += ' AND destination = :destination';
        }
        if (params.min_price) {
            where += ' AND price >= :min_price';
        }
        if (params.max_price) {
            where += ' AND price <= :max_price';
        }
        if (params.start_date) {
            where += ' AND start_date >= :start_date';
        }
        if (params.category) {
            where += ' AND categories.slug = :category';
        }
        if (params.sort_by) {
            if (params?.sort_by?.toLowerCase() !== 'price' && params?.sort_by?.toLowerCase() !== 'start_date') {
                return { success: false, error: 'Invalid sort_by parameter' };
            }
            where += ' ORDER BY :sort_by';
        }
        if (params.sort_order) {
            if (params?.sort_order?.toLowerCase() !== 'asc' && params?.sort_order?.toLowerCase() !== 'desc') {
                return { success: false, error: 'Invalid sort_order parameter' };
            }
            where += ' :sort_order';
        }

        // instead of selecting all fields we can also define what fields we want to select
        const statement = `
            SELECT 
                trips.id,
                trips.title,
                trips.description,
                trips.price,
                trips.start_date,
                trips.destination,
                categories.slug AS category
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
        return { success: false, data: error?.message };
    }
};

const getTripById = async (id) => {
    try {
        const data = await db.trip.findOne({
            where: {
                id
            },
            include: [
                {
                    model: db.trip_category,
                    include: [
                        {
                            model: db.category,
                            attributes: ['slug']
                        }
                    ],
                    attributes: ['categoryId', 'tripId'],
                }
            ],
        });
        return { success: true, data };
    } catch (error) {
        console.log(error);
        return { success: false, data: error?.message };
    }
};


module.exports = {
    getAllTrips,
    getTripById
};
