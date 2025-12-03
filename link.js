const API_URL = "https://linkzyp-9d99.onrender.com";

// Load Token
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

// SAVE NEW LINK
saveBtn.addEventListener("click", async () => {
    const url = linkInput.value.trim();
    if (!url) return alert("Please enter a link!");

    try {
        const response = await fetch(`${API_URL}/links/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        if (data.success) {
            linkInput.value = "";
            loadLinks();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error("Network error", err);
        alert("Unable to connect to backend!");
    }
});

// LOAD LINKS
async function loadLinks() {
    try {
        const response = await fetch(`${API_URL}/links/all`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        linksContainer.innerHTML = "";

        if (!data.links) return;

        data.links.forEach(link => {
            const div = document.createElement("div");
            div.classList.add("link-card");

            div.innerHTML = `
                <img src="https://www.google.com/s2/favicons?domain=${link.url}" class="link-icon" />
                <a href="${link.url}" target="_blank">${link.url}</a>
                <button class="copy-btn" onclick="copyLink('${link.url}')">Copy</button>
                <button class="delete-btn" onclick="deleteLink('${link._id}')">Delete</button>
            `;

            linksContainer.appendChild(div);
        });
    } catch (err) {
        console.error("Network error", err);
    }
}

// DELETE LINK
async function deleteLink(id) {
    try {
        const response = await fetch(`${API_URL}/links/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            loadLinks();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error("Network error", err);
    }
}

// Auto-load on page start
loadLinks();

function copyLink(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert("Link copied to clipboard!"))
        .catch(err => console.log("Copy failed", err));
}

// LOGOUT
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});