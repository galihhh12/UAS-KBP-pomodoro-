// Timer Variables
let timeLeft;
let timerId = null;
let isWorkTime = true;

// DOM Elements
const timerDisplay = document.getElementById('timer');
const timerStatus = document.getElementById('timerStatus');
const startButton = document.getElementById('startTimer');
const resetButton = document.getElementById('resetTimer');
const finishButton = document.getElementById('finishTimer');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const breakEndModal = document.getElementById('breakEndModal');
const continueStudyingButton = document.getElementById('continueStudying');
const finishStudyingButton = document.getElementById('finishStudying');

// Timer Functions
function showBreakEndModal() {
    breakEndModal.style.display = 'block';
}

function hideBreakEndModal() {
    breakEndModal.style.display = 'none';
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        return;
    }

    if (!timeLeft) {
        timeLeft = workTimeInput.value * 60;
    }

    startButton.textContent = 'Pause';
    timerId = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;

            const audio = new Audio('data:audio/mp3;base64,SUQzBA...');
            audio.play();

            if (isWorkTime) {
                // When work time ends, automatically start break time
                isWorkTime = false;
                timeLeft = breakTimeInput.value * 60;
                timerStatus.textContent = 'Break Time';
                if (Notification.permission === 'granted') {
                    new Notification('Work time finished! Starting break time.');
                }
                startTimer(); // Automatically start break timer
            } else {
                // When break time ends, show modal
                showBreakEndModal();
                if (Notification.permission === 'granted') {
                    new Notification('Waktu istirahatmu telah selesai, ayo belajar lagi, atau mau lanjut besok?');
                }
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = workTimeInput.value * 60;
    isWorkTime = true;
    timerStatus.textContent = 'Work Time';
    startButton.textContent = 'Start';
    updateTimer();
}

function finishSession() {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    timeLeft = workTimeInput.value * 60;
    isWorkTime = true;
    timerStatus.textContent = 'Session Finished';
    updateTimer();
}

// Event Listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
finishButton.addEventListener('click', finishSession);

continueStudyingButton.addEventListener('click', () => {
    hideBreakEndModal();
    isWorkTime = true;
    timeLeft = workTimeInput.value * 60;
    timerStatus.textContent = 'Work Time';
    startTimer();
});

finishStudyingButton.addEventListener('click', () => {
    hideBreakEndModal();
    finishSession();
});

// Initialize Timer
timeLeft = workTimeInput.value * 60;
updateTimer();

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// To-Do List Code
const todoList = document.getElementById('todoList');
const newTodoInput = document.getElementById('newTodo');
const addTodoButton = document.getElementById('addTodo');

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodoToDOM(todo.text, todo.completed));
}

function saveTodos() {
    const todos = Array.from(document.querySelectorAll('.todo-item')).map(item => {
        return {
            text: item.querySelector('.todo-text').textContent,
            completed: item.classList.contains('completed')
        };
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodoToDOM(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (completed) li.classList.add('completed');

    li.innerHTML = `
        <span class="todo-text">${text}</span>
        <div class="todo-actions">
            <button class="btn-primary">Done</button>
            <button class="btn-warning">Delete</button>
        </div>
    `;

    li.querySelector('.btn-primary').addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTodos();
    });

    li.querySelector('.btn-warning').addEventListener('click', () => {
        li.remove();
        saveTodos();
    });

    todoList.appendChild(li);
}

addTodoButton.addEventListener('click', () => {
    const text = newTodoInput.value.trim();
    if (text) {
        addTodoToDOM(text);
        saveTodos();
        newTodoInput.value = '';
    }
});

loadTodos();