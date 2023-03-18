const User = require("../models/User")
const bcrypt = require('bcryptjs');


//create a new user
exports.createUserService = async (userInfo) => {

    const user = await User.create(userInfo);
    return user;
}


// find a user by email 
exports.findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user
}


// update user profile 
exports.updateProfileService = async (id, updatedData) => {
    console.log(id, updatedData);
    const result = await User.updateOne({ _id: id }, { $set: updatedData })
    // console.log(result);
    return result;
}

//update user password
exports.updatePasswordService = async (email, newPassword) => {
    const hashedPassword = bcrypt.hashSync(newPassword);
    const result = await User.updateOne({ email }, { $set: { password: hashedPassword } })
    console.log(result);
    return result;

    // console.log(email, currentPassword, newPassword, confirmPassword);
}

//delete a user
exports.deleteUserByIdService = async (id) => {
    // console.log(id)
    const result = await User.deleteOne({ _id: id })
    return result;
}