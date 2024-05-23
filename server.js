const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const prompt = require('prompt-sync')();

const app = express();
const port = 3000;

app.use(bodyParser.json());


const saveUserToFile = (user, callback) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        let users = [];
        if (!err && data) {
            try {
                users = JSON.parse(data);
                if (!Array.isArray(users)) throw new Error('JSON formatı beklenmeyen bir türde.');
            } catch (e) {
                console.error('JSON parse hatası veya beklenmeyen veri formatı:', e);
            }
        }
        users.push(user);

        fs.writeFile('data.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Dosya yazma hatası:', err);
                callback(err);
            } else {
                console.log('Kullanıcı başarıyla eklendi');
                callback(null);
            }
        });
    });
};

app.post('/save', (req, res) => {
    const { name, lastname } = req.body;

    if (!name || !lastname) return res.status(400).json({ error: 'Name and lastname are required' });

    const newUser = { name, lastname };
    saveUserToFile(newUser, (err) => {
        if (err) return res.status(500).json({ error: 'Error saving user' });
        res.status(200).json({ message: 'User has been added' });
    });
});

app.get('/get', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading file' });
        try {
            const users = JSON.parse(data);
            res.status(200).json(users);
        } catch (e) {
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });
});

app.get('/add', (req, res) => {
    const { name, lastname } = req.query;

    if (!name || !lastname) return res.status(400).json({ error: 'Name and lastname are required' });

    const newUser = { name, lastname };
    saveUserToFile(newUser, (err) => {
        if (err) return res.status(500).json({ error: 'Error saving user' });
        res.status(200).json({ message: 'User has been added' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
