if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

// routers
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRouter = require("./routes/user");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

// view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto:{
  secret:process.env.SECRET
  },
  touchAfter: 24 * 60 * 60, // time period in seconds between session updates in the database
});
store.on("error", function (e) {
  console.log("Session store error:", e);
});

//sessions and cookies
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// session middleware
app.use(session(sessionOptions));
app.use(flash());

//passport(auth)
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
//serialize and deserialize of user in sesssion
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//base
// base route
// app.get("/", (req, res) => {
//   res.send("Hello, I am root route");
// });

//flash local middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// demo route to create a user and register it in the database using passport local mongoose
// app.get("/demouser", async (req, res) => {
//   const fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

// app.get("/testlisting", async (req, res) => {
//     let sampleListings = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing for testing.",
//         price: 100,
//         location: "Sample Location",
//         Country: "Sample Country"
//     });
//     await sampleListings.save();
//     console.log("Sample listing saved");
//     res.send("Sample listing created and saved to the database.");
// });

// Validating listing data using Joi schema before creating a new listing in the database
// validating as a joi midlleware
//backend / server error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong! Please try again later.");
// });

// listing routes
app.use("/listings", listingRoutes);

// review routes (nested)
app.use("/listings/:id/reviews", reviewRoutes);

// review routes (nested)
app.use("/", userRouter);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);

  let { statusCode = 500, message = "Something went wrong!" } = err;

  res.status(statusCode).render("error.ejs", {
    err,
    message,
    statusCode,
  });
});
// DB + server start
async function main() {
  try {
    await mongoose.connect(MONGO_URL);

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  } catch (err) {
    console.log(err);
  }
}

main();
