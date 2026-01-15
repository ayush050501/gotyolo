'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categories', [
            {
                name: 'Adventure',
                slug: 'adventure',
            },
            {
                name: 'Cultural',
                slug: 'cultural',
            },
            {
                name: 'Women-Only',
                slug: 'women-only',
            },
            {
                name: 'Weekend',
                slug: 'weekend',
            },
            {
                name: 'International',
                slug: 'international',
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('DELETE FROM categories WHERE slug IN ("adventure", "cultural", "women-only", "weekend", "international")');
    },
};
