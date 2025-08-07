document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const greetingText = document.getElementById('greeting-text');
  const dateDisplay = document.getElementById('date-display');
  const taskStats = document.getElementById('task-stats');
  const quoteText = document.getElementById('quote-text');
  const changeNameBtn = document.getElementById('change-name-btn');
  const themeSwitch = document.getElementById('theme-switch');

  // New elements for settings menu
  const settingsBtn = document.getElementById('settings-btn');
  const settingsMenu = document.getElementById('settings-menu');

  // New quote list
  const quotes = [
    "“Stay focused and keep shipping.”",
    "“The secret of getting ahead is getting started.”",
    "“Don’t wait. The time will never be just right.”",
    "“Believe you can and you're halfway there.”",
    "“The best way to predict the future is to create it.”",
    "“Success is the sum of small efforts, repeated daily.”"
  ];

  let userName = localStorage.getItem('userName');
  let currentQuoteIndex = 0;

  // ================================
  // Name Prompt & Welcome Animation
  // ================================
  if (!userName) {
    askForName();
  } else {
    updateTopSection(userName);
  }

  function askForName() {
    userName = prompt("Welcome! What's your name?");
    if (userName && userName.trim() !== '') {
      userName = userName.trim();
      localStorage.setItem('userName', userName);
      updateTopSection(userName);
      showWelcomeBanner(userName);
    } else {
      userName = "Friend";
      localStorage.setItem('userName', userName);
      updateTopSection(userName);
    }
  }

  function showWelcomeBanner(name) {
    const banner = document.createElement('div');
    banner.id = 'welcome-banner';
    banner.textContent = `Welcome, ${name}!`;
    document.body.appendChild(banner);

    setTimeout(() => {
      banner.remove();
    }, 3000);
  }

  if (changeNameBtn) {
    changeNameBtn.addEventListener('click', () => {
      localStorage.removeItem('userName');
      askForName();
    });
  }

  function updateTopSection(name) {
    const hour = new Date().getHours();
    let greeting = "Hello";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";

    greetingText.textContent = `${greeting}, ${name}!`;

    const today = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateDisplay.textContent = `Today is ${today}`;
    
    refreshTaskStats();
  }

  // ============================
  // Light / Dark Theme Handling
  // ============================
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeSwitch.checked = true;
    } else {
      document.body.classList.remove('light-mode');
      themeSwitch.checked = false;
    }
  }

  themeSwitch.addEventListener('change', () => {
    const mode = themeSwitch.checked ? 'light' : 'dark';
    localStorage.setItem('theme', mode);
    applyTheme(mode);
  });

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  // =====================
  // To-Do Functionality
  // =====================
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      const newTask = createTaskElement(taskText);
      taskList.appendChild(newTask);
      taskInput.value = '';
      saveTasks();
      refreshTaskStats();
    }
  }

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  function createTaskElement(taskText, isCompleted = false) {
    const li = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';

    li.appendChild(taskSpan);
    li.appendChild(deleteBtn);

    if (isCompleted) {
      li.classList.add('completed');
      taskSpan.textContent = ''; // Hide text when loaded as completed
    }

    taskSpan.addEventListener('click', () => {
      li.classList.toggle('completed');
      if (li.classList.contains('completed')) {
        taskSpan.textContent = ''; // Remove text when clicked
      } else {
        taskSpan.textContent = taskText; // Restore text when uncompleted
      }
      saveTasks();
      refreshTaskStats();
    });

    deleteBtn.addEventListener('click', () => {
      li.classList.add('delete-animation');
      li.addEventListener('transitionend', () => {
        li.remove();
        saveTasks();
        refreshTaskStats();
      });
    });

    return li;
  }

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
      const taskSpan = li.querySelector('.task-text');
      tasks.push({
        text: taskSpan.textContent || li.getAttribute('data-original-text'), // Save original text if hidden
        completed: li.classList.contains('completed')
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function loadTasks() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      const tasks = JSON.parse(stored);
      tasks.forEach(task => {
        const newTask = createTaskElement(task.text, task.completed);
        taskList.appendChild(newTask);
      });
      refreshTaskStats();
    }
  }
  

  function refreshTaskStats() {
    const total = taskList.querySelectorAll('li').length;
    taskStats.textContent = `${total} tasks`;
  }
  
  // =====================
  // Quote Changer
  // =====================
  function updateQuote() {
    quoteText.textContent = quotes[currentQuoteIndex];
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    console.log("Quote updated:", quoteText.textContent);
  }

  // Set the initial quote immediately
  updateQuote();

  // Change quote every minute (60000 milliseconds)
  setInterval(updateQuote, 60000);

  // Load tasks from localStorage on page load
  loadTasks();

  // =====================
  // Settings Menu Logic
  // =====================
  settingsBtn.addEventListener('click', (event) => {
    settingsMenu.classList.toggle('active');
    event.stopPropagation(); // Prevents the document click from immediately closing the menu
  });

  // Close the settings menu if a click occurs outside of it
  document.addEventListener('click', (event) => {
    if (!settingsMenu.contains(event.target) && !settingsBtn.contains(event.target)) {
      settingsMenu.classList.remove('active');
    }
  });

});