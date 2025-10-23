import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import{v2 as cloudinary} from "cloudinary";
import fileUpload from 'express-fileupload';
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import cors from "cors";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/'
    })
);


// Defining Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// MongoDB configuration
const DB_URI = process.env.MONGO_URI || 3000;
mongoose.connect(DB_URI)
    .then(() => console.log("MongoDB Connected!"))
    .catch((error) => console.log(error));

// Start Server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});