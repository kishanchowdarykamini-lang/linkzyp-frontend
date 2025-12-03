const API_URL = "https://linkzyp-9d99.onrender.com";

document.getElementById("signupBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        return alert("Please fill all fields!");
    }

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (data.success) {
        alert("Account created! Please login.");
        window.location.href = "login.html";
    } else {
        alert(data.message || "Signup failed");
    }
});
