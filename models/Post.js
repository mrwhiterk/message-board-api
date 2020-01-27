const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const moment = require('moment')

let PostSchema = new Schema(
  {
    text: {
      type: String,
      required: 'Text is required'
    },
    photo: {
      type: String,
      default: ''
    },
    likes: [
      {
        type: Schema.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        text: String,
        created: {
          type: String,
          default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
        },
        postedBy: {
          type: Schema.ObjectId,
          ref: 'User'
        }
      }
    ],
    postedBy: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    created: {
      type: String,
      default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
  },
  {
    timestamps: true
  }
)

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
