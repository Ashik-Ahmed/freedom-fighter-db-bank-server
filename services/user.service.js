const User = require("../models/User")


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


//delete a user
exports.deleteUserByIdService = async (id) => {
    // console.log(id)
    const result = await User.deleteOne({ _id: id })
    return result;
}