// --- 1. Пошук елементів на сторінці (DOM-елементів) ---

let days = document.querySelectorAll(".day"); // Знаходимо всі елементи з класом "day" (це наші кнопки днів)
let title = document.querySelector("#day-title"); // Знаходимо елемент-заголовок за його ID "day-title", куди будемо писати назву дня
let taskInput = document.querySelector("#task-text"); // Знаходимо поле для введення тексту нової задачі
let addTaskBtn = document.querySelector("#add-task"); // Знаходимо кнопку "Додати задачу"
let taskList = document.querySelector("#task-list"); // Знаходимо список (ul або ol), де будуть відображатися задачі

// --- 2. Глобальні змінні (зберігають стан) ---

// Створюємо змінну, яка зберігає назву *поточного* обраного дня.
// За замовчуванням, коли сторінка відкривається, це "Понеділок".
let currentDay = "Понеділок";

// Завантажуємо збережені задачі з пам'яті браузера (localStorage).
// JSON.parse перетворює текст (string) назад у об'єкт JavaScript.
// || {} означає: "Якщо в пам'яті нічого немає (localStorage.getItem поверне null),
// то нехай 'tasks' буде новим порожнім об'єктом".
// 'tasks' матиме такий вигляд: { Понеділок: ["задача 1"], Вівторок: ["інша задача"] }
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

// --- 3. Обробник події для кнопки "Додати задачу" ---

// Додаємо "слухача подій" на кнопку. Ця функція виконається при кожному кліку.
addTaskBtn.addEventListener("click", function () {
    // Отримуємо текст з поля вводу.
    // .trim() видаляє зайві пробіли на початку і в кінці тексту.
    let text = taskInput.value.trim();

    // Перевіряємо, чи користувач щось ввів (чи текст не порожній).
    if (text) {
        // Перевіряємо, чи існує вже масив (список) задач для поточного дня.
        // Якщо ні (!tasks[currentDay]), то створюємо новий порожній масив [].
        if (!tasks[currentDay]) {
            tasks[currentDay] = [];
        }
        
        // Додаємо нову задачу (текст) у масив задач для *поточного* дня.
        tasks[currentDay].push(text);
        
        // Зберігаємо оновлений об'єкт `tasks` назад у пам'ять браузера.
        // JSON.stringify перетворює об'єкт JavaScript на текст (string) для збереження.
        localStorage.setItem("tasks", JSON.stringify(tasks));
        
        // Очищуємо поле вводу після додавання задачі.
        taskInput.value = "";
        
        // Викликаємо функцію, щоб оновити (перемалювати) список задач на екрані.
        renderTasks();
    }
});

// --- 4. Функції для Редагування та Видалення задач ---

/**
 * Функція, що активує режим *редагування* задачі. 
 * Далі param {number} - це аргументи (або параметри, що передаються в функцію і пишуться в круглих скобках після її назви)
 * @param {number} index - номер задачі у списку, яку треба редагувати.
 */
function startEdit(index) {
    let list = tasks[currentDay];// Отримуємо список (масив) задач для поточного дня.
    let li = taskList.children[index];// Знаходимо конкретний елемент <li> (задачу) у списку на сторінці за його індексом.

    // Створюємо в пам'яті нове поле <input> для редагування.
    let input = document.createElement("input");
    input.type = "text";
    input.value = list[index]; // Встановлюємо в це поле поточний текст задачі.

    // Створюємо кнопку "Зберегти".
    let saveBtn = document.createElement("button");
    saveBtn.textContent = "Зберегти";
    
    // Призначаємо кнопці "Зберегти" дію:
    saveBtn.onclick = function () {
        // Викликати функцію saveEdit, передавши їй індекс та *новий* текст з поля.
        saveEdit(index, input.value);
    };

    // Повністю очищуємо вміст <li> (видаляємо старий текст і кнопки "Редагувати"/"Видалити").
    li.innerHTML = "";
    li.appendChild(input); // Додаємо в <li> щойно створене поле для редагування.
    li.appendChild(saveBtn); // Додаємо в <li> щойно створену кнопку "Зберегти".
}

/**
 * Функція для *збереження* відредагованої задачі.
 * @param {number} index - індекс задачі, яку зберігаємо.
 * @param {string} text - новий текст для цієї задачі.
 */
function saveEdit(index, text) {
    // Перевіряємо, чи новий текст не порожній (після очищення від пробілів).
    if (text.trim() !== "") {
        tasks[currentDay][index] = text.trim();// Оновлюємо текст задачі в нашому об'єкті `tasks` за її індексом.
        localStorage.setItem("tasks", JSON.stringify(tasks));// Зберігаємо всі зміни в localStorage.
        renderTasks();// Перемальовуємо список задач, щоб показати зміни.
    }
}

/**
 * Функція для *видалення* задачі.
 * @param {number} index - індекс задачі, яку треба видалити.
 */
function deleteTask(index) {
    // .splice(index, 1) видаляє 1 елемент з масиву `tasks[currentDay]` починаючи з позиції `index`.
    tasks[currentDay].splice(index, 1);
    // Зберігаємо зміни (вже без видаленої задачі) в localStorage.
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Оновлюємо список на екрані.
    renderTasks();
}

