const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');

const opts = { toJSON: { virtuals: true } };

const CampGroundSchema = new Schema({
	title: String,
	price: Number,
	description: String,
	location: String,
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	images: [
		{
			url: String,
			filename: String
		}
	],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
}, opts);

CampGroundSchema.virtual('properties.popUpMarkUp').get(function() {
	return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
			<p>${this.description.substr(0, 35)}...</p>
			<p>Price: $${this.price}</p>`;
  });

CampGroundSchema.post('findOneAndDelete', async function(doc) {
	if (doc) {
		await Review.deleteMany({_id: {$in: doc.reviews}});
	}
})

module.exports = mongoose.model('Campground', CampGroundSchema);