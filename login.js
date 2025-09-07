document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Toggles between login and register forms
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginMessage.innerText = '';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        registerMessage.innerText = '';
    });

    // Handle user registration
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Simple validation
        if (password.length < 6) {
            registerMessage.innerText = "የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።";
            registerMessage.style.color = '#e53e3e';
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            registerMessage.innerText = "ይህ ኢሜል ቀድሞውኑ አለ።";
            registerMessage.style.color = '#e53e3e';
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        registerMessage.innerText = "በተሳካ ሁኔታ ተመዝግበዋል። አሁን መግባት ይችላሉ።";
        registerMessage.style.color = '#48bb78';
        
        // Clear the form after registration
        registerForm.reset();
        
        // Automatically switch to login form
        setTimeout(() => {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            registerMessage.innerText = '';
        }, 2000);
    });

    // Handle user login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            // Store the logged-in user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            loginMessage.innerText = "በተሳካ ሁኔታ ገብተዋል።";
            loginMessage.style.color = '#48bb78';
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            loginMessage.innerText = "የተጠቃሚ ስም ወይም የይለፍ ቃል የተሳሳተ ነው።";
            loginMessage.style.color = '#e53e3e';
        }
    });
});
