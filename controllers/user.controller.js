const User = require("../models/User");
const { createUserService, findUserByEmail, deleteUserByIdService, updateProfileService, updatePasswordService } = require("../services/user.service");
const { generateToken } = require("../utils/token");


// create a new user 
exports.createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body);
        // console.log(user)

        res.status(200).json({
            status: 'success',
            message: 'Successfully created User'
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message
        })
    }

}

// get all users from DB 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})

        res.status(200).json({
            status: 'success',
            data: users
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: 'Internal Server Error',
        })
    }
}


//update user Profile
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const info = req.body;

        const result = await updateProfileService(id, info);
        // console.log(req.body)

        res.status(200).json({
            status: 'Success',
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message,
        })
    }
}

// update user password 
exports.updatePassword = async (req, res) => {
    try {
        const { email } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        //compare new passwords
        if (newPassword != confirmPassword) {
            return res.status(500).json({
                status: 'failed',
                message: "New password didn't match"
            })
        }

        const user = await findUserByEmail(email)

        const isPasswordMatched = user.comparePassword(currentPassword, user.password);
        if (!isPasswordMatched) {
            return res.status(500).json({
                status: 'failed',
                message: "Current password is wrong"
            })
        }

        const result = await updatePasswordService(email, req.body.newPassword);
        console.log(result);

        return res.status(200).json({
            status: 'success',
            data: result
        })

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        })
    }
}

//delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteUserByIdService(id)

        res.status(200).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: 'Internal Server Error',
        })
    }
}


// user login 
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                status: 'fail',
                error: 'please provide email and password'
            })
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                error: 'No user found'
            })
        }

        const isPasswordMatched = user.comparePassword(password, user.password);

        if (!isPasswordMatched) {
            return res.status(403).json({
                status: 'fail',
                error: 'Password is not correct'
            })
        }

        const token = generateToken(user);
        const { password: pwd, ...others } = user.toObject();

        res.status(200).json({
            status: 'success',
            message: 'Successfully logged in',
            data: {
                user: others,
                token
            }
        })

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: 'Internal server error ',
        })
    }

}


// get logged in user 
exports.getLoggedInUser = async (req, res) => {
    try {

        const user = await findUserByEmail(req.user?.email);

        const { password, ...others } = user.toObject();

        res.status(200).json({
            status: 'success',
            user: others
        })
    } catch (error) {
        res.status(403).json({
            status: 'failed',
            error: 'Invalid Token',
        })
    }
}