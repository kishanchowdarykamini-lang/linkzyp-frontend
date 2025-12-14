const API_URL = "https://linkzyp-9d99.onrender.com";

// 🔐 If user already logged in, redirect
const existingToken = localStorage.getItem("token");
if (existingToken) {
    window.location.href = "dashboard.html";
}

// ✍️ Signup handler
document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Signup failed");
            return;
        }

        alert("Account created successfully! Please login.");
        window.location.href = "login.html";

    } catch (error) {
        console.error("Signup error:", error);
        alert("Unable to connect to server. Please try again.");
    }
});
