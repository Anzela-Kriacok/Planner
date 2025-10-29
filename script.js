let days = document.querySelectorAll(".day")
let title = document.querySelector("#day-title")
let taskInput = document.querySelector("#task-text")
let addTaskBtn = document.querySelector("#add-task")
let taskList = document.querySelector("#task-list")
let currentDay = "Понеділок"
let tasks = JSON.parse(localStorage.getItem("tasks")) || {}

addTaskBtn.addEventListener("click", function () {
    let text = taskInput.value.trim()
    if (text) {
        if (!tasks[currentDay]) tasks[currentDay] = []
        tasks[currentDay].push(text)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        taskInput.value = ""
        renderTasks()
    }
})


function startEdit(index) {
    let list = tasks[currentDay]
    let li = taskList.children[index]
    let input = document.createElement("input")
    input.type = "text"
    input.value = list[index]
    let saveBtn = document.createElement("button")
    saveBtn.textContent = "Зберегти"
    saveBtn.onclick = function () {
        saveEdit(index, input.value)
    }
    li.innerHTML = ""
    li.appendChild(input)
    li.appendChild(saveBtn)
}

function saveEdit(index, text) {
    if (text.trim() !== "") {
        tasks[currentDay][index] = text.trim()
        localStorage.setItem("tasks", JSON.stringify(tasks))
        renderTasks()
    }
}

function deleteTask(index) {
    tasks[currentDay].splice(index, 1)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    renderTasks()
}

for (let i = 0; i < days.length; i++) {
    days[i].addEventListener("click", function () {
        for (let k = 0; k < days.length; k++) {
            days[k].classList.remove("active")
        }
        days[i].classList.add("active")
        currentDay = days[i].getAttribute("data-day")
        title.textContent = currentDay
        renderTasks()
    })
}

function renderTasks(){
    taskList.innerHTML = ""
    let list = tasks [currentDay] ||[]
    for(let i = 0;i<list.length; i++){
        let li = document.createElement("li")
        let span = document.createElement("span")
        span.textContent = list[i]
        let div = document.createElement("div")
        let editBtn = document.createElement("button")
        editBtn.textContent = "✏" 
        editBtn.setAttribute ("data-index",i)
        editBtn.onclick = function(){
            startEdit(this.getAttribute("data-index"))
        }
        let delBtn = document.createElement("button")
        delBtn.textContent = "🗑"
        delBtn.setAttribute("data-index",i)
        delBtn.onclick = function(){
            deleteTask(this.getAttribute("da"))
        }
        li.appendChild(span)
        div.appendChild(editBtn)
        div.appendChild(delBtn)
        li.appendChild(div)
        taskList.appendChild(li)
    }
}

taskInput.addEventListener("keypress", function(e){
    if (e.key==="Enter"){
        addTaskBtn.click()
    }
})

renderTasks()