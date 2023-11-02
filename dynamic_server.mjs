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

function calculatePercentage(data1, data2) {
    return (data1 / data2) * 100;
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
        let p1 = dbSelect("SELECT * FROM Sleep", []);
        let p2 = dbSelect("SELECT * FROM RelationshipStatus", []);
        let p3 = dbSelect("SELECT * FROM Gender", []);
        let p4 = dbSelect("SELECT * FROM Location", []);
        let relPlotData;
        let gdrPlotData;
        let locPlotData;

        Promise.all([p1, p2, p3, p4]).then((results) => {
            let total = results[0].length;
            let relQuery = [];
            let relPercent = [];
            let relIDName = [];
            let gdrQuery = [];
            let gdrPercent = [];
            let gdrIDName = [];
            let locQuery = [];
            let locPercent = [];
            let locIDName = [];

            results[1].forEach((id) => {
                // console.log(id.status_id);
                relQuery.push(dbSelect("SELECT * FROM Sleep WHERE status_id = ?", [id.status_id]));
                relIDName.push('"' + id.status_type + '"');
                // console.log(relIDName);
            });
            results[2].forEach((id) => {
                // console.log(id.gender_id);
                gdrQuery.push(dbSelect("SELECT * FROM Sleep WHERE gender_id = ?", [id.gender_id]));
                gdrIDName.push('"' + id.gender_type + '"');
                // console.log(gdrIDName);
            });
            results[3].forEach((id) => {
                // console.log(id.location_id);
                locQuery.push(dbSelect("SELECT * FROM Sleep WHERE location_id = ?", [id.location_id]));
                locIDName.push('"' + id.location + '"');
            });

            // 
            Promise.all(relQuery).then((data) => {
                // console.log(data);
                data.forEach((id) => {
                    relPercent.push(calculatePercentage(id.length, total));
                    // console.log(relPercent);
                });
                // console.log(calculatePercentage(data.length, total));
            }).catch((err) => {
                console.log(err);
            }).then(() => {
                // console.log(relPercent);
                relPlotData = "[ {values: [" + relPercent + "], labels: [" + relIDName + "], type: 'pie'}]";
                data = data.replace("$$RELPLOT$$", relPlotData);

                Promise.all(gdrQuery).then((data) => {
                    // console.log(data);
                    data.forEach((id) => {
                        gdrPercent.push(calculatePercentage(id.length, total));
                        // console.log(relPercent);
                    });
                    // console.log(calculatePercentage(data.length, total));
                }).catch((err) => {
                    console.log(err);
                }).then(() => {
                    // console.log(relPercent);
                    gdrPlotData = "[ {values: [" + gdrPercent + "], labels: [" + gdrIDName + "], type: 'pie'}]";
                    data = data.replace("$$GDRPLOT$$", gdrPlotData);

                    Promise.all(locQuery).then((data) => {
                        // console.log(data);
                        data.forEach((id) => {
                            locPercent.push(calculatePercentage(id.length, total));
                            // console.log(relPercent);
                        });
                        // console.log(calculatePercentage(data.length, total));
                    }).catch((err) => {
                        console.log(err);
                    }).then(() => {
                        // console.log(relPercent);
                        locPlotData = "[ {values: [" + locPercent + "], labels: [" + locIDName + "], type: 'pie'}]";
                        data = data.replace("$$LOCPLOT$$", locPlotData);
                        res.status(200).type('html').send(data);
                    });
                });
            });
        });
    }).catch((error) => {
        res.status(404).type('txt').send('Uh oh! ' + pageName + ' is Missing a Filter or does not Exist');
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
        pagePromise.then((data) => {
            // console.log("Page Read Success");
            queriesList.push(p3);
            Promise.all(queriesList).then((results) => {
                let search = "ID";
                let desc = "Sleeping Alone Data Case Number:" + "<br/>" + results[2][0].id;
                let rel_list = results[2];
                let table_body = '';
                rel_list.forEach((rel, index) => {
                    let table_row = '<tr>';
                    table_row += '<td>' + rel.age_id + '</td>\n';
                    table_row += '<td>' + rel.gender_id + '</td>\n';
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
                let response = data.replace("$$ENTRY$$", search);
                response = response.replace("$$HEADER$$", search);
                response = response.replace("$$DESCRIPTIONS$$", desc);
                response = response.replace("$$DATA$$", table_body);
                res.status(200).type('html').send(response);
                }).catch((error) => {
                    res.status(404).type('txt').send('Uh Oh! Query Failed: No ID in Database');
                });
                
                //res.status(200).type('html').send(data);
            }).catch((error) => {
                res.status(404).type('txt').send(pageName + ' does not exist');
            });
    } else {
        // Otherwise display result page
        pagePromise = fs.promises.readFile(path.join(template, 'relresult.html'), 'utf-8');
        pageName = 'result.html';
    
    
        pagePromise.then((data) => {
            // console.log("Page Read Success");

            Promise.all(queriesList).then((results) => {
                let search = "Relationship Status";
                let desc = "Sleeping Alone Data Filtered By:" + "<br/>" + results[1][0].status_type;
                let rel_list = results[0];
                let table_body = '';
                rel_list.forEach((rel, index) => {
                    let table_row = '<tr>';
                    table_row += '<td><a href="/rel/sc/' + rel.id + '">' + rel.id + '</td>\n';
                    table_row += '<td>' + rel.age_id + '</td>\n';
                    table_row += '<td>' + rel.gender_id + '</td>\n';
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
                res.status(404).type('txt').send('Uh oh! Query Failed: This Type of Relationship Status does not Exist in Database');
            });
            
            //res.status(200).type('html').send(data);
        }).catch((error) => {
            res.status(404).type('txt').send(pageName + ' does not exist');
        });
    }
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
        pagePromise.then((data) => {
            // console.log("Page Read Success");
        
            queriesList.push(p3);
    
            Promise.all(queriesList).then((results) => {
                let search = "ID";
                let desc = "Sleeping Alone Data Case Number:" + "<br/>" + results[2][0].id;
                let rel_list = results[2];
                let table_body = '';
                rel_list.forEach((rel, index) => {
                    let table_row = '<tr>';
                    table_row += '<td>' + rel.age_id + '</td>\n';
                    table_row += '<td>' + rel.gender_id + '</td>\n';
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
                let response = data.replace("$$ENTRY$$", search);
                response = response.replace("$$HEADER$$", search);
                response = response.replace("$$DESCRIPTIONS$$", desc);
                response = response.replace("$$DATA$$", table_body);
                res.status(200).type('html').send(response);
                }).catch((error) => {
                    res.status(404).type('txt').send('Uh Oh! Query Failed: No ID in Database');
                });
                
                //res.status(200).type('html').send(data);
            }).catch((error) => {
                res.status(404).type('txt').send(pageName + ' does not exist');
            });

    } else {
        // Otherwise display result page
        pagePromise = fs.promises.readFile(path.join(template, 'gdrresult.html'), 'utf-8');
        pageName = 'result.html';
    
    
        pagePromise.then((data) => {
            // console.log("Page Read Success");

            Promise.all(queriesList).then((results) => {
                let search = "Gender";
                let desc = "Sleeping Alone Data Filtered By:" + "<br/>" + results[1][0].gender_type;
                let rel_list = results[0];
                let table_body = '';

                rel_list.forEach((rel, index) => {
                    let table_row = '<tr>';
                    table_row += '<td><a href="/rel/sc/' + rel.id + '">' + rel.id + '</td>\n';
                    table_row += '<td>' + rel.age_id + '</td>\n';
                    table_row += '<td>' + rel.gender_id + '</td>\n';
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
                res.status(404).type('txt').send('Uh oh! Query Failed: This Gender does not Exist in Database');
            });
            
            //res.status(200).type('html').send(data);
        }).catch((error) => {
            res.status(404).type('txt').send(pageName + ' does not exist');
        });
    }
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
        pagePromise.then((data) => {
            // console.log("Page Read Success");
        
            queriesList.push(p3);
    
            Promise.all(queriesList).then((results) => {
                let search = "ID";
                let desc = "Sleeping Alone Data Case Number:" + "<br/>" + results[2][0].id;
                let rel_list = results[2];
                let table_body = '';
                rel_list.forEach((rel, index) => {
                    let table_row = '<tr>';
                    table_row += '<td>' + rel.age_id + '</td>\n';
                    table_row += '<td>' + rel.gender_id + '</td>\n';
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
                let response = data.replace("$$ENTRY$$", search);
                response = response.replace("$$HEADER$$", search);
                response = response.replace("$$DESCRIPTIONS$$", desc);
                response = response.replace("$$DATA$$", table_body);
                res.status(200).type('html').send(response);
                }).catch((error) => {
                    res.status(404).type('txt').send('Uh Oh! Query Failed: No ID in Database');
                });
                
                //res.status(200).type('html').send(data);
            }).catch((error) => {
                res.status(404).type('txt').send(pageName + ' does not exist');
            });
    } else {
        // Otherwise display result page
        pagePromise = fs.promises.readFile(path.join(template, 'locresult.html'), 'utf-8');
        pageName = 'result.html';
    
    
    pagePromise.then((data) => {
        // console.log("Page Read Success");

        Promise.all(queriesList).then((results) => {
            let search = "Location";
            let desc = "Sleeping Alone Data Filtered By:" + "<br/>" + results[1][0].location;
            let rel_list = results[0];
            let table_body = '';
            rel_list.forEach((rel, index) => {
                let table_row = '<tr>';
                table_row += '<td><a href="/rel/sc/' + rel.id + '">' + rel.id + '</td>\n';
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
                res.status(404).type('txt').send('Uh oh! Query Failed: This Location does not Exist in Database');
            });
            
            //res.status(200).type('html').send(data);
        }).catch((error) => {
            res.status(404).type('txt').send(pageName + ' does not exist');
        });
    }
    });

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
