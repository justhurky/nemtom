const express = require('express');
const cors = require('cors');
const db = require('./data');
const { validateUser } = require('./validation');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const tables = ['users', 'diet', 'exercises', 'muscle_groups', 'ranks', 'workouts'];

tables.forEach(table => {
    // CREATE
    app.post(`/api/v1/${table}`, (req, res) => {
        db.query(
            `INSERT INTO ${table} SET ?`, req.body,
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err });
                }
                res.status(201).json({ id: result.insertId, ...req.body });
            }
        );
    });

    // READ ALL
    app.get(`/api/v1/${table}`, (req, res) => {
        db.query(`SELECT * FROM ${table}`, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.json(results);
        });
    });

    // READ ONE
    app.get(`/api/v1/${table}/:id`, (req, res) => {
        db.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: `${table.slice(0, -1)} not found` });
            }
            res.json(result[0]);
        });
    });

    // UPDATE
    app.put(`/api/v1/${table}/:id`, (req, res) => {
        db.query(
            `UPDATE ${table} SET ? WHERE id = ?`, [req.body, req.params.id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: `${table.slice(0, -1)} not found` });
                }
                res.json({ message: `${table.slice(0, -1)} updated` });
            }
        );
    });

    // DELETE
    app.delete(`/api/v1/${table}/:id`, (req, res) => {
        db.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: `${table.slice(0, -1)} not found` });
            }
            res.json({ message: `${table.slice(0, -1)} deleted` });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});