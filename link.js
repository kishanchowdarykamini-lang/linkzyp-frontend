const API_URL = "https://linkzyp-9d99.onrender.com";

// 🔐 Load token
const token = localStorage.getItem("token");
if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// Elements
const linkInput = document.getElementById("linkInput");
const saveBtn = document.getElementById("saveLinkBtn");
const linksContainer = document.getElementById("linksContainer");
const logoutBtn = document.getElementById("logoutBtn");

// 🚀 SAVE NEW LINK
saveBtn.addEventListener("click", async () => {
    const url = linkInput.value.trim();
    if (!url) {
        alert("Please enter a link!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/links/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ url })
        });

        if (response.status === 401) {
            handleLogout("Session expired. Please login again.");
            return;
        }

        const data = await response.json();
        linkInput.value = "";
        loadLinks();

    } catch (err) {
        console.error("Network error", err);
        alert("Unable to connect to server.");
    }
});

// 📥 LOAD LINKS
async function loadLinks() {
    try {
        const response = await fetch(`${API_URL}/links/all`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            handleLogout("Session expired. Please login again.");
            return;
        }

        const links = await response.json();
        linksContainer.innerHTML = "";

        links.forEach(link => {
            const div = document.createElement("div");
            div.className = "link-card";

            div.innerHTML = `
                <img src="https://www.google.com/s2/favicons?domain=${link.url}" class="link-icon" />
                <a href="${link.url}" target="_blank">${link.url}</a>
                <button class="copy-btn" onclick="copyLink('${link.url}')">Copy</button>
                <button class="delete-btn" onclick="deleteLink('${link._id}')">Delete</button>
            `;

            linksContainer.appendChild(div);
        });

    } catch (err) {
        console.error("Load error", err);
    }
}

// ❌ DELETE LINK
async function deleteLink(id) {
    try {
        const response = await fetch(`${API_URL}/links/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            handleLogout("Session expired. Please login again.");
            return;
        }

        loadLinks();

    } catch (err) {
        console.error("Delete error", err);
        alert("Unable to delete link.");
    }
}

// 📋 COPY LINK
function copyLink(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert("Link copied!"))
        .catch(() => alert("Copy failed"));
}

// 🚪 LOGOUT HANDLER
logoutBtn.addEventListener("click", () => {
    handleLogout("Logged out successfully");
});

function handleLogout(message) {
    alert(message);
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔄 Auto load on page start
loadLinks();
