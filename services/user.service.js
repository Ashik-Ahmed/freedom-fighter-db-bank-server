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
exports.updateRoleService = async (id, role) => {
    // console.log(id, role);
    const result = await User.updateOne({ _id: id }, { $set: { role } })
    console.log(result);
    return result;
}

//delete a user
exports.deleteUserByIdService = async (id) => {
    // console.log(id)
    const result = await User.deleteOne({ _id: id })
    return result;
}