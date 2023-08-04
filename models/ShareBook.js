const mongoose = require("mongoose");

const ShareBookSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ownerName: {
    type: String,
  },
  wishListedBy: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  ],
  isShare: {
    type: Boolean,
    default: false,
  },
  bookName: {
    //name of book
    type: String,
    required: true,
  },
  subject: {
    //subject -> Engineering subject
    type: String,
    required: true,
  },
  location: {
    //subject -> Engineering subject
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  selectedFile: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  tags: [String], //tags for book
  noOfPages: {
    //no of pages in the book
    type: Number,
    required: true,
  },
  edition: {
    //edition of the book
    type: String,
    required: true,
  },
  direction: {
    //edition of the book
    type: String,
    required: true,
  },
  description: String, //description of the book
  createdAt: {
    //created At
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    //created At
    type: Date,
    default: Date.now(),
  },
  borrowRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  borrowed: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    returnDate: {
      type: Date,
    },
  },
});

const ShareBook = mongoose.model("ShareBook", ShareBookSchema);

module.exports = ShareBook;
