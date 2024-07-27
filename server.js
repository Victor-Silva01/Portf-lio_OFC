const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Configurar multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Configurar o diretório público
app.use(express.static('public'));

// Rota para salvar o projeto
app.post('/save-project', upload.single('photo'), (req, res) => {
    const { title, language, type, description } = req.body;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : '';

    // Salvar projeto em um arquivo JSON
    const project = { title, photo: photoPath, language, type, description };
    fs.appendFile('projects.json', JSON.stringify(project) + '\n', err => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

// Rota para obter projetos
app.get('/get-projects', (req, res) => {
    fs.readFile('projects.json', 'utf8', (err, data) => {
        if (err) throw err;
        const projects = data.trim().split('\n').map(line => JSON.parse(line));
        res.json(projects);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
