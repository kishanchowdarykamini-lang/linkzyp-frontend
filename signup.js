const API_URL = "https://linkzyp-9d99.onrender.com";

document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        return alert("Please fill all fields!");
    }

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Account created! Please login.");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup failed");
        }
    } catch (err) {
        console.error("Network error:", err);
        alert("Unable to connect to server");
    }
});

