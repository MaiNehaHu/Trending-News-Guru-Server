const connectDB = require("./db/connect");
const Location = require("./models/location");

const locationsListJSON = require("./locations.json");

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        await Location.insertMany(locationsListJSON, { ordered: false });
        console.log("Yayy!! sucessfully inserted all locations");
    } catch (err) {
        console.log(err);
    }
};

start();
