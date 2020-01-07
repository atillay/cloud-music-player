const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soundSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'googleId required'],
  },
  googleId: {
    type: String,
    required: [true, 'googleId required'],
    unique: [true, 'googleId already exists']
  },
  title: {
      type: String,
      required: [true, 'title required'],
  },
  artist: {
    type: String,
  },
  genre: {
    type: String,
  },
  duration: {
    type: mongoose.Decimal128,
  },
  bpm: {
    type: Number,
  },
  key: {
    type: String,
  },
  year: {
    type: Number,
  },
});

soundSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.duration) {
      ret.duration = parseFloat(ret.duration.toString());
    }
    return ret;
  }
});

module.exports = mongoose.model('Sound', soundSchema);
