const mongoose = require('mongoose');

(async () => {
  try {
    let result = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })

    console.log('db connected')
  } catch (err) {
    console.log(err)
  }
})()

module.exports = mongoose
