const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
	const geoData = await geoCoder.forwardGeocode({
		query: req.body.location,
		limit: 1
	}).send();
	const newCamp = new Campground(req.body);
	newCamp.geometry = geoData.body.features[0].geometry;
	newCamp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
	newCamp.author = req.user._id;
	await newCamp.save();
    req.flash('success', 'Campground was successfully created!');
	res.redirect(`/campgrounds/${newCamp._id}`);	
}

module.exports.showCampground = async (req, res) => {
	const camp = await Campground.findById(req.params.id).populate({
		path: 'reviews',
		populate: 'author'
	}).populate('author');
	if (!camp) {
		req.flash('error', 'Cannot find that campground!')
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { camp });
}

module.exports.renderEditForm = async (req, res) => {
	const camp = await Campground.findById(req.params.id);
	if (!camp) {
		req.flash('error', 'Cannot find that campground!')
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { camp });
}

module.exports.updateCampground = async (req, res) => {
	const camp = await Campground.findByIdAndUpdate(req.params.id, req.body);
	const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
	camp.images.push(...imgs);
	await camp.save();
	const deletedImages = req.body.deletedImages;
	if (deletedImages) {
		await camp.updateOne({$pull: {images: {filename: {$in: deletedImages}}}});
		for (let filename of deletedImages) {
			await cloudinary.uploader.destroy(filename);
		}
	}
	req.flash('success', 'Campground was successfully updated!');
	res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Campground was successfully deleted!!');
	res.redirect('/campgrounds');
}