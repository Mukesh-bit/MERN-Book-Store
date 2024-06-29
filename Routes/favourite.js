const router = require("express").Router();
const userModal = require("../modals/user");
const { authenticateToken } = require("./userAuth");

// ADD BOOKS TO FAV
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const user = await userModal.findById(id);
    const isBookFav = user.fav.includes(bookid);
    if (isBookFav) {
      return res
        .status(200)
        .json({ message: "book is already in Favourite..!" });
    } else {
      await userModal.findByIdAndUpdate(id, { $push: { fav: bookid } });
      return res.status(200).json({ message: "book is added in Favourite" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REMOVE BOOKS FROM FAV
router.put(
  "/remove-book-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const user = await userModal.findById(id);
      const isBookFav = user.fav.includes(bookid);
      if (isBookFav) {
        await userModal.findByIdAndUpdate(id, { $pull: { fav: bookid } });
        return res
        .status(200)
        .json({ message: "book is removed from Favourite" });
      }

     
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET FAVOURITE BOOKS OF A PARTICULAR USER
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await userModal.findById(id).populate("fav");
    const favBooks = user.fav;
    return res.status(200).json({ status: "success", data: favBooks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
