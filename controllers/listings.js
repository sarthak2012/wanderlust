const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "auther" },
    })
    .populate("owner");

  // 🔥 FIX: handle invalid ID / not found
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Associate listing with logged-in user
  newListing.image = { url, filename }; // Store image info in listing
  await newListing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;

  const updatedListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (!updatedListing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }
  if ( typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename }; // Update image info in listing
    await updatedListing.save();
  }

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }

  console.log("Deleted listing:", deletedListing);
  req.flash("success", "listing Deleted Successfully!");
  res.redirect("/listings");
};
