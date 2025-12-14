const API_URL = "https://linkzyp-9d99.onrender.com";

// 🔐 Load Token
const token = localStorage.getItem("token");
if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// 👤 Show logged-in email
const emailEl = document.getElementById("userEmail");
const savedEmail = localStorage.getItem("userEmail");
if (emailEl && savedEmail) {
    emailEl.textContent = `Logged in as ${savedEmail}`;
}

// Elements
const linkInput = document.getElementById("linkInput");
const noteInput = document.getElementById("noteInput"); // OPTIONAL
const saveBtn = document.getElementById("saveLinkBtn");
const linksContainer = document.getElementById("linksContainer");
const logoutBtn = document.getElementById("logoutBtn");

// 🚀 SAVE NEW LINK (with optional note)
saveBtn.addEventListener("click", async () => {
    const url = linkInput.value.trim();
    const note = noteInput ? noteInput.value.trim() : "";

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
            body: JSON.stringify({ url, note })
        });

        const data = await response.json();

        if (response.ok) {
            linkInput.value = "";
            if (noteInput) noteInput.value = "";
            loadLinks();
        } else {
            alert(data.message || "Failed to add link");
        }
    } catch (err) {
        console.error("Add link error:", err);
        alert("Unable to connect to server");
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

        const result = await response.json();
        linksContainer.innerHTML = "";

        // Normalize response
        const links = Array.isArray(result)
            ? result
            : Array.isArray(result.links)
                ? result.links
                : [];

        // 🫙 Empty state
        if (links.length === 0) {
            linksContainer.innerHTML = `
                <p style="text-align:center;color:#888;margin-top:20px;">
                    No links yet. Add your first one 🚀
                </p>
            `;
            return;
        }

        links.forEach(link => {
            const div = document.createElement("div");
            div.className = "link-card";

            div.innerHTML = `
                <img src="https://www.google.com/s2/favicons?domain=${link.url}" class="link-icon" />
                <div style="flex:1">
                    <a href="${link.url}" target="_blank">${link.url}</a>
                    ${link.note ? `<div style="font-size:13px;color:#666;margin-top:4px;">📝 ${link.note}</div>` : ""}
                </div>
                <button class="copy-btn" onclick="copyLink('${link.url}')">Copy</button>
                <button class="delete-btn" onclick="deleteLink('${link._id}')">Delete</button>
            `;

            linksContainer.appendChild(div);
        });

    } catch (err) {
        console.error("Load links error:", err);
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

        if (response.ok) {
            loadLinks();
        } else {
            const data = await response.json();
            alert(data.message || "Failed to delete link");
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Server error");
    }
}

// 📋 COPY LINK
function copyLink(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert("Link copied!"))
        .catch(() => alert("Copy failed"));
}

// 🚪 LOGOUT
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// 🔄 Auto-load
loadLinks();
