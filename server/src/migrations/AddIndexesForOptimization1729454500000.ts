import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexesForOptimization1729454500000 implements MigrationInterface {
    name = 'AddIndexesForOptimization1729454500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            // 1. Index on orders (user_id, status)
            const table = await queryRunner.getTable('orders');
            if (table && !table.indices.some(idx => idx.name === 'idx_orders_user_status')) {
                await queryRunner.createIndex('orders', new TableIndex({
                    name: 'idx_orders_user_status',
                    columnNames: ['user_id', 'status']
                }));
                console.log('Created index idx_orders_user_status on orders table');
            }
        } catch (e) {
            console.error('Error creating idx_orders_user_status index:', e);
        }

        try {
            // 2. Index on address_options (user_id)
            const table = await queryRunner.getTable('address_options');
            if (table && !table.indices.some(idx => idx.name === 'idx_address_options_user')) {
                await queryRunner.createIndex('address_options', new TableIndex({
                    name: 'idx_address_options_user',
                    columnNames: ['user_id']
                }));
                console.log('Created index idx_address_options_user on address_options table');
            }
        } catch (e) {
            console.error('Error creating idx_address_options_user index:', e);
        }

        try {
            // 3. Index on addresses (ao_id)
            const table = await queryRunner.getTable('addresses');
            if (table && !table.indices.some(idx => idx.name === 'idx_addresses_ao')) {
                await queryRunner.createIndex('addresses', new TableIndex({
                    name: 'idx_addresses_ao',
                    columnNames: ['ao_id']
                }));
                console.log('Created index idx_addresses_ao on addresses table');
            }
        } catch (e) {
            console.error('Error creating idx_addresses_ao index:', e);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            const table = await queryRunner.getTable('orders');
            if (table && table.indices.some(idx => idx.name === 'idx_orders_user_status')) {
                await queryRunner.dropIndex('orders', 'idx_orders_user_status');
                console.log('Dropped index idx_orders_user_status');
            }
        } catch (e) {
            console.error('Error dropping orders index:', e);
        }

        try {
            const table = await queryRunner.getTable('address_options');
            if (table && table.indices.some(idx => idx.name === 'idx_address_options_user')) {
                await queryRunner.dropIndex('address_options', 'idx_address_options_user');
                console.log('Dropped index idx_address_options_user');
            }
        } catch (e) {
            console.error('Error dropping address_options index:', e);
        }

        try {
            const table = await queryRunner.getTable('addresses');
            if (table && table.indices.some(idx => idx.name === 'idx_addresses_ao')) {
                await queryRunner.dropIndex('addresses', 'idx_addresses_ao');
                console.log('Dropped index idx_addresses_ao');
            }
        } catch (e) {
            console.error('Error dropping addresses index:', e);
        }
    }
}
