import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNameAndPhoneToAddresses1729454400000 implements MigrationInterface {
    name = 'AddNameAndPhoneToAddresses1729454400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if table exists first to avoid chicken-and-egg issues during synchronisation
        const table = await queryRunner.getTable('addresses');
        if (!table) {
            console.log('addresses table does not exist. Skipping column checks as schema synchronization will create it.');
            return;
        }
        
        // Check if columns already exist before adding them
        if (!table.findColumnByName('recipient_name')) {
            await queryRunner.addColumn('addresses', new TableColumn({
                name: 'recipient_name',
                type: 'varchar',
                length: '255',
                isNullable: true
            }));
            console.log('Added recipient_name column to addresses table');
        } else {
            console.log('recipient_name column already exists');
        }
        
        if (!table.findColumnByName('phone')) {
            await queryRunner.addColumn('addresses', new TableColumn({
                name: 'phone',
                type: 'varchar',
                length: '20',
                isNullable: true
            }));
            console.log('Added phone column to addresses table');
        } else {
            console.log('phone column already exists');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('addresses');
        if (!table) {
            console.log('addresses table does not exist. Skipping down migration.');
            return;
        }
        
        if (table.findColumnByName('recipient_name')) {
            await queryRunner.dropColumn('addresses', 'recipient_name');
            console.log('Dropped recipient_name column from addresses table');
        }
        
        if (table.findColumnByName('phone')) {
            await queryRunner.dropColumn('addresses', 'phone');
            console.log('Dropped phone column from addresses table');
        }
    }
}