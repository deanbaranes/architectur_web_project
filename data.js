// Singleton Pattern for Session Management
class SessionManager {
    constructor() {
        if (SessionManager.instance) {
            return SessionManager.instance;
        }
        
        this.currentWorker = JSON.parse(localStorage.getItem('currentWorker')) || null;
        SessionManager.instance = this;
    }

    getCurrentWorker() {
        return this.currentWorker;
    }

    setCurrentWorker(worker) {
        this.currentWorker = worker;
        localStorage.setItem('currentWorker', JSON.stringify(worker));
    }

    clearCurrentWorker() {
        this.currentWorker = null;
        localStorage.removeItem('currentWorker');
    }

    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }
}

// Initialize data and set up event listeners when the page loads
window.onload = function() {
    initializeWorkerData();
    initializeFormFields();
    
    // Add event listener for login form
    document.getElementById("loginform").addEventListener("submit", validatelogin);
};

// Function to initialize worker data
function initializeWorkerData() {
    const initialWorkers = {
        '204750806': { name: 'Dean.p', password: '123456' },
        '313945172': { name: 'Dean.b', password: '123456' },
        '316204742': { name: 'Orian', password: '123456' },
        '213703390': { name: 'Ramy', password: '123456' }
    };
    localStorage.setItem('workers', JSON.stringify(initialWorkers));
}

// Function to initialize form fields if worker is already logged in
function initializeFormFields() {
    const sessionManager = SessionManager.getInstance();
    const currentWorker = sessionManager.getCurrentWorker();
    if (currentWorker) {
        document.getElementById("username").value = currentWorker.id;
        var storedWorkers = JSON.parse(localStorage.getItem('workers')) || {};
        if (storedWorkers[currentWorker.id]) {
            document.getElementById("pwd").value = storedWorkers[currentWorker.id].password;
        }
    }
}

// Function to validate login credentials
// Real-time username validation
function validateUsername() {
    var username = document.getElementById("username").value.trim();
    var loginmsg = document.getElementById("loginmsg");

    if (username === "" || username.length < 9) {
        loginmsg.textContent = "Please enter a 9-digit ID.";
    } else {
        loginmsg.textContent = ""; // Clear any previous message
    }
}

// Modified login validation function
function validatelogin(event) {
    event.preventDefault();
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("pwd").value.trim();
    var alertmsg = "";

    // Check if the username is valid
    if (username === "" || username.length < 9) {
        alertmsg += "Please enter a 9-digit ID.\n";
    }
    if (password === "") {
        alertmsg += "Please enter a password.\n";
    }

    if (alertmsg !== "") {
        alert(alertmsg);
        return;
    }

    var storedWorkers = JSON.parse(localStorage.getItem('workers')) || {};
    const sessionManager = SessionManager.getInstance();

    if (storedWorkers[username]) {
        if (storedWorkers[username].password === password) {
            sessionManager.setCurrentWorker({id: username, name: storedWorkers[username].name});
            document.getElementById("loginmsg").textContent = "Welcome, " + storedWorkers[username].name + "!";
        } else {
            document.getElementById("loginmsg").textContent = "Incorrect password";
        }
    } else {
        document.getElementById("loginmsg").textContent = "User does not exist";
    }
}

// Function to log out the current worker
function logout() {
    const sessionManager = SessionManager.getInstance();
    const currentWorker = sessionManager.getCurrentWorker();
    if (currentWorker && currentWorker.name) {
        alert("Goodbye, " + currentWorker.name + "!");
    } else {
        alert("No user is currently logged in.");
    }
    sessionManager.clearCurrentWorker();
    document.getElementById("username").value = "";
    document.getElementById("pwd").value = "";
    document.getElementById("loginmsg").textContent = "";
}
