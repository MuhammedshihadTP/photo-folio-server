const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  });
  const Image = mongoose.model('Image', imageSchema);
  module.exports=Image