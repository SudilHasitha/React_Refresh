import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import { OkPacket, ResultSetHeader } from 'mysql2';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/api/trending', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM company_logos ORDER BY count DESC LIMIT 5');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/search', async (req, res) => {
    const { searchTerm, company } = req.body;
    
    try {
        const [rows]: [any[], any] = await connection.execute(
            'SELECT * FROM company_logos WHERE name = ?',
            [searchTerm]
        );

        if (rows.length > 0) {
            const [updateResult] = await connection.execute<ResultSetHeader>(
                'UPDATE company_logos SET count = ? WHERE id = ?',
                [rows[0].count + 1, rows[0].id]
            );
            if (updateResult.affectedRows > 0) {
                return res.json({ success: true });
            }
        } else {
            const [insertResult] = await connection.execute<ResultSetHeader>(
                'INSERT INTO company_logos (name, count, domain, logo_url) VALUES (?, ?, ?, ?)',
                [searchTerm, 1, company.domain, company.logo_url]
            );
            if (insertResult.affectedRows > 0) {
                return res.json({ success: true });
            }
        }
        res.status(400).json({ success: false, message: 'No changes made' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
