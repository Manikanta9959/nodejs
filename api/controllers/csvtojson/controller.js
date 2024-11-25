import { parseCSV } from '../utils/csvParser.js';
import { pool } from '../../../db_module/session.js';
import config from '../../../config.js';

// API endpoint to upload csv file and update database
export async function uploadCSV(req, res) {
    try {
        const records = parseCSV(config.csvFilePath);

        for (const record of records) {
            const { name, age, address, ...additionalInfo } = record;
            const fullName = `${name.firstName} ${name.lastName}`;

            await pool.query(
                `INSERT INTO public.users (name, age, address, additional_info, serial4)
                 VALUES ($1, $2, $3, $4, $5)`,
                [fullName, age, JSON.stringify(address), JSON.stringify(additionalInfo),1]
            );
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

        const ageDistribution = {
            '<20': ((ageGroups['<20'] / totalUsers) * 100).toFixed(2),
            '20-40': ((ageGroups['20-40'] / totalUsers) * 100).toFixed(2),
            '40-60': ((ageGroups['40-60'] / totalUsers) * 100).toFixed(2),
            '>60': ((ageGroups['>60'] / totalUsers) * 100).toFixed(2)
        };

        return ageDistribution;
    } catch (err) {
        console.error('Error calculating age distribution:', err);
        throw new Error('Error calculating age distribution');
    }
}

// API endpoint to calculate and return age distribution
export async function ageDistribution(req, res) {
    try {
        const ageDistribution = await calculateAgeDistribution();
        res.status(200).json(ageDistribution);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error calculating age distribution');
    }
}
