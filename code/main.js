//global variables (used in multiple functions)
 let date = document.getElementById('date')
 let time = document.getElementById('time')
 let todo = document.getElementById('textarea')
 let dateError = document.getElementById('error-date');
 let todoError = document.getElementById('error-todo');
 let timeError = document.getElementById('error-time');

//function constructor for each task added
function task(date, time, todo, timestamp) {
    this.date = date;
    this.time = time;
    this.todo = todo;
    this.timestamp = timestamp;
}

//add new task to the array of tasks
document.getElementById('btn-add-task').addEventListener('click', add);

//add a new task (if the form is filled out in a valid way)
function add(e) {
    e.preventDefault();
    let dateValue = date.value.trim();
    let todoValue = todo.value.trim();
    let timeValue = time.value.trim();
    let bool = checkValidate(dateValue, todoValue, timeValue);
    //only continue if the form passes the validate test
    if(bool) {
        let timestamp = new Date().getTime();
        let tasksArray = getTasks();
        if (!tasksArray) {
            tasksArray = [];
        }
        tasksArray.push(new task(dateValue, timeValue, todoValue, timestamp));
        saveInLocalStorage(tasksArray);
        document.getElementById('date').value = '';
        document.getElementById('time').value = '';
        document.getElementById('textarea').value = '';
        //fadeIn();
        showTasks('add');
    }
}

//validate form and give user error msgs accordingly
function checkValidate(dateValue, todoValue, timeValue) {
    resetErrorMessage();
    console.log(dateValue);
    const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/gm //HTML5 lets you input a year with 6 digits if you type in the value, so I check that the year is 4 digits
    const timeRegex = /^\d{1,2}:\d{1,2}$/gm //this isn't really necessary since input type is time, but I kept it for the sake of the assignment (plus, if I were to use input type=text, it would be necessary)

    //to check the time, check regex validation and check whether hours < 12 and minutes less than 60 (splits into an array to check the value in each index-0 and 1)
    const checkTime = timeRegex.test(timeValue) && parseInt(timeValue.split(':')[1]) < 60 && parseInt(timeValue.split(':')[0]) <= 12
    const checkDate = dateRegex.test(dateValue);

    let passValidation = true;

    if (!todoValue) {
        todoErrorMessage();
        passValidation = false
    }

    if (!dateValue) {
        dateErrorMessage();
        passValidation = false;
    }

    if (dateValue && !checkDate) {
        dateErrorRegex();
        passValidation = false
    }

    if (timeValue && !checkTime) {
        timeErrorRegex();
        passValidation = false
    }

    if (passValidation) {
        return true;
    } else {
        return false;
    }
}

// define error msgs to make sure date and task are filled out
function dateErrorMessage(){
    dateError.innerHTML = "make sure that you've filled out the date!";
}

function todoErrorMessage(){
    todoError.innerHTML = "make sure that you've filled out the task!";
}

//define error msgs for regex validation of date and time
function dateErrorRegex(){
    dateError.innerHTML = "enter a valid date!"
}

function timeErrorRegex(){
    timeError.innerHTML = "enter a valid time!"
}

//reset error msgs 
function resetErrorMessage(){
    dateError.innerHTML ='';
    todoError.innerHTML ='';
    timeError.innerHTML ='';
}

 //retrieve tasks from local storage
function getTasks() {
    const data = localStorage.getItem('tasks');
    let parsed_data = [];
    if (data) {
        parsed_data = JSON.parse(data);
    }
    return parsed_data;
}

//save in local storage
function saveInLocalStorage(tasksArray) {
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

//show all of the current tasks
function showTasks(operation) {
    let retrievedTasks = getTasks();
    let tasks = document.getElementById('tasks');
    tasks.innerHTML = '';
    if (retrievedTasks == null)
        return;
    for (let i = 0; i < retrievedTasks.length; i++) {
        let task = retrievedTasks[i];

        //template for the tasks-refers to the function ctor to build the template. as one of the classes, set i to the latest task added so that only that one fades in when it's being added (and not all the tasks fade in each time)
        const tasksTemplate = `<div class="col-md-3 col-sm-6 col-xs-6 task ${operation === 'add' && i === retrievedTasks.length-1 && 'fade'}" id='${task.timestamp}'>
        <div class='button-wrapper'><button type="button" class="btn btn-default" id="btn-trash" aria-label="Right Align"  onclick='removeTask(event, ${task.timestamp})'>
        <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </button>
        </div>
        <p>${task.todo}</p>
        <div class='note-footer'>
        <p>${task.date}</p>
        <p>${task.time}</p>
        </div>
        </div>`
        tasks.innerHTML += tasksTemplate;
    }
}

//function to delete task on btn-trash click
function removeTask(e, id) {
    e.preventDefault();
    let retrievedTasks = getTasks();
    let taskIndex = retrievedTasks.find(function (task) { return task.timestamp === id });
    //var taskIndex = retrievedTasks.map(function (e) { return e.timestamp; }).indexOf(id);
    let eleId  = taskIndex.timestamp;
    fadeOut(eleId);
    setTimeout(function(){
        retrievedTasks.splice(taskIndex, 1);
        saveInLocalStorage(retrievedTasks);
        showTasks();
    }, 800) // wait 800 milliseconds before deleting the task
    
}

function fadeOut(id) {
    var target = document.getElementById(id);
    var effect = setInterval(function(){
        if(!target.style.opacity ) {
            target.style.opacity = 1;
        }
        if(target.style.opacity > 0) {
            target.style.opacity -= 0.1;
        }
        else{
            clearInterval(effect)
        }
    }, 200) //decrease opacity every every 200 milliseconds
  }

showTasks();



