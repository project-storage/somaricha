import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameAndPhoneToAddresses1729454400000 implements MigrationInterface {
    name = 'AddNameAndPhoneToAddresses1729454400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if table exists first to avoid chicken-and-egg issues during synchronisation
        const hasAddressesTable = await queryRunner.hasTable('addresses');
        if (!hasAddressesTable) {
            console.log('addresses table does not exist. Skipping column checks as schema synchronization will create it.');
            return;
        }
        
        // Check if columns already exist before adding them
        const table = await queryRunner.query(`DESCRIBE addresses`);
        const columnNames = table.map((col: any) => col.Field);
        
        if (!columnNames.includes('recipient_name')) {
            await queryRunner.query(`ALTER TABLE \`addresses\` ADD COLUMN \`recipient_name\` VARCHAR(255) NULL`);
            console.log('Added recipient_name column to addresses table');
        } else {
            console.log('recipient_name column already exists');
        }
        
        if (!columnNames.includes('phone')) {
            await queryRunner.query(`ALTER TABLE \`addresses\` ADD COLUMN \`phone\` VARCHAR(20) NULL`);
            console.log('Added phone column to addresses table');
        } else {
            console.log('phone column already exists');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasAddressesTable = await queryRunner.hasTable('addresses');
        if (!hasAddressesTable) {
            console.log('addresses table does not exist. Skipping down migration.');
            return;
        }

        const table = await queryRunner.query(`DESCRIBE addresses`);
        const columnNames = table.map((col: any) => col.Field);
        
        if (columnNames.includes('recipient_name')) {
            await queryRunner.query(`ALTER TABLE \`addresses\` DROP COLUMN \`recipient_name\``);
            console.log('Dropped recipient_name column from addresses table');
        }
        
        if (columnNames.includes('phone')) {
            await queryRunner.query(`ALTER TABLE \`addresses\` DROP COLUMN \`phone\``);
            console.log('Dropped phone column from addresses table');
        }
    }
}