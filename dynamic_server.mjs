import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import { default as express } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const port = 8000;
const root = path.join(__dirname, 'public');
const template = path.join(__dirname, 'templates');
const data = path.join(__dirname, 'data');


let app = express();
app.use(express.static(root));

const db = new sqlite3.Database(path.join(data, 'data.sqlite3'), sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Database read error');
    } else {
        console.log('Fully connected to database');
    }
});

// Homepage display
app.get('/', (req, res) => {
    // Get file path to index.html
    let filepath = path.join(template, 'index.html');

    fs.readFile(filepath, "utf-8", (err, data) => {
        console.log(filepath);
        if (err) {
            console.log('Home Read Error');
            res.status(404).type('txt').send('File not found');
        } else {
            console.log('Home Read Success');
            res.status(200).type('html').send(data);
        }
    });
})

// Route 1: Relationship Status
app.get('/rel/:relStatus?/:entry?', (req, res) => {
    // relStatus and entry are optional
    let relStatus = req.params.relStatus;
    let entry = req.params.entry;
    let filepath;

    // Check if entry is populated
    if (entry) {
        // Go to participant because entry populated
        filepath = path.join(template, 'participant.html');
    } else {
        // Otherwise display result page
        filepath = path.join(template, 'result.html');

        // Check if relStatus is populated, then display queries based on it
    }
    

    fs.readFile(filepath, "utf-8", (err, data) => {
        console.log(filepath);
        if (err) {
            console.log('Relation Read Error');
            res.status(404).type('txt').send('File not found');
        } else {
            console.log(entry);
            console.log(relStatus);
            console.log('Relation Read Success');
            res.status(200).type('html').send(data);
        }
    });
});

// Route 2: Gender
app.get('/gdr/:gender?/:entry?', (req, res) => {
    // gender and entry are optional
    let gender = req.params.relStatus;
    let entry = req.params.entry;
    let filepath;

    // Check if entry is populated
    if (entry) {
        // Go to participant because entry populated
        filepath = path.join(template, 'participant.html');
    } else {
        // Otherwise display result page
        filepath = path.join(template, 'result.html');

        // Check if gender is populated, then display queries based on it
    }

    fs.readFile(filepath, "utf-8", (err, data) => {
        console.log(filepath);
        if (err) {
            console.log('Gender Read Error');
            res.status(404).type('txt').send('File not found');
        } else {
            console.log('Gender Read Success');
            res.status(200).type('html').send(data);
        }
    });
});

// Route 3: Location
app.get('/loc/:location?/:entry?', (req, res) => {
    // location and entry are optional
    let location = req.params.relStatus;
    let entry = req.params.entry;
    let filepath;

    // Check if entry is populated
    if (entry) {
        // Go to participant because entry populated
        filepath = path.join(template, 'participant.html');
    } else {
        // Otherwise display result page
        filepath = path.join(template, 'result.html');

        // Check if location is populated, then display queries based on it
    }

    fs.readFile(filepath, "utf-8", (err, data) => {
        console.log(filepath);
        if (err) {
            console.log('Location Read Error');
            res.status(404).type('txt').send('File not found');
        } else {
            console.log('Location Read Success');
            res.status(200).type('html').send(data);
        }
    });
});

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
