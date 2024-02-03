const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/devnest");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  const c = new Campground({ title: "purple field" });
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 25) + 10;
    const camp = new Campground({
      author: "65bbc11c8655bd44855d36be",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)},${sample(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus eligendi voluptatibus ullam dolorum, tempora odit commodi, quae officiis aspernatur aliquam dolores explicabo, impedit odio. Officia cumque adipisci sed ex illum.",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/diowrn2cs/image/upload/v1706941629/DEVNEST/m8rpe8gpeoqs1faia7md.jpg",
          filename: "DEVNEST/m8rpe8gpeoqs1faia7md",
        },
        {
          url: "https://res.cloudinary.com/diowrn2cs/image/upload/v1706939422/DEVNEST/ukf8w9xpj6wdamieymff.png",
          filename: "DEVNEST/ukf8w9xpj6wdamieymff",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
