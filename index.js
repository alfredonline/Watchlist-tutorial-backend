const express = require("express");
const app = express();
const port = 3010;
const cors = require("cors");
const bodyParser = require("body-parser");
const { Movie } = require("./movieModel.js");
const mongoose = require("mongoose");
const e = require("express");
require("dotenv").config();

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
};

app.post("/addMovie", async (req, res) => {
  const { id, platform, watchDate } = req.body;

  if (!id || !platform || !watchDate) {
    res.status(400).send("Missing required information");
  }

  const getInfo = await fetch(
    `https://api.themoviedb.org/3/find/${id}?external_source=imdb_id`,
    options
  );

  const data = await getInfo.json();

  console.log(data.movie_results[0].title);

  if (getInfo.ok) {
    if (data.movie_results.length === 0) {
      res.status(404).send("Movie not found");
    } else {
      const movie = new Movie({
        movieName: data.movie_results[0].title,
        platform,
        watchDate,
        overview: data.movie_results[0].overview,
        poster_path: data.movie_results[0].poster_path,
      });

      await movie.save();
    }
  }
});

app.get("/getMovies", async (req, res) => {
  const movies = await Movie.find();

  res.send(movies);
});

app.post("/delete", async (req, res) => {
    const deleteMovie = await Movie.findByIdAndDelete(req.body.id) 
});

app.get("/", (req, res) => {
  console.log("hello world");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
