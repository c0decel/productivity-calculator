let ingredientCounter = 1;
let stepCounter = 1;
let personCounter = 1;
let fieldType;


/**
 * Index.html
 */


function convertMeasurement(uom, qty) {
    let convertedMeasurement;

    switch (uom) {
        case `Grams`:
            convertedMeasurement = (qty / 28).toFixed(2);
            break
        case `Ounces`:
            convertedMeasurement = qty;
            break
        case `Pounds`:
            convertedMeasurement = (qty * 16).toFixed(2);
            break
        default:
            convertedMeasurement = qty;   
    }

    return convertedMeasurement;
}

function fetchIngredientDetails(ingredientName, ingredientQty, ingredientUom) {
    console.log(ingredientName);

return new Promise((resolve, reject) => {

    fetch(`/ingredient/${ingredientName}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ingredient not found`);
        }
        return response.json();
    })
    .then(data => {
        const casePrice = data.pricePerCase;
        const uomCase = data.uomCase;
        const caseQty = data.qtyPerCase;
        let costPerBatch = 0;
        let conversionCase = 0;
        let conversionIngredient = 0;
        let costPerOunce = 0;

        conversionCase = convertMeasurement(uomCase, caseQty);
        conversionIngredient = convertMeasurement(ingredientUom, ingredientQty);

        costPerOunce = (casePrice / conversionCase).toFixed(2);
        costPerBatch = (costPerOunce * conversionIngredient).toFixed(2);

        
        console.log(`${caseQty} ${uomCase}, is ${conversionCase} ounces, Costs ${casePrice} per case and ${costPerOunce} per ounce`);
        console.log(`${ingredientQty} ${ingredientUom}, is ${conversionIngredient} ounce`);
        console.log(`It costs $${costPerBatch} of ${ingredientName} to make a batch of this product`);

        resolve(costPerBatch);
    })
    .catch(error => {
        console.log(`Error: ${error}`);
        reject(error);
    });
})

}

function addAdditionalOptions(fieldType) {
    let fieldDetails;

    switch (fieldType) {
        case `additionalPerson`:
            fieldDetails = `
                <h3>Person name</h3>
                <select id="person-name-${personCounter}" name="person-name[]"></select>
                <button type="button" class="delete-field">Delete</button>
            `;
            break
        case `additionalIngredients`:
            fieldDetails = `
                <h3>Ingredient name</h3>
                <select id="ingredient-name-${ingredientCounter}" name="ingredient-name[]"></select>
                <h3>Quantity</h3>
                <input id="ingredient-qty-${ingredientCounter}" type="number" name="ingredient-qty[]"><br>
                <select
                id="uom-${ingredientCounter}"
                name="uom[]"
                >
                    <option value="Grams">Grams</option>
                    <option value="Milligrams">Milligrams</option>
                    <option value="Ounces">Ounces</option>
                    <option value="Pounds">Pounds</option>
                    <option value="Pieces">Pieces</option>
                </select>
                <button type="button" class="delete-field">Delete</button>
            `;
            break
        case `additionalSteps`:
            fieldDetails = `
                <h3>Description</h3>
                <input id="step-description-${stepCounter}" type="text" name="steps[]"><br>
                <h3>Time taken for step</h3>
                <input id="step-time-${stepCounter}" type="number" name="steps[]"><br>
                <select
                id="uot-${stepCounter}"
                name="uot[]"
                >
                    <option value="Minutes">Minutes</option>
                    <option value="Hours">Hours</option>
                </select>
                
                <button type="button" class="delete-field">Delete</button>
            `;
    }

    return fieldDetails;

}

