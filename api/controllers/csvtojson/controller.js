import { parseCSVStream } from '../utils/csvParser.js';
import { pool } from '../../../db_module/session.js';
import config from '../../../config.js';

// API endpoint to upload CSV file and update the database
export async function uploadCSV(req, res) {
    try {
        const records = await parseCSVStream(config.csvFilePath);
        const batchSize = 1000; 
        const batch = [];

        for (const record of records) {
            const { name, age, address, ...additionalInfo } = record;

            // Validation for required fields
            if (!name || !name.firstName || !name.lastName || !age) {
                console.error(`Invalid record: ${JSON.stringify(record)}`);
                continue;
            }

            const fullName = `${name.firstName} ${name.lastName}`;
            batch.push([fullName, age, JSON.stringify(address), JSON.stringify(additionalInfo)]);

            if (batch.length === batchSize) {
                await insertBatch(batch);
                batch.length = 0;
            }
        }

        if (batch.length > 0) {
            await insertBatch(batch);
        }

        const ageDistribution = await calculateAgeDistribution();

        res.status(200).json({
            message: 'CSV data uploaded successfully!',
            ageDistribution: ageDistribution,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading CSV data');
    }
}

// Insert batch of records into the database
async function insertBatch(batch) {
    try {
        const values = [];
        const placeholders = batch
            .map((_, batchIndex) => {
                const offset = batchIndex * 5;
                return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
            })
            .join(', ');

        batch.forEach(record => {
            if (record.length === 4) {
                record.push(1);
            }
            if (record.length !== 5) {
                throw new Error(
                    `Record has incorrect number of values: expected 5, got ${record.length}. Record: ${JSON.stringify(record)}`
                );
            }
            values.push(...record);
        });

        const query = `
            INSERT INTO public.users (name, age, address, additional_info, serial4)
            VALUES ${placeholders}
        `;

        await pool.query(query, values);
    } catch (err) {
        console.error('Error in batch insert:', err);
        throw err;
    }
}



// Calculate age distribution
async function calculateAgeDistribution() {
    try {
        const result = await pool.query('SELECT age FROM public.users');
        const ageGroups = { '<20': 0, '20-40': 0, '40-60': 0, '>60': 0 };

        result.rows.forEach(row => {
            const age = row.age;
            if (age < 20) ageGroups['<20']++;
            else if (age <= 40) ageGroups['20-40']++;
            else if (age <= 60) ageGroups['40-60']++;
            else ageGroups['>60']++;
        });

        const totalUsers = result.rows.length;
        return {
            '<20': ((ageGroups['<20'] / totalUsers) * 100).toFixed(2),
            '20-40': ((ageGroups['20-40'] / totalUsers) * 100).toFixed(2),
            '40-60': ((ageGroups['40-60'] / totalUsers) * 100).toFixed(2),
            '>60': ((ageGroups['>60'] / totalUsers) * 100).toFixed(2),
        };
    } catch (err) {
        console.error('Error calculating age distribution:', err);
        throw new Error('Error calculating age distribution');
    }
}

// API endpoint to fetch age distribution
export async function ageDistribution(req, res) {
    try {
        const ageDistribution = await calculateAgeDistribution();
        res.status(200).json(ageDistribution);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error calculating age distribution');
    }
}
