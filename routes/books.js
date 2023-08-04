const express = require("express");
const router = express.Router();
const {
  getBooks,
  createBookAd,
  addToWishList,
  updateIsSold,
  deleteaBook,
  editBook,
  requestBook, // make sure this is added
  acceptRequest, // and this
  returnBook, // and this
} = require("../controllers/books");
const auth = require("../middleware/auth");

router.get("/all", getBooks);
router.post("/add", auth, createBookAd);
router.patch("/:id/addWishList", auth, addToWishList);
router.patch("/:id/sold", auth, updateIsSold);
router.delete("/:id", auth, deleteaBook);
router.patch("/:id", auth, editBook);
router.patch("/:id/request", auth, requestBook);
router.patch("/:id/accept", auth, acceptRequest);
router.patch("/:id/return", auth, returnBook);

module.exports = router;
