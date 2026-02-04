

const users = {
  "Avisek": "1234",
  "Salon": "1234",
  "Ishant": "1234"
};

function redirect() {
  const username = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (users[username] && users[username] === password) {
    localStorage.setItem("studyhive_user", username);
    window.location.href = "index.html";
  } else {
    alert("Invalid username or password");
  }
}

const toggleButtons = document.querySelectorAll('.toggle-button');
const mainButton = document.querySelector('.btn-primary');
const emailPrompt = document.querySelector('.email-prompt');
const socialButtons = document.querySelectorAll('.btn-social');
const forgotPasswordLink = document.querySelector('.options a');
const forgotPasswordContainer = document.querySelector('.options');


toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const isSignUp = button.textContent.toLowerCase().includes('sign up');
        
        if (isSignUp) {
            emailPrompt.textContent = 'Sign up with your email';
            mainButton.textContent = 'Sign up';
            socialButtons.forEach(btn => btn.textContent = btn.textContent.replace('Sign in', 'Sign up'));
            forgotPasswordContainer.style.display = 'none';
        } else {
            emailPrompt.textContent = 'Sign in with your email';
            mainButton.textContent = 'Sign in';
            socialButtons.forEach(btn => btn.textContent = btn.textContent.replace('Sign up', 'Sign in'));
            forgotPasswordContainer.style.display = 'block';
        }
    });
});


document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }
    
    const isSignUpActive = document.querySelector('.toggle-button.active').textContent.toLowerCase().includes('sign up');
    
    const endpoint = isSignUpActive 
        ? "http://localhost:5000/api/auth/signup" 
        : "http://localhost:5000/api/auth/login"; 

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || (isSignUpActive ? "Sign up failed" : "Login failed"));
            return;
        }

        localStorage.setItem("token", data.token);

        window.location.href = "index.html";
    } catch (err) {
        console.error(err);
        alert("Server error. Check if backend is running.");
    }
  
});