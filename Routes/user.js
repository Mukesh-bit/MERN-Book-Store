const router = require("express").Router();
const userModal = require("../modals/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const {authenticateToken} = require('./userAuth')

// SIGN-UP
router.post("/sign-up", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const existingEmail = await userModal.findOne({ email: email });
    if (existingEmail) {
      res.status(400).json({ message: "Email already exists" });
    }

    if (password.length <= 5) {
      res
        .status(400)
        .json({ message: "Password length should be greater than 5" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModal({
      name: name,
      email: email,
      password: hashPassword,
      address: address,
    });
    await newUser.save();
    return res.status(200).json({ message: "SignUp Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingEmail = await userModal.findOne({ email });
    if (!existingEmail) {
      res.status(400).json({ message: "Email and Password are incorrect" });
    }

     bcrypt.compare(password, existingEmail.password, (err, data) => {
      if (data) {
        authClaims = [{email:existingEmail.email},{role:existingEmail.role}]
        const token = jwt.sign({authClaims}, "bookStore001",{expiresIn:"30d"})
        res.status(200).json({ id: existingEmail._id,role:existingEmail.role,token:token});
      } else {
        res.status(400).json({ message: "Email and Password are incorrect" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get usesr information
router.get('/get-user-info',authenticateToken, async (req,res) => {
  try {
    const {id} = req.headers;
    const data = await userModal.findById({_id:id}).select('-password');
    return res.status(200).json(data)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


// Update user Address
router.put('/update-address', authenticateToken, async (req,res) => {
  try {
    const {id} = req.headers;
    const {address} = req.body;
    await userModal.findByIdAndUpdate(id,{address:address})
    return res.status(200).json({message:"Address updated successfully"})
  } catch (error) {
    res.status(500).json({message:error.message}) 
  }
})


module.exports = router;
