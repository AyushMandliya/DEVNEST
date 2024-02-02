const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/review");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

// Define the route to handle adding reviews
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Thanks for creating new review! ");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Define the route to handle deleting reviews
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Succesfully deleted the review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
