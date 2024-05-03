const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.get(`/`, (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
});

app.get(`/lists`, (req, res) => {
    res.sendFile(`${__dirname}/lists.html`)
});

app.get(`/calculator`, (req, res) => {
    res.sendFile(`${__dirname}/calculator.html`)
});

app.get('/functions.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(`${__dirname}/functions.js`)
});

app.get('/calculatorFunctions.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(`${__dirname}/calculatorFunctions.js`)
});


app.post(`/submit-ingredient`, (req, res) => {
    const newIngredient = req.body;
    const filePath = `public/ingredients.json`;

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            if (err.code === `ENOENT`) {
                const initialData = { ingredients: [newIngredient] };
                fs.writeFile(filePath, JSON.stringify(initialData), (err) => {
                    if (err) {
                        console.error(`Error writing: ${err}`);
                        res.status(500).send(`Error writing.`);
                        return;
                    }
                    console.log(`Saved.`);
                    res.send(`Saved to ingredients.json`);
                });
            } else {
                console.error(`Error checking file existence: ${err}`);
                res.status(500).send(`Error checking file existence`);
            }
        } else {
            fs.readFile(filePath, `utf8`, (err, data) => {
                if (err) {
                    console.error(`Error reading ingredients.json: ${err}`);
                    res.status(500).send(`Error reading ingredients.json`);
                    return;
                }
        
                let existingData = JSON.parse(data);
        
                if (!existingData.ingredients) {
                    existingData.ingredients = [];
                }

                existingData.ingredients.push(newIngredient);
                
                fs.writeFile(filePath, JSON.stringify(existingData), (err) => {
                    if (err) {
                        console.error(`Error writing: ${err}`);
                        res.status(500).send(`Error writing.`);
                        return;
                    }
                    console.log(`Saved.`)
                    res.send(`Saved to ingredients.json`);
                });
            });
        }
    });
});

app.post(`/submit-person`, (req, res) => {
    const newPerson = req.body;
    const filePath = `public/people.json`;

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            if (err.code === `ENOENT`) {
                const initialData = { people: [newPerson] };
            fs.writeFile(filePath, JSON.stringify(initialData), (err) => {
                if (err) {
                    console.error(`Error writing: ${err}`);
                    res.status(500).send(`Error writing.`);
                    return;
                }
                console.log(`Saved.`)
                    res.send(`Saved to people.json`);
            });
            } else {
                console.error(`Error checking file existence: ${err}`);
                res.status(500).send(`Error checking file existence`);
            }
        } else {
            fs.readFile(filePath, `utf8`, (err, data) => {
                if (err) {
                    console.error(`Error reading ingredients.json: ${err}`);
                    res.status(500).send(`Error reading ingredients.json`);
                    return;
                }

                let existingData = JSON.parse(data);

                if (!existingData.people) {
                    existingData.people = [];
                }

                existingData.people.push(newPerson);

                fs.writeFile(filePath, JSON.stringify(existingData), (err) => {
                    if (err) {
                        console.error(`Error writing: ${err}`);
                        res.status(500).send(`Error writing.`);
                        return;
                    }
                    console.log(`Saved.`)
                    res.send(`Saved to people.json`);
                });
            });
        } 
    })
})

