if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);
console.log(process.env.API_KEY);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

mongoose.connect("mongodb://127.0.0.1:27017/devnest");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "thisisthebestsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

// app.get("/fakeUser", async (req, res) => {
//   const user = new User({
//     email: "ayushmandliya3@gmail.com",
//     username: "Ayushji", // Include username field
//   });
//   try {
//     const newUser = await User.register(user, "samosa");
//     res.send(newUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error creating user");
//   }
// });

// Mount the campgrounds router at '/campgrounds'
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Define the home route
app.get("/", (req, res) => {
  res.render("home");
});

// Route to handle 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, something went wrong !";
  res.status(statusCode).render("error", { err });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
