import { parseCSV } from '../utils/csvParser.js';
import { pool } from '../../../db_module/session.js';
import config from '../../../config.js';

export async function uploadCSV(req, res) {
    try {
        const records = parseCSV(config.csvFilePath);

        for (const record of records) {
            const { name, age, ...additionalInfo } = record;
            const fullName = `${name.firstName} ${name.lastName}`;

            await pool.query(
                `INSERT INTO public.users (name, age, address, additional_info,serial4)
                 VALUES ($1, $2, $3, $4, $5)`,
                [fullName, age, JSON.stringify(record.address), JSON.stringify(additionalInfo), 1]
            );            
        }

        res.status(200).send('CSV data uploaded successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading CSV data');
    }
}

export async function ageDistribution(req, res) {
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

        console.log('Age Distribution:', ageGroups);
        res.status(200).json(ageGroups);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error calculating age distribution');
    }
}
