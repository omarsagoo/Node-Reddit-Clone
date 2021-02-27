const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    password: { type: String, select: false },
    username: { type: String, required: true },
    posts : [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
},
    { timestamps: { createdAt: 'created_at' } }
)

// Must use function here! ES6 => functions do not bind this!
UserSchema.pre("save", function (next) {
    // ENCRYPT PASSWORD
    const user = this
    if (!user.isModified("password")) {
        return next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            next()
        })
    })
})

// Need to use function to enable this.password to work.
UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch)
    })
}

// Need to use function to enable this.password to work.
UserSchema.methods.updatePassword = function (password, done) {
    // update the password and save.
    // password will be hashed automatically on the save function
    this.password = password
    this.save()

    done(true)
}

module.exports = mongoose.model("User", UserSchema)