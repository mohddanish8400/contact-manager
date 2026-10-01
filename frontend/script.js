// ---------- Authentication ----------

const token = localStorage.getItem("token");
const loggedInUser = JSON.parse(localStorage.getItem("user"));

if (!token || !loggedInUser) {
  window.location.href = "login.html";
}

// Show logged-in user
document.getElementById("loggedInUser").textContent =
  loggedInUser.username;

document.getElementById("userRole").textContent =
  loggedInUser.role === "demo" ? "Demo Account" : "Registered User";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "login.html";
});
// ---------- Backend API URL ----------
// This is where our Express server will be running.

// const API_URL = "http://localhost:5000/api/contacts";
// const API_URL = "https://contact-manager-api.onrender.com/api/contacts";
const API_URL = "https://contact-manager-zdje.onrender.com/api/contacts";

const contactForm = document.getElementById("contactForm");
const formTitle = document.getElementById("formTitle");
const contactIdInput = document.getElementById("contactId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const searchInput = document.getElementById("searchInput");
const contactList = document.getElementById("contactList");
const emptyMessage = document.getElementById("emptyMessage");


// We keep a copy here so searching is fast (no need to call server every time).
let allContacts = [];

// ---------- Load all contacts when the page first opens ----------
window.addEventListener("DOMContentLoaded", getContacts);

// ---------- Function to fetch all contacts from backend ----------

// async function getContacts() {
//   try {
//     const response = await fetch(API_URL);
//     const data = await response.json();
//     allContacts = data;
//     renderContacts(allContacts);
//   } catch (error) {
//     console.log("Error fetching contacts:", error);
//     contactList.innerHTML = "<p>Something went wrong while loading contacts.</p>";
//   }
// }
async function getContacts() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Error loading contacts:", data.message);
      return;
    }

    allContacts = data;
    renderContacts(allContacts);

  } catch (error) {
    console.log("Error fetching contacts:", error);

    contactList.innerHTML =
      "<p>Something went wrong while loading contacts.</p>";
  }
}

// ---------- Function to display contacts on the page ----------
function renderContacts(contacts) {
  // If there are no contacts, show the empty message
  if (contacts.length === 0) {
    contactList.innerHTML = "";
    contactList.appendChild(emptyMessage);
    return;
  }

  // Clear the list first, then rebuild it
  contactList.innerHTML = "";

  contacts.forEach((contact) => {
    // Create a card div for each contact
    const card = document.createElement("div");
    card.className = "contact-card";

    card.innerHTML = `
      <div class="contact-info">
        <h3>${contact.name}</h3>
        <p>📧 ${contact.email}</p>
        <p>📞 ${contact.phone}</p>
        ${contact.address ? `<p>🏠 ${contact.address}</p>` : ""}
      </div>
      <div class="contact-actions">
        <button class="edit-btn" onclick="editContact('${contact._id}')">Edit</button>
        <button class="delete-btn" onclick="deleteContact('${contact._id}')">Delete</button>
      </div>
    `;

    contactList.appendChild(card);
  });
}

// ---------- Form Validation ----------

function validateForm() {
  let isValid = true;

  // Reset all error messages first
  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const phoneValue = phoneInput.value.trim();

  // Name validation 
  if (nameValue.length < 2) {
    nameError.textContent = "Name must be at least 2 characters.";
    isValid = false;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  // Phone validation 
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phoneValue)) {
    phoneError.textContent = "Phone number must be exactly 10 digits.";
    isValid = false;
  }

  return isValid;
}

