const mongoose = require('mongoose');
const { places, descriptors } = require('./seedHelpers.js');
const cities = require('./cities.js');

const CampGround = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
	await CampGround.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new CampGround({
			author: '617dbd42e79fcb3580e6fe29',
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry: { "type" : "Point", "coordinates" : [ cities[random1000].longitude, cities[random1000].latitude ] },
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nulla, ex voluptatum facere eum deserunt porro commodi at fugit culpa alias tempora dolor enim est reprehenderit. Ducimus corporis rerum nulla!',
			price,
			images: [
				{
				  url: 'https://res.cloudinary.com/dk8btgrej/image/upload/v1635989165/YelpCamp/v94weefgg4texv0dwlob.jpg',
				  filename: 'YelpCamp/v94weefgg4texv0dwlob'
				},
				{
				  url: 'https://res.cloudinary.com/dk8btgrej/image/upload/v1635989165/YelpCamp/acxi2ce2manitovgv8g7.jpg',
				  filename: 'YelpCamp/acxi2ce2manitovgv8g7'
				},
				{
				  url: 'https://res.cloudinary.com/dk8btgrej/image/upload/v1635989165/YelpCamp/jgroadjzbn5onlhenohj.jpg',
				  filename: 'YelpCamp/jgroadjzbn5onlhenohj'
				},
				{
				  url: 'https://res.cloudinary.com/dk8btgrej/image/upload/v1635989165/YelpCamp/ymaagzg95waauthrjnyh.jpg',
				  filename: 'YelpCamp/ymaagzg95waauthrjnyh'
				}
			],
		});
		await camp.save();
	}
};

seedDb().then(() => {
	mongoose.connection.close();
});