function addIngredientField() {
    const additionalIngredients = document.getElementById(`additional-ingredients`);
    const newField = document.createElement(`div`);
    newField.classList.add(`form-field`);
    fieldType = `additionalIngredients`;

    newField.innerHTML = addAdditionalOptions(fieldType);

    additionalIngredients.appendChild(newField);

    newField.querySelector(`.delete-field`).addEventListener(`click`, function() {
        additionalIngredients.removeChild(newField);
    });

    fetch(`ingredients.json`)
        .then(response => response.json())
        .then(data => {
            const option = document.createElement(`option`);
                data.ingredients.forEach(ingredient => {
                option.value = ingredient.name;
                option.text = ingredient.name;

                const newSelect = newField.querySelector(`select[name="ingredient-name[]"]`);
                const clonedOption = option.cloneNode(true);
                newSelect.appendChild(clonedOption);
            });
        })
        .catch(error => {
            console.error(`Couldn't fetch ingredients: ${error}`);
        });

    ingredientCounter++;
}

document.getElementById(`add-another-ingredient`).addEventListener(`click`, addIngredientField);

function addStepField() {
    const additionalSteps = document.getElementById(`additional-steps`);
    const newField = document.createElement(`div`);
    newField.classList.add(`form-field`);
    fieldType = `additionalSteps`;

    newField.innerHTML = addAdditionalOptions(fieldType);

    additionalSteps.appendChild(newField);

    newField.querySelector(`.delete-field`).addEventListener(`click`, function() {
        additionalSteps.removeChild(newField);
    });

    stepCounter++;
}

document.getElementById(`add-another-step`).addEventListener(`click`, addStepField);


document.getElementById(`task-form`).addEventListener(`submit`, async function(event) {
    event.preventDefault(); 

    const ingredients = [];
    const selectedIngredients = [];
    const promises = [];
    let totalBatchCost = 0;

    for (let i = 1; i < ingredientCounter; i++) {
        console.log(`Trying to select ingredient ${i}`);
        const ingredientName = document.querySelector(`#ingredient-name-${i}`).value;
        const ingredientQty = document.querySelector(`#ingredient-qty-${i}`).value;
        const ingredientUom = document.querySelector(`#uom-${i}`).value;
        selectedIngredients.push(ingredientName);
        

        promises.push(fetchIngredientDetails(ingredientName, ingredientQty, ingredientUom)
            .then(costPerBatch => {
                costPerBatch = parseFloat(costPerBatch);
                ingredients.push({
                    name: ingredientName,
                    qty: ingredientQty,
                    uom: ingredientUom,
                    costPerBatch: costPerBatch
                });
                totalBatchCost += costPerBatch;
            })
            .catch(error => {
                console.error(`Error fetching details: ${error}`);
            })
        );
    } 

    await Promise.all(promises);

    const productName = document.getElementById(`product-name`).value;
    const productPrice = document.getElementById(`product-price`).value;
    const taskMakes = document.getElementById(`makes-qty`).value;
    const avgSales = document.getElementById(`sales-day`).value;
    let totalTime = 0;
    let potentialGross = 0;
    let potentialProfit = 0;

    const steps = [];

    for (let i = 1; i < stepCounter; i++) {
        const stepDescription = document.querySelector(`#step-description-${i}`).value;
        let stepTime = parseInt(document.querySelector(`#step-time-${i}`).value);
        const stepUot = document.querySelector(`#uot-${i}`).value;

        if (stepUot === `Hours`) {
            stepTime *= 60;
            totalTime += stepTime;
        } else {
            totalTime += stepTime;
        }

        steps.push({
            description: stepDescription,
            time: stepTime,
            uot: stepUot
        });
    }

    totalBatchCost = totalBatchCost.toFixed(2);
    totalTime = (totalTime / 60).toFixed(2);


    potentialGross = productPrice * taskMakes;

    potentialProfit = potentialGross - totalBatchCost;

    const newTask = {
        name: productName,
        ingredients: ingredients,
        steps: steps,
        price: productPrice,
        makes: taskMakes,
        average_sales_day: avgSales,
        batchPrice: totalBatchCost,
        totalTime: totalTime,
        potentialGross: potentialGross,
        potentialProfit: potentialProfit
    }

        fetch(`/submit-task`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
        .then(response => {
            if (response.ok) {
                console.log(`Task submitted successfully.`);
            } else {
                console.error(`Failed to submit.`);
            }
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
});
