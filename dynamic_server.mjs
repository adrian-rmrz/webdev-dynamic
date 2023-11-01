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

// Connect to database
const db = new sqlite3.Database(path.join(data, 'data.sqlite3'), sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Database read error');
    } else {
        console.log('Fully connected to database');
    }
});

function dbSelect(query, params) {
    let p = new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
    return p;
}

// Homepage display
app.get('/:arg?', (req, res) => {
    // Get file path to index.html
    let filepath = path.join(template, 'index.html');
    let pageName = 'index.html';

    // If there is an additional argument, will display an error message
    // Catches if user types a path without an argument (e.g. /rel/ or /loc/)
    if (req.params.arg) {
        filepath = path.join(template, req.params.arg + '.html');
        pageName = req.params.arg + '.html';
    }

    let pagePromise = fs.promises.readFile(filepath, 'utf-8');

    pagePromise.then((data) => {
        res.status(200).type('html').send(data);
    }).catch((error) => {
        res.status(404).type('txt').send(pageName + ' is missing a filter or does not exist');
    });
})

// Route 1: Relationship Status
app.get('/rel/:relStatus/:entry?', (req, res) => {
    // relStatus is required, entry are optional
    let relStatus = req.params.relStatus.toUpperCase();
    let entry = req.params.entry;
    let queriesList = [];

    let p1 = dbSelect("SELECT * FROM Sleep WHERE status_id = ?", [relStatus]);
    let p2 = dbSelect("SELECT * FROM RelationshipStatus WHERE status_id = ?", [relStatus]);
    let pagePromise;
    let pageName;

    queriesList.push(p1, p2);

    // Check if entry is populated
    if (entry) {
        // Go to participant because entry populated
        let p3 = dbSelect("SELECT * FROM Sleep WHERE id = ?", entry);
        pagePromise = fs.promises.readFile(path.join(template, 'participant.html'), 'utf-8');
        pageName = 'participant.html';

        queriesList.push(p3);
    } else {
        // Otherwise display result page
        pagePromise = fs.promises.readFile(path.join(template, 'relresult.html'), 'utf-8');
        pageName = 'result.html';
    }
    
    pagePromise.then((data) => {
        console.log("Page Read Success");

        Promise.all(queriesList).then((results) => {
        let search = "Relationship Status";
        let desc = "Sleeping alone data sorted by:" + "<br/>" + results[1][0].status_type;
        let rel_list = results[0];
        let table_body = '';
        rel_list.forEach((rel, index) => {
            let table_row = '<tr>';
            table_row += '<td>' + rel.id + '</td>\n';
            table_row += '<td>' + rel.age_id + '</td>\n';
            table_row += '<td>' + rel.gender_id + '</td>\n';
            table_row += '<td>' + rel.location_id + '</td>\n';
            table_row += '<td>' + rel.job_id + '</td>\n';
            table_row += '<td>' + rel.income_id + '</td>\n';
            table_row += '<td>' + rel.degree_id + '</td>\n';
            table_row += '<td>' + rel.sepbed_id + '</td>\n';
            table_row += '<td>' + rel.better_id + '</td>\n';
            table_row += '<td>' + rel.snore_id + '</td>\n';
            table_row += '<td>' + rel.sick_id + '</td>\n';
            table_row += '<td>' + rel.sex_id + '</td>\n';
            table_row += '<td>' + rel.bath_id + '</td>\n';
            table_row += '<td>' + rel.arg_id + '</td>\n';
            table_row += '<td>' + rel.intim_id + '</td>\n';
            table_row += '</tr>\n';
            table_body += table_row;
        });
        let response = data.replace("$$SEARCH$$", search);
        response = response.replace("$$HEADER$$", search);
        response = response.replace("$$DESCRIPTIONS$$", desc);
        response = response.replace("$$DATA$$", table_body);
        res.status(200).type('html').send(response);
        }).catch((error) => {
            res.status(404).type('txt').send('Query failed');
        });
        
        //res.status(200).type('html').send(data);
    }).catch((error) => {
        res.status(404).type('txt').send(pageName + ' does not exist');
    });
});

