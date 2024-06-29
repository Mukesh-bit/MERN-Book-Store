const mongoose = require('mongoose')

const con = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URI}`).then(() => console.log("Databse Connected"))
    
  } catch (error) {
    console.log(error)
  }
}

con()