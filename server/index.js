// Example route in your Express app

const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const multer = require("multer");

const storage = multer.memoryStorage(); // Use memory storage for files
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



mongoose.connect(
  "mongodb+srv://mwankhade718:3Njk4TwEigM2Tn6D@cluster0.riro8nv.mongodb.net/anchor?retryWrites=true&w=majority"
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
  },
  password: {
    type: String,
  }
});

const ProfileSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        trim: true,
    },
    profilePic: {
        // You can define the subfields for the profilePic if needed
    },
    linkedIn: {
        type: String,
        trim: true,
    },
    github: {
        type: String,
        trim: true,
    },
    resume: {
      fieldname: String,
      originalname: String,
      encoding: String,
      mimetype: String,
      buffer: Buffer,
      size: Number,
    },
    type: {
        type: String,
        trim: true,
    },
    schoolCollegeName: {
        type: String,
        trim: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    projectName: {
        type: String,
        trim: true,
    },
    projectDescription: {
        type: String,
        trim: true,
    },
    soloOrGroup: {
        type: String,
        trim: true,
    },
    projectLink: {
        type: String,
        trim: true,
    },
    internshipJobType: {
        type: String,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    companyWebsite: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
    },
    experienceStartDate: {
        type: Date,
    },
    experienceEndDate: {
        type: Date,
    },
    coverLetter: {
        type: String,
        trim: true,
    },
    coinsEarned: {
      type: Number || String, 
      required: true,
    }
});

const InternshipSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  slug: String,
  company_name: String,
  title: String,
  description: String,
  remote: Boolean,
  url: String,
  tags: [String],
  job_types: [String],
  location: String,
  created_at: Date,
  additional_info: {
    experience: {
      type: String,
      default: 'Entry-level', // or any default value you prefer
    },
    qualifications: [String],
    languages: [String],
    education: String,
  },
});

const Internship = mongoose.model('Internship', InternshipSchema);
const Profile = mongoose.model('Profile', ProfileSchema);
const User = mongoose.model("User", userSchema);



app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save user details to the database
    const newUser = new User({
      email,
      otp,
    });
    await newUser.save();

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mwankhade718@gmail.com", // Your Gmail email address
        pass: "whop fnur haeb egho", // Your Gmail password or an application-specific password
      },
    });

    const mailOptions = {
      from: "milind.22110803@viit.ac.in",
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP for registration is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Example route in your Express app

app.post("/verify-otp", async (req, res) => {
  try {
    console.log(req.body);

    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify the provided OTP against the stored OTP in the user document
    const isOtpValid = otp && user.otp === otp;

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear the OTP in the user document after successful login (optional for one-time use)
    user.otp = undefined;
    await user.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/new-profile', upload.single('resumePdf'), async (req, res) => {
  try {
    const profile = JSON.parse(req.body.profileData);
    const email = profile.email;
    const resume = req.file; // Access the file from req.file
    profile['resume'] = resume;

    if (email) {
      // If email exists, find the user by email and update the profile
      const existingUser = await Profile.findOneAndUpdate(
        { email: email },
        { $set: { profile: { ...profile, resume } } }, // Include the resume in the profile
        { new: true }
      );

      if (existingUser) {
        // If the user with the given email is found and updated, send a success response
        return res.status(200).json({ message: 'Profile updated successfully' });
      }

      const newProfile = new Profile({ ...profile, resume });
      await newProfile.save();
      res.status(201).json({ message: 'New profile created successfully' });
    } else {
      res.status(400).json({ message: 'please register or login' });
    }
  } catch (error) {
    console.error('Error while creating or updating a profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/set-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password },
      { new: true } 
    );

    if (updatedUser) {
      res.status(200).json({ message: 'Password set successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/login', async(req, res) =>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      if(user.password === password){
        res.status(200).json({message:"Logged in Successfully"});
      }
      else{
        res.status(404).json({message: "Please enter valid username or password"})
      }
    } else {
      res.status(404).json({ message: 'Please Signup' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})


app.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-coins', async (req, res) => {
  try {
    const email = req.query.email; // Use query parameters for GET requests
    if (email) {
      const userProfile = await Profile.findOne({ email }); // Assuming you are using Mongoose and 'email' is a unique field
      if (userProfile) {
        const coins = userProfile.coinsEarned;
        res.status(200).send({ coins });
      } else {
        res.status(404).send({ error: 'User not found' });
      }
    } else {
      res.status(400).send({ error: 'Email parameter is missing' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/update-coins', async (req, res) => {
  try {
    const email = req.query.email;
    const coins = req.query.coins;

    if (email && coins) {
      const updatedProfile = await Profile.findOneAndUpdate(
        { email: email },
        { $set: { coins: coins } },
        { new: true }
      );

      if (updatedProfile) {
        res.status(200).send({ success: 'Coins updated successfully', coins });
      } else {
        res.status(404).send({ error: 'User not found' });
      }
    } else {
      res.status(400).send({ error: 'Email or coins parameters are missing' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
  

app.listen(3000, () => console.log(`Server is running on port 3000`));
