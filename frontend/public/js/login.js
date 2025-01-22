const handleLogin = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      // Save the userId in local storage
      localStorage.setItem("userId", result.user._id);

      // Redirect to home page
      window.location.href = "./home.html";
    } else {
      // Show error message from server
      alert(result.error || "Login failed! Please try again.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred while trying to log in. Please try again later.");
  }
};

document.getElementById("loginForm").addEventListener("submit", handleLogin);


document.getElementById("loginForm").addEventListener("submit", handleLogin);
