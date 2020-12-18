'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted, container) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.container = document.querySelector(container);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));

    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createElement, this);
        this.addToStorage();
    }

    createElement(todo) {
        
        const li = document.createElement('li');

        li.classList.add('todo-item');
        li.key = todo.key; //???
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if (this.input.value.trim() === '') {
            alert('Пустое дело добавить нельзя!');
        }

        else if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        }
        this.input.value = '';
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(data) {

        this.todoData.forEach((item) => {

            if (item.value === data) {
                this.todoData.delete(item.key);
            }
        });
        this.render();
    }

    completedItem(data) {

        this.todoData.forEach((item) => {

            if (item.value === data && item.completed === false) {
                item.completed = true;
                this.render();
            } else if (item.value === data && item.completed === true) {
                item.completed = false;
                this.render();
            }
        });
        
    }

    handler(e) {

        const target = e.target;

        let button = target.classList.value,
            todoText = target.closest('.todo-item').children[0].textContent;

        if (button === 'todo-remove') {
            this.deleteItem(todoText);
        } else if (button === 'todo-complete') {
            this.completedItem(todoText);
        }

    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.container.addEventListener('click', this.handler.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();