const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function seedDB() {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos possimus eligendi reiciendis expedita minima? Laudantium esse quaerat odio incidunt harum tenetur cum quidem qui, reprehenderit consequatur dolores cumque? Ab, cumque!",
      author: "633ffc6f03af61c2bc226551",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dsjxemiof/image/upload/v1665643996/YelpCamp/hvxoa1epyrbvjysfcyxi.jpg",
          filename: "YelpCamp/hvxoa1epyrbvjysfcyxi",
        },
        {
          url: "https://res.cloudinary.com/dsjxemiof/image/upload/v1665643988/YelpCamp/hbvoph71fr3f81faoqqs.jpg",
          filename: "YelpCamp/hbvoph71fr3f81faoqqs",
        },
        {
          url: "https://res.cloudinary.com/dsjxemiof/image/upload/v1665643986/YelpCamp/u8qvcmvo2tcekju05ayc.jpg",
          filename: "YelpCamp/u8qvcmvo2tcekju05ayc",
        },
      ],
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});
