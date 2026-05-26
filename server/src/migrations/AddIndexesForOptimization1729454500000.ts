import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesForOptimization1729454500000 implements MigrationInterface {
    name = 'AddIndexesForOptimization1729454500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            // 1. Index on orders (user_id, status)
            const orderIndexes = await queryRunner.query(`SHOW INDEX FROM \`orders\` WHERE Key_name = 'idx_orders_user_status'`);
            if (orderIndexes.length === 0) {
                await queryRunner.query(`CREATE INDEX \`idx_orders_user_status\` ON \`orders\` (\`user_id\`, \`status\`)`);
                console.log('Created index idx_orders_user_status on orders table');
            }
        } catch (e) {
            console.error('Error creating orders index, it may already exist or table may not exist:', e);
        }

        try {
            // 2. Index on address_options (user_id)
            const aoIndexes = await queryRunner.query(`SHOW INDEX FROM \`address_options\` WHERE Key_name = 'idx_address_options_user'`);
            if (aoIndexes.length === 0) {
                await queryRunner.query(`CREATE INDEX \`idx_address_options_user\` ON \`address_options\` (\`user_id\`)`);
                console.log('Created index idx_address_options_user on address_options table');
            }
        } catch (e) {
            console.error('Error creating address_options index, it may already exist or table may not exist:', e);
        }

        try {
            // 3. Index on addresses (ao_id)
            const addrIndexes = await queryRunner.query(`SHOW INDEX FROM \`addresses\` WHERE Key_name = 'idx_addresses_ao'`);
            if (addrIndexes.length === 0) {
                await queryRunner.query(`CREATE INDEX \`idx_addresses_ao\` ON \`addresses\` (\`ao_id\`)`);
                console.log('Created index idx_addresses_ao on addresses table');
            }
        } catch (e) {
            console.error('Error creating addresses index, it may already exist or table may not exist:', e);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            // Drop orders index
            const orderIndexes = await queryRunner.query(`SHOW INDEX FROM \`orders\` WHERE Key_name = 'idx_orders_user_status'`);
            if (orderIndexes.length > 0) {
                await queryRunner.query(`DROP INDEX \`idx_orders_user_status\` ON \`orders\``);
                console.log('Dropped index idx_orders_user_status');
            }
        } catch (e) {
            console.error('Error dropping orders index:', e);
        }

        try {
            // Drop address_options index
            const aoIndexes = await queryRunner.query(`SHOW INDEX FROM \`address_options\` WHERE Key_name = 'idx_address_options_user'`);
            if (aoIndexes.length > 0) {
                await queryRunner.query(`DROP INDEX \`idx_address_options_user\` ON \`address_options\``);
                console.log('Dropped index idx_address_options_user');
            }
        } catch (e) {
            console.error('Error dropping address_options index:', e);
        }

        try {
            // Drop addresses index
            const addrIndexes = await queryRunner.query(`SHOW INDEX FROM \`addresses\` WHERE Key_name = 'idx_addresses_ao'`);
            if (addrIndexes.length > 0) {
                await queryRunner.query(`DROP INDEX \`idx_addresses_ao\` ON \`addresses\``);
                console.log('Dropped index idx_addresses_ao');
            }
        } catch (e) {
            console.error('Error dropping addresses index:', e);
        }
    }
}
