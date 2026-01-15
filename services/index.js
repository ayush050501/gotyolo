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
                GROUP_CONCAT(categories.slug) AS categories
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

const createTrip = async (params) => {
    try {
        if (!params?.title || !params?.destination || !params?.price || !params?.start_date || !params?.end_date || !params?.categories?.length || !params?.max_capacity || !params?.available_seats) {
            return { success: false, data: 'Missing required fields to create a new trip' };
        }

        let tripData = await db.trip.create(params);

        const tripCategories = params.categories.map((category) => ({
            tripId: tripData.id,
            categoryId: category?.id
        }));

        const tripCategoriesData = await db.trip_category.bulkCreate(tripCategories, {
            ignoreDuplicates: true,
            returning: true
        });

        tripData = {
            ...tripData,
            trip_category: tripCategoriesData
        };

        return { success: true, data: tripData };
    } catch (error) {
        console.log(error);
        return { success: false, data: error?.message };
    }
};

const bookTrip = async (id, bookInfo) => {
    const transaction = await db.sequelize.transaction();
    try {
        const trip = await db.trip.findOne({
            where: {
                id
            },
            transaction
        });
        if (!trip) {
            return { success: false, data: 'Trip not found' };
        }
        if (trip.available_seats == 0) {
            return { success: false, data: 'Trip is full' };
        }
        if (trip.available_seats < bookInfo?.seats_booked) {
            return { success: false, data: `Only ${ trip.available_seats } seats are available` };
        }
        const data = await db.booking.create({
            tripId: id,
            userId: 1,
            seats_booked: bookInfo?.seats_booked,
            total_price: trip.price * bookInfo?.seats_booked,
            status: 'confirmed'
        }, {
            transaction
        });

        await db.trip.update({
            available_seats: trip.available_seats - bookInfo?.seats_booked
        }, {
            where: {
                id
            },
            transaction
        });

        await transaction.commit();
        return { success: true, data };
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return { success: false, data: error?.message };
    }
};

module.exports = {
    getAllTrips,
    getTripById,
    createTrip,
    bookTrip
};
