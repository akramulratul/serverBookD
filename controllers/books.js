const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");

const { postBookValidator } = require("../validators/joi-validator");
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books), console.log(books);
  } catch (err) {
    return res.status(404).json({ msg: "check" });
  }
};

exports.createBookAd = async (req, res) => {
  const book = req.body;
  const { error } = postBookValidator.validate(req.body);

  if (!req.userId) return res.status(403).json({ msg: "Unauthorized" });
  try {
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    const { selectedFile } = req.body;

    const noOfPages = Number(book.noOfPages);
    const price = Number(book.price);
    const mrp = Number(book.mrp);

    const newBook = new Book({
      ...book,
      noOfPages: noOfPages,
      price: price,
      mrp: mrp,
      owner: req.userId,
      wishListedBy: [],
      createdAt: new Date().toISOString(),
    });
    await newBook.save();

    const currentUser = await User.findById(req.userId);
    const books = currentUser.postedBooks;
    books.push(newBook._id);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { postedBooks: books },
      { new: true }
    );
    updatedUser.save();

    return res.status(201).json({ msg: "Added" });
  } catch (err) {
    return res.status(409).json({ msg: "Something went wrong on Server.." });
  }
};

exports.addToWishList = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.status(403).json({ msg: "Unauthorized access" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: `No Book with id:${id}` });

  try {
    const book = await Book.findById(id);
    const userId = book.wishListedBy.findIndex(
      (id) => id === String(req.userId)
    );

    if (userId == -1) {
      book.wishListedBy.push(req.userId);
    } else {
      book.wishListedBy = book.wishListedBy.filter(
        (id) => id !== String(req.userId)
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
    return res.json(updatedBook);
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};

exports.updateIsSold = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `No Book with id:${id}` });

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { isSold: true },
      { new: true }
    );
    return res.json(updatedBook);
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};

exports.deleteaBook = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `No Book with id:${id}` });

    await Book.findByIdAndRemove(id);
    return res.status(204).json({ msg: "Book Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};

exports.editBook = async (req, res) => {
  const { id } = req.params;
  const toUpDate = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `No Book with id:${id}` });

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        ...toUpDate,
        share: toUpdate.share,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );
    return res.status(200).json(updatedBook);
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};
// Corresponding controller functions (simplified)
exports.requestBook = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: `No book with id: ${id}` });

  try {
    const book = await Book.findById(id);
    if (!book)
      return res.status(404).json({ message: `No book with id: ${id}` });

    if (!book.forSharing)
      return res
        .status(400)
        .json({ message: "This book is not available for sharing" });

    const { userId } = req;
    if (String(book.owner) === String(userId))
      return res
        .status(400)
        .json({ message: "You cannot request your own book" });

    book.borrowRequests.push(userId);
    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });

    return res.json(updatedBook);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong on the server" });
  }
};

exports.acceptRequest = async (req, res) => {
  const { id } = req.params;
  const { borrowerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: `No book with id: ${id}` });

  try {
    const book = await Book.findById(id);
    if (!book)
      return res.status(404).json({ message: `No book with id: ${id}` });

    if (!book.forSharing)
      return res
        .status(400)
        .json({ message: "This book is not available for sharing" });

    const { userId } = req;
    if (String(book.owner) !== String(userId))
      return res.status(400).json({
        message: "You cannot accept a request for a book you don't own",
      });

    if (!book.borrowRequests.includes(borrowerId))
      return res
        .status(400)
        .json({ message: "This user did not request to borrow this book" });

    book.borrowRequests = book.borrowRequests.filter((id) => id !== borrowerId);
    book.currentBorrower = borrowerId;
    book.returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // set return date to one week from now

    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
    return res.json(updatedBook);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong on the server" });
  }
};

exports.returnBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: `No book with id: ${id}` });

  try {
    const book = await Book.findById(id);
    if (!book)
      return res.status(404).json({ message: `No book with id: ${id}` });

    const { userId } = req;
    if (String(book.currentBorrower) !== String(userId))
      return res.status(400).json({
        message: "You cannot return a book you are not currently borrowing",
      });

    book.currentBorrower = null;
    book.returnDate = null;

    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
    return res.json(updatedBook);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong on the server" });
  }
};
