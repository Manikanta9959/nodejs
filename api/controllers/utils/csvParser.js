import fs from 'fs';
import readline from 'readline';

// Stream-based CSV parser for large files
export async function parseCSVStream(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream });

    const records = [];
    let headers;

    for await (const line of rl) {
        const values = line.split(',');

        if (!headers) {
            headers = values;
            continue;
        }

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

        records.push(record);
    }

    return records;
}
