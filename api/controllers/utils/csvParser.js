import fs from 'fs';

export function parseCSV(filePath) {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const lines = csvData.split('\n');
    const headers = lines.shift().split(',');

    return lines.map(line => {
        const values = line.split(',');
        const record = {};

        headers.forEach((header, index) => {
            const keys = header.split('.');
            let current = record;

            keys.forEach((key, idx) => {
                if (idx === keys.length - 1) {
                    current[key] = values[index];
                } else {
                    current[key] = current[key] || {};
                    current = current[key];
                }
            });
        });

        return record;
    });
}
