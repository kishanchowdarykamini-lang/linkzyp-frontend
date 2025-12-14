const API_URL = "https://linkzyp-9d99.onrender.com";

// 🔐 Auto redirect if already logged in
const existingToken = localStorage.getItem("token");
if (existingToken) {
    window.location.href = "dashboard.html";
}

// 🔑 Login handler
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        // ✅ Save token & redirect
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login error:", error);
        alert("Unable to connect to server. Please try again.");
    }
});
