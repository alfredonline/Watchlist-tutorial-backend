const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    movieName: String,
    platform: String,
    watchDate: String,
    overview: String,
    poster_path: String,
})

const Movie = mongoose.model("Movie", movieSchema, "movies")

module.exports.Movie = Movie