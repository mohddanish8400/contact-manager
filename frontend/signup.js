const API_URL = "http://localhost:5000/api";

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword =
    document.getElementById("confirmPassword").value;
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  // Check password
  if (password !== confirmPassword) {
    signupMessage.textContent = "Passwords do not match.";
    return;
  }

  signupMessage.textContent = "Creating account...";

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        username,
        password,
        email,
        address,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      signupMessage.textContent =
        data.message || "Signup failed.";
      return;
    }

    signupMessage.textContent =
      "Signup successful! Redirecting to login...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (error) {
    console.error("Signup error:", error);

    signupMessage.textContent =
      "Unable to connect to server. Please try again.";
  }
});