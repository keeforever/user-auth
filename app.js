require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// database
const connectDB = require("./db/connect");

// cookie parser
const cookieParser = require("cookie-parser");

// file upload
const fileupload = require("express-fileupload");

// middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileupload());
app.use(express.static("./public"));

// security
const helmet = require('helmet')
const xss = require("xss-clean")
const cors = require('cors')
const expressSanitizer = require('express-sanitizer')
const expressLimit = require("express-rate-limit")

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(expressSanitizer())
app.use(expressLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

// routes
const authRouter = require("./routes/authRoutes");
const usersRouter = require("./routes/usersRoutes");
const productsRouter = require("./routes/productsRoutes");
const reviewsRouter = require("./routes/reviewsRoutes");
const orderRouter = require("./routes/orderRoutes");

const usersAuthentication = require("./middleware/usersAuthentication");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersAuthentication, usersRouter);
app.use("/api/v1/products", usersAuthentication, productsRouter);
app.use("/api/v1/reviews", usersAuthentication, reviewsRouter);
app.use("/api/v1/orders", usersAuthentication, orderRouter);

// errors
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// port
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`Mongo DB connected successfully.`);
    app.listen(
      port,
      console.log(`Server listening successfully on port ${port} ...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
