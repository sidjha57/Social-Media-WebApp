const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path")

dotenv.config();



mongoose.connect(
    process.env.MONGO_URL, 

    {   
        useNewUrlParser: true
    },(err)=>{
        if(err) console.log(err)
        else console.log("Connected to MongoDB")
    }

);

app.use("/images", express.static(path.join(__dirname, "public/images"))); // dont make any request just go to the directory

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(req);
    cb(null, file.originalname);
  },
});


const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (req,res)=>{
    try{
        return res.status(200).json("File uploaded successfully. ");
    } catch (err) {
        console.log(err);
    }
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.get("/",(req,res)=>{
    res.send("welcome to homepage")
});

app.listen(5000,()=>{
    console.log("Backend server is running!")
});

