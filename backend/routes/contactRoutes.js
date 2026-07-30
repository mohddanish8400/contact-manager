// This file contains all the routes (API endpoints) related to contacts.
// Each route talks to MongoDB using our Contact model.

const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// ---------- GET all contacts ----------
// Route: GET /api/contacts
router.get("/", async (req, res) => {
  try {
    // Sort by newest first, so recently added contacts show on top
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
});

// ---------- GET a single contact by id ----------
// Route: GET /api/contacts/:id
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact", error: error.message });
  }
});

// ---------- CREATE a new contact ----------
// Route: POST /api/contacts
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Basic backend validation (frontend already checks this, but we double check here too)
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email and phone are required" });
    }

    const newContact = new Contact({ name, email, phone, address });
    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ message: "Error creating contact", error: error.message });
  }
});

// ---------- UPDATE an existing contact ----------
// Route: PUT /api/contacts/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true } // this makes sure we get back the updated document, not the old one
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error: error.message });
  }
});

// ---------- DELETE a contact ----------
// Route: DELETE /api/contacts/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error: error.message });
  }
});

module.exports = router;