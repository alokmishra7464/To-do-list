let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentBackgroundIndex = parseInt(localStorage.getItem('backgroundIndex')) || 0;
let slideshowInterval;

// List of predefined background images
const backgroundImages = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

function renderTodos() {
    let remainingList = document.getElementById('remaining-list');
    let completedList = document.getElementById('completed-list');

    remainingList.innerHTML = '';
    completedList.innerHTML = '';

    todos.forEach((todo, index) => {
        let item = document.createElement('li');
        item.classList.add('todo-item');

        if (todo.done) {
            item.classList.add('done');
            item.innerHTML = `
                <div class="actions">
                    <button onclick="toggleDone(${index})">Mark Incomplete</button>
                    <button onclick="removeTodo(${index})">Remove</button>
                </div>
                ${todo.text} - Due: ${todo.dueDate ? todo.dueDate : 'Not Set'} - Category: ${todo.category ? todo.category : 'Not Set'} - Priority: ${todo.priority ? todo.priority : 'Not Set'}
            `;
            completedList.appendChild(item);
        } else {
            item.innerHTML = `
                <div class="actions">
                    <button onclick="toggleDone(${index})">Mark Complete</button>
                    <button onclick="removeTodo(${index})">Remove</button>
                    <button onclick="editTodo(${index})">Edit</button>
                </div>
                ${todo.text} - Due: ${todo.dueDate ? todo.dueDate : 'Not Set'} - Category: ${todo.category ? todo.category : 'Not Set'} - Priority: ${todo.priority ? todo.priority : 'Not Set'}
            `;
            remainingList.appendChild(item);
        }
    });
}

function addTodo(text, dueDate, category, priority) {
    todos.push({ text, done: false, dueDate, category, priority });
    saveTodos();
    renderTodos();
}

function toggleDone(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
}

function removeTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

function editTodo(index) {
    let newText = prompt('Edit the task:', todos[index].text);
    if (newText !== null) {
        todos[index].text = newText;
        saveTodos();
        renderTodos();
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function setBackground(image) {
    document.body.style.backgroundImage = `url('${image}')`;
    localStorage.setItem('background', image);
}

function setNextBackground() {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    const nextBackground = backgroundImages[currentBackgroundIndex];
    setBackground(nextBackground);
    localStorage.setItem('backgroundIndex', currentBackgroundIndex);
}

function startSlideshow() {
    slideshowInterval = setInterval(setNextBackground, 5000); // Change image every 5 seconds
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
}

// Start the slideshow
startSlideshow();

// Handle background change from file input
document.getElementById('bg-image').addEventListener('change', handleBackgroundChange);

function handleBackgroundChange(event) {
    stopSlideshow(); // Stop slideshow when user manually changes background
    const input = event.target;
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const newBackgroundImage = e.target.result;
            setBackground(newBackgroundImage);
        };
        reader.readAsDataURL(file);
    }
}

// Handle window resize to update button position
window.addEventListener('resize', setChangeBackgroundButtonPosition);
