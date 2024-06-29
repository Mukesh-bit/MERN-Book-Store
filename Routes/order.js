const router = require("express").Router();
const userModal = require("../modals/user");
const {authenticateToken} = require('./userAuth')
const bookModal = require('../modals/books')
const orderModal = require('../modals/orders')

//Place Orders
router.post('/place-order', authenticateToken, async (req,res) => {
  try {
    const {id} = req.headers;
    const {order} = req.body;
    for(const orderData of order){
      const newOrder = new orderModal({user:id, book: orderData._id})
      const orderDatafromDb = await newOrder.save();

      await userModal.findByIdAndUpdate(id,{$push:{orders:orderDatafromDb._id},})
      await userModal.findByIdAndUpdate(id,{$pull:{cart:orderData._id},})
      
    }
    return res.json({status:"Success",message:"Order Placed successfully"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


// Get order history of particular user
router.get('/get-order-history', authenticateToken, async (req,res) => {
  try {
    const {id} = req.headers;
    const userData = await userModal.findById(id).populate({path:"orders",populate:{path:"book"}})

    const ordersData = userData.orders.reverse();

    return res.json({status:"success",data:ordersData})
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})


// Get all orders  --ADMIN
router.get('/get-all-orders', authenticateToken, async (req,res) => {
  try {
    const user = await orderModal.find().populate({path:"book"}).populate({path:"user"}).sort({createdAt:-1})

    return res.json({status:"success",data:user})
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})


// Update order --ADMIN
router.put('/update-status/:id', authenticateToken, async (req,res) => {
  try {
    const {id} = req.params;
    await orderModal.findByIdAndUpdate(id, {status: req.body.status})

    return res.json({status:"success",message:"Status updated successfully"})
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})

module.exports = router;