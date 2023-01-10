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


// update user role 
exports.updateProfileService = async (id, info) => {
    // console.log(id, info);
    const result = await User.updateOne({ _id: id }, { $set: info })
    return result;
}

//delete a user
exports.deleteUserByIdService = async (id) => {
    // console.log(id)
    const result = await User.deleteOne({ _id: id })
    return result;
}