// Route 2: Gender
app.get('/gdr/:gender/:entry?', (req, res) => {
    // gender is required, entry are optional
    let gender = req.params.gender.toUpperCase();
    let entry = req.params.entry;
    let queriesList = [];

    let p1 = dbSelect("SELECT * FROM Sleep WHERE gender_id = ?", [gender]);
    let p2 = dbSelect("SELECT * FROM Gender WHERE gender_id = ?", [gender]);
    let pagePromise;
    let pageName;

    queriesList.push(p1, p2);

    // Check if entry is populated
    if (entry) {
        // Go to participant because entry populated
        let p3 = dbSelect("SELECT * FROM Sleep WHERE id = ?", entry);
        pagePromise = fs.promises.readFile(path.join(template, 'participant.html'), 'utf-8');
        pageName = 'participant.html';

        queriesList.push(p3);
    } else {
        // Otherwise display result page
        pagePromise = fs.promises.readFile(path.join(template, 'gdrresult.html'), 'utf-8');
        pageName = 'result.html';
    }
    
    pagePromise.then((data) => {
        console.log("Page Read Success");

        Promise.all(queriesList).then((results) => {
            let search = "Gender";
            let desc = "Sleeping alone data sorted by:" + "<br/>" + results[1][0].gender_type;
            let rel_list = results[0];
            let table_body = '';
            rel_list.forEach((rel, index) => {
                let table_row = '<tr>';
                table_row += '<td>' + rel.id + '</td>\n';
                table_row += '<td>' + rel.age_id + '</td>\n';
                table_row += '<td>' + rel.status_id + '</td>\n';
                table_row += '<td>' + rel.location_id + '</td>\n';
                table_row += '<td>' + rel.job_id + '</td>\n';
                table_row += '<td>' + rel.income_id + '</td>\n';
                table_row += '<td>' + rel.degree_id + '</td>\n';
                table_row += '<td>' + rel.sepbed_id + '</td>\n';
                table_row += '<td>' + rel.better_id + '</td>\n';
                table_row += '<td>' + rel.snore_id + '</td>\n';
                table_row += '<td>' + rel.sick_id + '</td>\n';
                table_row += '<td>' + rel.sex_id + '</td>\n';
                table_row += '<td>' + rel.bath_id + '</td>\n';
                table_row += '<td>' + rel.arg_id + '</td>\n';
                table_row += '<td>' + rel.intim_id + '</td>\n';
                table_row += '</tr>\n';
                table_body += table_row;
            });
            let response = data.replace("$$SEARCH$$", search);
            response = response.replace("$$HEADER$$", search);
            response = response.replace("$$DESCRIPTIONS$$", desc);
            response = response.replace("$$DATA$$", table_body);
            res.status(200).type('html').send(response);
            }).catch((error) => {
                res.status(404).type('txt').send('Query failed');
            });
            
            //res.status(200).type('html').send(data);
        }).catch((error) => {
            res.status(404).type('txt').send(pageName + ' does not exist');
        });
    });

// Route 3: Location
app.get('/loc/:location/:entry?', (req, res) => {
    // location is required, entry are optional
    let location_id = req.params.location.toUpperCase();
    let entry = req.params.entry;
    let queriesList = [];

    let p1 = dbSelect("SELECT * FROM Sleep WHERE location_id = ?", [location_id]);
    let p2 = dbSelect("SELECT * FROM Location WHERE location_id = ?", [location_id]);
    let pagePromise;
    let pageName;

    queriesList.push(p1, p2);

    // Check if entry is populated
    if (entry) {
        // Go to participant because entry populated
        let p3 = dbSelect("SELECT * FROM Sleep WHERE id = ?", entry);
        pagePromise = fs.promises.readFile(path.join(template, 'participant.html'), 'utf-8');
        pageName = 'participant.html';

        queriesList.push(p3);
    } else {
        // Otherwise display result page
        pagePromise = fs.promises.readFile(path.join(template, 'locresult.html'), 'utf-8');
        pageName = 'result.html';
    }
    
    pagePromise.then((data) => {
        console.log("Page Read Success");

        Promise.all(queriesList).then((results) => {
            let search = "Location";
            let desc = "Sleeping alone data sorted by:" + "<br/>" + results[1][0].location;
            let rel_list = results[0];
            let table_body = '';
            rel_list.forEach((rel, index) => {
                let table_row = '<tr>';
                table_row += '<td>' + rel.id + '</td>\n';
                table_row += '<td>' + rel.age_id + '</td>\n';
                table_row += '<td>' + rel.gender_id + '</td>\n';
                table_row += '<td>' + rel.status_id + '</td>\n';
                table_row += '<td>' + rel.job_id + '</td>\n';
                table_row += '<td>' + rel.income_id + '</td>\n';
                table_row += '<td>' + rel.degree_id + '</td>\n';
                table_row += '<td>' + rel.sepbed_id + '</td>\n';
                table_row += '<td>' + rel.better_id + '</td>\n';
                table_row += '<td>' + rel.snore_id + '</td>\n';
                table_row += '<td>' + rel.sick_id + '</td>\n';
                table_row += '<td>' + rel.sex_id + '</td>\n';
                table_row += '<td>' + rel.bath_id + '</td>\n';
                table_row += '<td>' + rel.arg_id + '</td>\n';
                table_row += '<td>' + rel.intim_id + '</td>\n';
                table_row += '</tr>\n';
                table_body += table_row;
            });
            let response = data.replace("$$SEARCH$$", search);
            response = response.replace("$$HEADER$$", search);
            response = response.replace("$$DESCRIPTIONS$$", desc);
            response = response.replace("$$DATA$$", table_body);
            res.status(200).type('html').send(response);
            }).catch((error) => {
                res.status(404).type('txt').send('Query failed');
            });
            
            //res.status(200).type('html').send(data);
        }).catch((error) => {
            res.status(404).type('txt').send(pageName + ' does not exist');
        });
    });

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
