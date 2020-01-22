const mongoose = require('mongoose')
const moment = require('moment')
const now = moment()
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

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
          default: now.format('dddd, MMMM Do YYYY, h:mm:ss a')
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
      default: now.format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
  },
  {
    timestamps: true
  }
)

const Post = mongoose.model('Post', PostSchema)

module.exports = Post