// --- 5. Обробники подій для кнопок Днів Тижня ---

// Починаємо цикл, щоб додати "слухача подій" (клік) до *кожної* кнопки дня тижня.
// (days - це масив кнопок, який ми знайшли на початку).
for (let i = 0; i < days.length; i++) {
    // При кліку на *i-ту* кнопку дня...
    days[i].addEventListener("click", function () {
        
        // ...спочатку ми проходимо в іншому циклі по *всіх* кнопках днів...
        for (let k = 0; k < days.length; k++) {
            // ...і видаляємо клас "active" (щоб зняти виділення з попередньої активної кнопки).
            days[k].classList.remove("active");
        }
        
        // ...потім додаємо клас "active" *тільки* тій кнопці, на яку ми щойно натиснули (days[i]).
        days[i].classList.add("active");
        
        // Отримуємо назву дня (напр., "Понеділок") з HTML-атрибута `data-day` натиснутої кнопки.
        currentDay = days[i].getAttribute("data-day");
        
        // Оновлюємо заголовок на сторінці, щоб він показував вибраний день.
        title.textContent = currentDay;
        
        // Перемальовуємо список задач, щоб показати задачі для *нового* обраного дня.
        renderTasks();
    });
}

// --- 6. Головна функція для Відображення (Рендерінгу) ---

/**
 * Головна функція для "відмальовування" (відображення) списку задач на екрані.
 * Вона бере дані з об'єкта `tasks` і перетворює їх на HTML-елементи.
 */
function renderTasks() {
    // Повністю очищуємо поточний список <ul> на сторінці, щоб намалювати новий.
    taskList.innerHTML = "";
    
    // Отримуємо масив задач для *поточного* обраного дня (currentDay).
    // Якщо для цього дня задач немає (tasks[currentDay] це undefined),
    // то `list` стає порожнім масивом `[]`.
    let list = tasks[currentDay] || [];
    
    // Запускаємо цикл, який пройде по *кожній* задачі з отриманого списку.
    for (let i = 0; i < list.length; i++) {
        // Для кожної задачі створюємо новий елемент списку <li>.
        let li = document.createElement("li");
        
        // Створюємо <span>, в якому буде текст задачі.
        let span = document.createElement("span");
        span.textContent = list[i]; // list[i] - це текст задачі, напр., "Купити хліб".
        
        // Створюємо <div> для кнопок (щоб вони були разом, напр., справа).
        let div = document.createElement("div");
        
        // Створюємо кнопку "Редагувати".
        let editBtn = document.createElement("button");
        editBtn.textContent = "✏"; // Іконка олівця
        
        // (Дуже важливо!) Зберігаємо в кнопці її *індекс* (номер задачі) `i` у `data-index`.
        // Це потрібно, щоб при натисканні ми знали, *яку* саме задачу редагувати.
        editBtn.setAttribute("data-index", i);
        
        // При кліку на кнопку редагування...
        editBtn.onclick = function () {
            // ...викликаємо `startEdit` і передаємо їй індекс, який ми зберегли в `data-index`.
            startEdit(this.getAttribute("data-index"));
        };
        
        // Створюємо кнопку "Видалити".
        let delBtn = document.createElement("button");
        delBtn.textContent = "🗑"; // Іконка смітника
        
        // Аналогічно, зберігаємо індекс `i` для кнопки видалення.
        delBtn.setAttribute("data-index", i);
        
        // При кліку на видалення...
        delBtn.onclick = function () {
            // Викликаємо `deleteTask` з індексом з `data-index`.
            deleteTask(this.getAttribute("data-index")); // Виправлено з "da"
        };

        // Збираємо <li> разом:
        li.appendChild(span);   // Додаємо <span> з текстом в <li>
        div.appendChild(editBtn); // Додаємо кнопку редагування в <div>
        div.appendChild(delBtn); // Додаємо кнопку видалення в <div>
        li.appendChild(div);   // Додаємо <div> з кнопками в <li>
        
        // Додаємо готовий <li> (з текстом і кнопками) у наш список <ul> на сторінці.
        taskList.appendChild(li);
    }
}

// --- 7. Додаткова функціональність (Enter) ---

// Додаємо слухача на поле вводу, щоб реагувати на *натискання клавіш*.
taskInput.addEventListener("keypress", function (e) {
    // "e" - це об'єкт події, "e.key" - це назва натиснутої клавіші.
    // Якщо натиснута клавіша - це "Enter"...
    if (e.key === "Enter") {
        // ...ми програмно "натискаємо" (імітуємо клік) на кнопку "Додати задачу".
        // Це робить додаток зручнішим, бо не треба тягнутися до мишки.
        addTaskBtn.click();
    }
});

// --- 8. Перший запуск ---

// Викликаємо функцію `renderTasks()` одразу при завантаженні сторінки.
// Це потрібно, щоб показати задачі для дня за замовчуванням ("Понеділок"),
// які могли бути збережені в localStorage з минулого разу.
renderTasks();