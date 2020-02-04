const User = require('../models/User')
const dbErrorMessage = require('../helpers/dbErrorMessage')
// const authHelper = require('../helpers/auth')
const { checkDuplicateEntry } = require('../helpers')

const getUsers = async (req, res) => {
  try {
    let users = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.following }
    })

    res.send(users)
  } catch (error) {
    res.status(400).send(error)
  }
}

const getUserProfileById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
      .populate('following', '_id username')
      .populate('followers', '_id username')
      .exec()

    res.send(user)
  } catch (error) {
    res.send(error)
  }
}

const getUserFollowerAndFollowing = async (req, res) => {
  try {
    let { following, followers } = await req.user
      .populate('following', '_id username')
      .populate('followers', '_id username')
      .execPopulate()

    res.send({
      following: following,
      followers: followers
    })
  } catch (error) {
    res.send(error)
  }
}

const followUser = async (req, res) => {
  try {
    let { leaderId } = req.body
    let leader = await User.findById(leaderId)

    if (!leader.followers.includes(req.user._id)) {
      leader.followers.push(req.user._id)
    }

    if (!req.user.following.includes(leaderId)) {
      req.user.following.push(leaderId)
    }

    await leader.save()
    await req.user.save()

    leader = await leader
      .populate('following', '_id username')
      .populate('followers', '_id username')
      .execPopulate()

    res.send({ leader, follower: req.user })
  } catch (error) {
    res.status(400).send(error)
  }
}
const unfollowUser = async (req, res) => {
  try {
    let { leaderId } = req.body
    let leader = await User.findById(leaderId)

    if (leader.followers.includes(req.user._id)) {
      leader.followers.pull(req.user._id)
    }

    if (req.user.following.includes(leaderId)) {
      req.user.following.pull(leaderId)
    }

    await leader.save()
    await req.user.save()

    leader = await leader
      .populate('following', '_id username')
      .populate('followers', '_id username')
      .execPopulate()

    res.send({ leader, follower: req.user })
  } catch (error) {
    res.status(400).send(error)
  }
}

// I need to find out why mongoose unique field check doesn't always work
const signup = async (req, res) => {
  try {
    let duplicateMessage = await checkDuplicateEntry(req, res)
    if (duplicateMessage) {
      return res.status(400).json({
        message: duplicateMessage
      })
    }

    let user = await new User(req.body)
    await user.save()

    res.send()
  } catch (err) {
    res.status(400).json({
      message: dbErrorMessage(err)
    })
  }
}

const signin = async ({ body: { username, password } }, res) => {
  try {
    const user = await User.comparePassword(username, password)
    const token = await user.generateAuthToken()

    res.send({
      token
    })
  } catch (err) {
    res.status(400).send({
      message: err
    })
  }
}

module.exports = {
  getUsers,
  signup,
  signin,
  followUser,
  unfollowUser,
  getUserFollowerAndFollowing,
  getUserProfileById
}
