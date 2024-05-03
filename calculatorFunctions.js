let fieldType;
let personCounter = 0;
let taskCounter = 0;

function addAdditionalOptions(fieldType) {
    let fieldDetails;

    switch (fieldType) {
        case `additionalTask`:
            fieldDetails = `
                <h3>Task</h3>
                <select id="task-name-${taskCounter}" name="task-name[]"></select>
                <h3>Assign to</h3>
                <select id="task-assign-${personCounter}" name="task-assign[]"></select>

                <button type="button" class="delete-field">Delete</button>
            `;
            break
    }

    return fieldDetails;

}

function addTaskField() {
    const additionalTask = document.getElementById(`additional-task`);
    const newField = document.createElement(`div`);
    newField.classList.add(`form-field`);
    fieldType = `additionalTask`;

    newField.innerHTML = addAdditionalOptions(fieldType);

    additionalTask.appendChild(newField);

    fetch(`tasks.json`)
        .then(response => response.json())
        .then(data => {
            const option = document.createElement(`option`);
            const taskDetails = document.getElementById(`task-details`);

                data.tasks.forEach(task => {
                    option.value = task.name;
                    option.text = task.name;

                    const newSelect = newField.querySelector(`select[name="task-name[]"]`);
                    const clonedOption = option.cloneNode(true);
                    newSelect.appendChild(clonedOption);

                });

                const details = document.createElement(`div`);

                newField.querySelector(`select[name="task-name[]"]`).addEventListener(`change`, function(event) {
                    const selectedTaskName = event.target.value;
                    console.log(selectedTaskName)
                    const selectedTask = data.tasks.find(task => task.name === selectedTaskName);
                    if (selectedTask) {
                        details.innerHTML = `
                            <h4>${selectedTask.name}</h4>
                            <p>Total time to make: ${selectedTask.totalTime} hours.</p>
                            <p>Takes ${selectedTask.steps.length} total steps to make batch.</p>
                            <p>Potential gross is $${selectedTask.potentialGross} with each product selling at $${selectedTask.price}.</p>
                            <p>Costs $${selectedTask.batchPrice} to make a batch of ${selectedTask.makes} products.</p>
                            <p>Profit before labor costs is $${selectedTask.potentialProfit} if all ${selectedTask.makes} sell at full price.</p>
                            <p>Average of ${selectedTask.dailySales} sell daily.</p>
                        `;
                        taskDetails.innerHTML = ``;
                        taskDetails.appendChild(details);
                    }
                });
                

        })
        .catch(error => {
            console.error(`Couldn't fetch tasks: ${error}`);
        });

        taskCounter++;

        fetch(`people.json`)
            .then(response => response.json())
            .then(data => {
                const assignEmployee = document.createElement(`option`);
                
                data.people.forEach(person => {
                    assignEmployee.value = person.person_name;
                    assignEmployee.text = person.person_name;
                    console.log(assignEmployee.text)

                    const newEmployeeSelect = newField.querySelector(`select[name="task-assign[]"]`);
                    const clonedOption = assignEmployee.cloneNode(true);
                    newEmployeeSelect.appendChild(clonedOption);
                });
            })
            .catch(error => {
                console.error(`Couldn't fetch people: ${error}`);
            });

    personCounter++;
}

document.getElementById(`add-another-task`).addEventListener(`click`, addTaskField);

function fetchPersonDetails(personName) {
    let hourlyRate = 0;
    return new Promise((resolve, reject) => {
        fetch(`/people/${personName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Person not found`);
            }
            return response.json();
        })
        .then(data => {
            hourlyRate = data.hourly_rate;

            resolve(hourlyRate);
        })
        .catch(error => {
            console.log(`Error: ${error}`);
            reject(error);
        });
    })
}

function fetchTaskDetails(taskName) {
    return new Promise((resolve, reject) => {
        fetch(`/tasks/${taskName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Person not found`);
            }
            return response.json();
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            console.log(`Error: ${error}`);
            reject(error);
        });
    })
}



async function calculateProductivity() {
    console.log(`sneed`)

    const tasks = [];
    const people = [];
    const promises = [];

    for (let i = 1; i < taskCounter; i++) {
        const taskName = document.querySelector(`#task-name-${i}`).value;
        const employeeName = document.querySelector(`#task-assign-${i}`).value;

        const taskDetailsPromise = fetchTaskDetails(taskName);
        const personDetailsPromise = fetchPersonDetails(employeeName);

        promises.push(taskDetailsPromise);
        promises.push(personDetailsPromise);

    }

    const results = await Promise.all(promises);

};