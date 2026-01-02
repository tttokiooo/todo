class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';

        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.list = document.getElementById('todo-list');
        this.countEl = document.getElementById('todo-count');
        this.clearBtn = document.getElementById('clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        this.clearBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo() {
        const text = this.input.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        this.todos.push(todo);
        this.saveTodos();
        this.input.value = '';
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filtered = this.getFilteredTodos();

        if (filtered.length === 0) {
            this.list.innerHTML = '<li class="empty-message">タスクがありません</li>';
        } else {
            this.list.innerHTML = filtered.map(todo => `
                <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <input
                        type="checkbox"
                        class="todo-checkbox"
                        ${todo.completed ? 'checked' : ''}
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="todo-delete">削除</button>
                </li>
            `).join('');

            this.list.querySelectorAll('.todo-item').forEach(item => {
                const id = parseInt(item.dataset.id);

                item.querySelector('.todo-checkbox').addEventListener('change', () => {
                    this.toggleTodo(id);
                });

                item.querySelector('.todo-delete').addEventListener('click', () => {
                    this.deleteTodo(id);
                });
            });
        }

        const activeCount = this.todos.filter(t => !t.completed).length;
        this.countEl.textContent = `${activeCount}件の未完了タスク`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
