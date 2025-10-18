let days =  document.querySelectorAll(".day")
let title = document.querySelector("#day-title")
let taskInput = document.querySelector("#task-text")
let addTaskBtn = document.querySelector("#add-task")
let taskList = document.querySelector("") 
let currentDay = "Понеділок" 
let tasks = JSON.parse(localStorage.getItem("tasks"))||{}

addTaskBtn.addEventListener("click", function(){
    let text = taskInput.value.trim()
    if (text){
        if (!tasks [currentDay]) tasks[currentDay] = []
        tasks[currentDay].push(text)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        taskInput.value = ""
        renderTasks ()
    }
})


function startEdit (index){
    let list = tasks[currentDay]
    let li = taskList.children[index]
    let input = document.createElement("input")
    input.type="text"
    input.value = list [index]
    let saveBtn = document.createElement("button")
    saveBtn.textContent = "Зберегти"
    saveBtn.onclick = function(){
        saveEdit (index,input.value)
    } 
    li.innerHTML =""
    li.appendChild(input)
    li.appendChild(saveBtn)
}

function saveEdit (index,text){
    if (text.trim()!==""){
        tasks[currentDay][index] = text.trim()
        localStorage.setItem("tasks", JSON.stringify(tasks))
        renderTasks()
    }
}

function deleteTask (index){
    tasks[currentDay].splice(index,1)
    localStorage.setItem("tasks",JSON.stringify(tasks))
    renderTasks() 
}