// ---------- Handle Form Submit (Add or Update) ----------
/*contactForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // stop the page from refreshing

  // First check if the form data is valid
  if (!validateForm()) {
    return;
  }

  // Build the contact object from form values
  const contactData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    address: addressInput.value.trim(),
  };

  const existingId = contactIdInput.value;

  try {
    if (existingId) {
      // If there is an id, it means we are editing an existing contact
      await fetch(`${API_URL}/${existingId}`, {
        method: "PUT",
        headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`,
                },
        body: JSON.stringify(contactData),
      });
    } else {
      // Otherwise, we are adding a brand new contact
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                  },
        body: JSON.stringify(contactData),
      });
    }

    resetForm(); // clear the form after successful submit
    getContacts(); // reload the contact list to show the update
  } catch (error) {
    console.log("Error saving contact:", error);
    alert("Something went wrong while saving the contact.");
  }
});*/
// ---------- Handle Form Submit (Add or Update) ----------
contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Demo account is view-only
  if (loggedInUser.role === "demo") {
    alert(
      "Demo Account is view-only.\n\nPlease Sign Up to add or edit contacts."
    );
    return;
  }

  // First check if the form data is valid
  if (!validateForm()) {
    return;
  }

  const contactData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    address: addressInput.value.trim(),
  };

  const existingId = contactIdInput.value;

  try {
    let response;

    if (existingId) {
      // Update existing contact
      response = await fetch(`${API_URL}/${existingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });
    } else {
      // Add new contact
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });
    }

    const data = await response.json();

    // Backend rejected the request
    if (!response.ok) {
      alert(data.message || "Unable to save contact.");
      return;
    }

    // Only reset after successful Add/Update
    resetForm();
    getContacts();

  } catch (error) {
    console.log("Error saving contact:", error);
    alert("Something went wrong while saving the contact.");
  }
});
// 

// ---------- Edit Contact ----------
function editContact(id) {
  // Find the contact in our local array using its id
  const contact = allContacts.find((c) => c._id === id);
  if (!contact) return;

  // Fill the form with this contact's existing details
  contactIdInput.value = contact._id;
  nameInput.value = contact.name;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone;
  addressInput.value = contact.address || "";

  // Change the form title and button text to show we are editing
  formTitle.textContent = "Edit Contact";
  submitBtn.textContent = "Update Contact";
  cancelBtn.style.display = "inline-block";

  // Scroll to the top so the user can see the form
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Cancel Edit ----------
cancelBtn.addEventListener("click", function () {
  resetForm();
});

// ---------- Reset Form back to "Add" mode ----------
function resetForm() {
  contactForm.reset();
  contactIdInput.value = "";
  formTitle.textContent = "Add New Contact";
  submitBtn.textContent = "Add Contact";
  cancelBtn.style.display = "none";

  // Clear any leftover error messages
  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";
}

// ---------- Delete Contact ----------
/*async function deleteContact(id) {
  // Ask user to confirm before deleting, so they don't do it by mistake
  const confirmDelete = confirm("Are you sure you want to delete this contact?");
  if (!confirmDelete) return;

  try {
    // await fetch(`${API_URL}/${id}`, {
    //   method: "DELETE",
    // });
    // last update
    // 
    const response = await fetch(`${API_URL}/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();

if (!response.ok) {
  alert(data.message || "Unable to delete contact.");
  return;
}
    getContacts(); // reload the list after deleting
  } catch (error) {
    console.log("Error deleting contact:", error);
    alert("Something went wrong while deleting the contact.");
  }
}*/

// ---------- Delete Contact ----------
async function deleteContact(id) {
  // Demo account is view-only
  if (loggedInUser.role === "demo") {
    alert(
      "Demo Account is view-only.\n\nPlease Sign Up to delete contacts."
    );
    return;
  }

  // Ask user to confirm before deleting
  const confirmDelete = confirm(
    "Are you sure you want to delete this contact?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to delete contact.");
      return;
    }

    alert("Contact deleted successfully.");
    getContacts();

  } catch (error) {
    console.log("Error deleting contact:", error);
    alert("Something went wrong while deleting the contact.");
  }
}
// 

// ---------- Search / Filter Contacts ----------
searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.trim().toLowerCase();

  // Filter the local contacts array by name (case-insensitive)
  const filteredContacts = allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchValue)
  );

  renderContacts(filteredContacts);
});