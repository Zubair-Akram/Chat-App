import AsyncHandler from "express-async-handler";
import {User} from "../Models/userModel.js";
import generateToken from "../config/generateToken.js";
import path from "path";

const registerUser = AsyncHandler(async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Assign uploaded image OR use default profile image
    const pic = req.file
      ? `/uploads/${req.file.filename}`
      : "/uploads/profile.png"; // Default image

    const user = await User.create({ name, email, password, pic });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id), // Return token after signup
      });
    } else {
      res.status(400);
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

const authUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in DB
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  // Match password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), // Generate token on login
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
  
// /api/user?search=malik 
const allUsers =AsyncHandler(async(req,res)=>{
  const keyword = req.query.search
  ?{
    $or:[
          {name:{$regex:req.query.search, $options:"i"} },
          {email:{$regex:req.query.search, $options:"i"}},
    ],
  }
    :{}
      const users = await User.find(keyword).find({_id:{$ne:req.user._id} });
      res.send(users)
})

export { registerUser, authUser,allUsers };
