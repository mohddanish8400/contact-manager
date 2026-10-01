// const API_URL = "http://localhost:5000/api";
const API_URL = "https://contact-manager-zdje.onrender.com/api";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  loginMessage.textContent = "Logging in...";

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      loginMessage.textContent = data.message || "Login failed";
      return;
    }

    // Save login information
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Go to Contact Manager
    window.location.href = "index.html";

  } catch (error) {
    console.error("Login error:", error);

    loginMessage.textContent =
      "Unable to connect to server. Please try again.";
  }
});