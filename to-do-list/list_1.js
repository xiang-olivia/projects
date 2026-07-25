document.addEventListener('DOMContentLoaded', function() {
    // checks if the user has data stored inside of the to-do list
    chrome.storage.local.get('tasksArray', function(result) {
    if(!result.tasksArray || result.tasksArray.length === 0) {
        console.log('No data found');
    }
    else {
        console.log('Data found', result.tasksArray);
        result.tasksArray.forEach(task => {
            let temp = document.getElementById('li_template').content.cloneNode(true);
            temp.querySelector('.text').textContent = task.text;
            document.querySelector('#task-list').append(temp);        
        });
    }
});
    // retrieves value from user input
    document.querySelector('#button').addEventListener('click', function(event) {
        event.preventDefault();

        const template = document.getElementById('li_template');
        let taskValue = document.querySelector('#task').value;
        let tasks = document.querySelectorAll('#task-list p');

        // checks if the last char in the string is a space
        var last = taskValue.substring(taskValue.length - 1);
        let spaces = "TRUE";
        if (last === " ") {  
            while (spaces === "TRUE") {      
                var temp = taskValue.substring(0, taskValue.length - 1);
                taskValue = temp;
                document.querySelector('#task').value = temp;
                if (taskValue.substring(taskValue.length-1) != " ") {
                    spaces = "FALSE";
                }
            };
        }
        let isDuplicate = Array.from(tasks).some(li => li.textContent === taskValue);

        // checks if the user's input isn't null and isn't a duplicate from previous answers
        if (taskValue.trim() !== "" && !isDuplicate) {

            // used template idea from chrome's tutorial: https://developer.chrome.com/docs/extensions/get-started/tutorial/popup-tabs-manager
            // creates a copy of the element and adds it to #task-list array
            const element = template.content.firstElementChild.cloneNode(true);
            element.querySelector('.text').textContent = document.querySelector('#task').value;
            
            document.querySelector('#task-list').append(element);
            document.querySelector('#error').innerHTML = '';

            let tasksArray = Array.from(tasks); 
            tasksArray.push(element);

            // storage solution found from: https://stackoverflow.com/questions/16605706/store-an-array-with-chrome-storage-local user: gblazex */
            // stores the array into the chrome storage and updates the storage information
            const taskText = document.querySelector('#task').value;

            // clears the input box
            document.getElementById("task").value = "";

            chrome.storage.local.get({tasksArray: []}, function(result) {
                    var tasksArray = result.tasksArray;
                    tasksArray.push({text: taskText, HasBeenUpdatedYet: false});
                    chrome.storage.local.set({tasksArray: tasksArray}, function () {
                        chrome.storage.local.get('tasksArray', function (result) {
                            console.log(result.tasksArray)
                        });
                    });
                });
        }  
        else if (isDuplicate) {
            document.querySelector('#error').innerHTML = 'Invaild input: Task already exists';
            document.getElementById("task").value = "";
        }
        else {
            document.querySelector('#error').innerHTML = 'Invaild input: No task to submit';
        }
    });
// creates editing and deleting functions when buttons are clicked
let isProcessing = false;
function addEventListeners() {
    console.log("addEventListeners called");
    if (isProcessing) return;
    isProcessing = true;
    let tasks = document.querySelectorAll('.container');
    tasks.forEach(function(task) {
        task.addEventListener('click', function(event) {
        
            let tasks = document.querySelectorAll('#task-list p');
            let tasksArray = Array.from(tasks);
            
            const editButton = task.querySelector('.edit');
            const deleteButton = task.querySelector('.delete');
            
            // changes the task's value on the list when edit button pressed
            if (event.target === editButton) {
                
                let textBox = task.querySelector('p.text');
                const index = tasksArray.indexOf(textBox);
                const input = document.createElement("input");
                
                input.id = "input";
                const button = document.createElement("button");
                button.innerHTML = "Submit";
                button.id = "submit";
                
                if (textBox) {
                    console.log(textBox);
                    textBox.replaceWith(input);
                    task.append(button);
                    textBox = textBox;
                }
                    button.addEventListener('click', function() {
                        document.querySelector('#error').innerHTML = '';
                        const taskValue = document.getElementById('input').value;
                        var last = taskValue.substring(0, taskValue.length - 1);
                        let spaces = "TRUE";
                        if (last === " ") {
                            while (spaces === "TRUE") {
                                var temp = taskValue.substring(0, taskValue - 1);
                                taskValue = temp;
                                document.getElementById('input').value = temp;
                                if (taskValue.substring(taskValue.length-1) != " ") {
                                    spaces = "FALSE";
                                }
                            }
                        }
                        let isDuplicate = Array.from(tasks).some(li => li.textContent === taskValue);
                        if (taskValue.trim() !== "" && !isDuplicate) {
                            const value = document.getElementById('input').value;
                            textBox.innerHTML = value;
                            input.replaceWith(textBox);
                            input.remove();
                            button.remove();
                            // restores everything into storage
                            chrome.storage.local.get({tasksArray: []}, function(result) {
                                var tasksArray = result.tasksArray;
                                tasksArray.splice(index, 1, {text: value, HasBeenUpdatedYet: false});
                                chrome.storage.local.set({tasksArray: tasksArray}, function () {
                                    chrome.storage.local.get('tasksArray', function (result) {
                                        console.log(result.array);
                                    });
                                });
                            });
                        } else if (isDuplicate) {
                            document.querySelector('#error').innerHTML = 'Invaild input: Task already exists';
                        } else {
                            document.querySelector('#error').innerHTML = 'Invaild input: No task to submit';
                        }
                    });      
            // deletes an element 
            } else if (event.target === deleteButton) {
                let tasks = document.querySelectorAll('#task-list p');
                let tasksArray = Array.from(tasks);
                let textBox = task.querySelector('p.text');
                task.classList.add('no-marker');
                const index = tasksArray.indexOf(textBox);
                chrome.storage.local.get({tasksArray: []}, function(result) {
                    var tasksArray = result.tasksArray;
                    tasksArray.splice(index, 1);
                    chrome.storage.local.set({tasksArray: tasksArray}, function () {
                        chrome.storage.local.get('tasksArray', function (result) {
                            console.log(result.array);
                        });
                    });
                });
                task.remove();
            } 
        }); 
    }); 
isProcessing = false;
};

// calls the function if the edit or delete button are pressed
document.addEventListener('click', function(event) {
    if (event.target.matches('.edit') || event.target.matches('.delete')) {
        if (isProcessing === false) {
            addEventListeners();
        }
    }
});
});