// This file defines how a "Contact" looks in our MongoDB database.
// We use Mongoose to create a Schema (a blueprint) and then a Model from it.

const mongoose = require("mongoose");

// Defining the structure/blueprint for a contact
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // removes extra spaces from beginning and end
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: "", // address is optional, so default is an empty string
    },
  },
  {
    // This automatically adds "createdAt" and "updatedAt" fields to every contact
    timestamps: true,
  }
);

// Creating the model from the schema
// "Contact" will become the "contacts" collection in MongoDB (Mongoose does this automatically)
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;