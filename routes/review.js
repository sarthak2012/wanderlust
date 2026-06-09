const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { validateReview,isLoggedIn,isReviewAuther } = require("../middleware");
const reviewConrtoller = require("../controllers/reviews");

//Reviews routes
//post route to create a new review for a specific listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewConrtoller.createReview),
);

//Delete route to delete a review for a specific listing
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuther,
  wrapAsync(reviewConrtoller.deleteReview),
);
module.exports = router;
