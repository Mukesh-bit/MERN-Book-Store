const router = require("express").Router();
const userModal = require("../modals/user");
const bookModal = require("../modals/books");
const {authenticateToken} = require('./userAuth')

router.post('/add-books', authenticateToken, async (req,res) => {
  try {
    const {id} = req.headers;
    const user = await userModal.findById(id);
    if(user.role !== "admin"){
      return  res.status(400).json({ message: "only admin have right to change" });
    }

    const books = new bookModal({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    })

    await books.save();
    res.status(200).json({ message: "Books added successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})

// UPDATE-BOOKS
router.put('/update-book', authenticateToken, async (req,res) => {
  try {
    const {bookid} = req.headers;
    await bookModal.findByIdAndUpdate(bookid,{
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    })

      return  res.status(200).json({ message:"books updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})

// DELETE-BOOK
router.delete('/delete-book', authenticateToken, async (req,res) => {
  try {
    const {bookid} = req.headers;
    await bookModal.findByIdAndDelete(bookid)

      return  res.status(200).json({ message:"books deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})

// GET-ALL-BOOKS
router.get('/get-all-books', async (req,res) => {
  try {
    const books = await bookModal.find().sort({createdAt: -1});
    return  res.status(200).json({ status: "Success", data: books });

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})


// GET-ALL-BOOKS
router.get('/get-recent-books', async (req,res) => {
  try {
    const books = await bookModal.find().sort({createdAt: -1}).limit(4);
    return  res.status(200).json({ status: "Success", data: books });

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})


// GET-BOOK-BY-ID
router.get('/get-book-by-id/:id', async (req,res) => {
  try {
    const {id} = req.params;
    const book = await bookModal.findById(id);
    return  res.status(200).json({ status: "Success", data: book });

  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
})


module.exports = router;