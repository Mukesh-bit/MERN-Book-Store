const router = require("express").Router();
const userModal = require("../modals/user");
const {authenticateToken} = require('./userAuth')


// Add to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const user = await userModal.findById(id);
    const isBook = user.cart.includes(bookid);
    if (isBook) {
        return res.status(200).json({ message: "book is already in Cart..!" });
    } else {
      await userModal.findByIdAndUpdate(id, { $push: { cart: bookid } });
      return res.status(200).json({ message: "book is added in Cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Remove from cart
router.put('/remove-from-cart/:bookId', authenticateToken, async (req,res) => {
  try {
    const {bookId} = req.params;
    const {id} = req.headers;

    await userModal.findByIdAndUpdate(id,{$pull:{cart:bookId}})
    return res.status(200).json({message:"Book removed form cart"})

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})


//Get cart of a particular user
router.get('/get-user-cart', authenticateToken, async (req,res) => {
  try {
    const {id} = req.headers;
    const user = await userModal.findById(id).populate('cart');
    const cart = user.cart.reverse();

    return res.status(200).json({ status:"success",data:cart });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})

module.exports = router;