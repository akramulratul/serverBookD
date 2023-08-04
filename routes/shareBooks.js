const express = require("express");
const router = express.Router();
const {
  getSharedBooks,
  createShareBookAd,
  addToWishList,
  updateIsSold,
  deleteAShareBook,
  //   editBook,
  //   requestBook, // make sure this is added
  //   acceptRequest, // and this
  //   returnBook, // and this
} = require("../controllers/shareBook");
const auth = require("../middleware/auth");

router.get("/all", getSharedBooks);
router.post("/share", auth, createShareBookAd);
// router.patch("/:id/addWishList", auth, addToWishList);
router.delete("/:id", auth, deleteAShareBook);
// router.patch("/:id", auth, editBook);
// router.patch("/:id/request", auth, requestBook);
// router.patch("/:id/accept", auth, acceptRequest);
// router.patch("/:id/return", auth, returnBook);

module.exports = router;
