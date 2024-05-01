import mongoose from 'mongoose';

// regexp taken from https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email is required'],
            match: [emailRegExp, 'Email is invalid'],
            unique: true,
        },
    },
    { timestamps: true },
);

// index to support sorting in getAllUsers, index works for sorting in either direction
userSchema.index({ createdAt: 1 });

const User = mongoose.model('User', userSchema);

export default User;
