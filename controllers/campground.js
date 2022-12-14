//Controller for the campgrounds routes
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//Homepage
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

//To create a new campground
module.exports.newCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  console.log(campground);
  await campground.save();
  req.flash("success", "You have succesfully created a new campground!");
  res.redirect(`campgrounds/${campground._id}`);
};

//To get the new campground form
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

///To show the campground
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Can't find that campground!");
    res.redirect("/campgrounds");
  } else {
    res.render("campgrounds/show", { campground });
  }
};

//Request to get the edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Can't find that campground!");
    res.redirect("/campgrounds");
  } else {
    res.render("campgrounds/edit", { campground });
  }
};

//To post the edited campground
module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  if (req.body.deleteImages) {
    for (const filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await campground.save();
  req.flash("success", "Succesfully updated a campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

//For deleting campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Succesfully deleted a campground!");
  res.redirect("/campgrounds");
};