app.post(`/submit-task`, (req, res) => {
    const newTask = req.body;
    const filePath = `public/tasks.json`;

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            if (err.code === `ENOENT`) {
                const initialData = { tasks: [newTask] };
                fs.writeFile(filePath, JSON.stringify(initialData), (err) => {
                    if (err) {
                        console.error(`Error writing: ${err}`);
                        res.status(500).send(`Error writing.`);
                        return;
                    }
                    console.log(`Saved.`)
                    res.send(`Saved to tasks.json`);
                });
            } else {
                console.error(`Error checking file existence: ${err}`);
                res.status(500).send(`Error checking file existence`);
            }
        } else {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading ingredients.json: ${err}`);
                    res.status(500).send(`Error reading ingredients.json`);
                    return;
                }
        
                let existingData = JSON.parse(data);
        
                if (!existingData.tasks) {
                    existingData.tasks = [];
                }

                existingData.tasks.push(newTask);
                
                fs.writeFile(filePath, JSON.stringify(existingData), (err) => {
                    if (err) {
                        console.error(`Error writing: ${err}`);
                        res.status(500).send(`Error writing.`);
                        return;
                    }
                    console.log(`Saved.`)
                    res.send(`Saved to tasks.json`);
                });
            });
        }
    });
});

app.get(`/people/:Name`, (req, res) => {
    const personName = req.params.Name;

    fs.readFile(`public/people.json`, `utf-8`, (err, data) => {
        if (err) {
            console.error(`Error reading people.json: ${err}`);
            res.status(500).send(`Error reading people.json`);
            return;
        }

        const peopleData = JSON.parse(data);

        const foundPerson = peopleData.people.find(person => person.person_name === personName);

        if (foundPerson) {
            res.json({
                name: foundPerson.person_name,
                hourly_rate: foundPerson.hourly_rate
            });
        } else {
            res.status(404).send(`Person not found.`);
        }
    })
})

app.get(`/ingredient/:Name`, (req, res) => {
    const ingredientName = req.params.Name;

    fs.readFile(`public/ingredients.json`, `utf8`, (err, data) => {
        if (err) {
            console.error(`Error reading ingredients.json: ${err}`);
            res.status(500).send(`Error reading ingredients.json`);
            return;
        }

        const ingredientData = JSON.parse(data);

        const foundIngredient = ingredientData.ingredients.find(ingredient => ingredient.name === ingredientName);
        
        if (foundIngredient) {
            res.json({
                name: foundIngredient.name,
                price: foundIngredient.price,
                qtyPerCase: foundIngredient.qtyPerCase,
                pricePerCase: foundIngredient.pricePerCase,
                uomCase: foundIngredient.uomCase
            });
        } else {
            res.status(404).send(`Ingredient not found.`);
        }

    });
});

app.get(`/task/:Name`, (req, res) => {
    const taskName = req.params.Name;

    fs.readFile(`public/tasks.json`, `utf8`, (err, data) => {
        if (err) {
            console.error(`Error reading tasks.json: ${err}`);
            res.status(500).send(`Error reading tasks.json`);
            return;
        }

        const taskData = JSON.parse(data);

        const foundTask = taskData.tasks.find(task => task.name === taskName);
        
        if (foundTask) {
            res.json({
                name: foundTask.name,
                ingredients: foundTask.ingredients,
                steps: foundTask.steps,
                dailySales: foundTask.average_sales_day,
                batchPrice: foundTask.batchPrice,
                totalTime: foundTask.totalTime,
                potentialGross: foundTask.potentialGross,
                potentialProfit: foundTask.potentialProfit,
                makes: foundTask.makes,
                productPrice: foundTask.price
            });
        } else {
            res.status(404).send(`Task not found.`);
        }

    });
});


app.get(`/ingredients.json`, (req, res) => {
    fs.readFile(`public/ingredients.json`, `utf8`, (err, data) => {
        if (err) {
            console.error(`Error reading: ${err}`);
                res.status(500).send(`Error reading.`);
            return;
        }

        res.json(JSON.parse(data));
    });
});

app.get(`/people.json`, (req, res) => {
    fs.readFile(`public/people.json`, `utf8`, (err, data) => {
        if (err) {
            console.error(`Error reading: ${err}`);
                        res.status(500).send(`Error reading.`);
            return;
        }

        res.json(JSON.parse(data));
    });
});

app.get(`/tasks.json`, (req, res) => {
    fs.readFile(`public/tasks.json`, `utf8`, (err, data) => {
        if (err) {
            console.error(`Error reading: ${err}`);
                        res.status(500).send(`Error reading.`);
            return;
        }

        res.json(JSON.parse(data));
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });