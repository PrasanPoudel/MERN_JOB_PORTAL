const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "karyasetuDB",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occurred while connecting to database: ${err}`);
      process.exit(1);
    });
};
module.exports = connectDB;
