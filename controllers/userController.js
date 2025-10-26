const userSchema = require('../models/userSchema')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')
const reqPlatform = require('../services/reqPlatform')
const getAllData = (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        reqPlatform({
            status: 405,
            req: req, res: res, path: '../views/auth/login', body: { message: "Unauthorized" }
        });
    }
    // If you need to send the token as a header to the client, you can set it in the response headers.
    // For example, if you have a token (e.g., refreshToken), you can do:

    userSchema.find().select('-password').lean()
        .then((result) => {

            reqPlatform({
                req: req, res: res, path: '../views/home', body: { myTitle: 'Home Page', data: result, moment: moment, user: req.session.user }
            });

        })
        .catch((err) => {
            console.log('Error fetching data', err)
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error fetching data from database ${err}` }
            });
        })



}
const getUserById = (req, res) => {
    const id = req.params.id

    userSchema.findById({ _id: id })
        .then((result) => {

            reqPlatform({
                req: req, res: res, path: '../views/user/view', body: { myTitle: 'View User', data: result, moment: moment }
            });

        })
        .catch((err) => {
            console.log('Error fetching data', err)
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error fetching data from database ${err}` }
            });
        })
}

const addUserView = (req, res) => { // Add page
    reqPlatform({
        req: req, res: res, path: '../views/user/add', body: { user: req.session.user }
    });
}
const addUser = (req, res) => async (req, res) => {
    const { email, role, phone, name, gender, country, age } = req.body
    const profilePicture = req.file;
    const hashedPassword = await bcrypt.hash('1234567890', 10);
    const newUser = {
        name: name,
        email: email,
        role: role,
        phone: phone,
        country: country,
        gender: gender,
        age: age,
        password: hashedPassword,
        profilePicture: profilePicture ? `${req.protocol}://${req.get('host')}/uploads/${profilePicture.filename}` : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: slugify(name)
    };

    userSchema.create(newUser)
        .then((result) => {
            reqPlatform({
                req: req, res: res, path: '../views/user/update', body: { message: "Data updated successfully", data: result, user: req.session.user }
            });

            reqPlatform({
                req: req, res: res, path: '../views/user/update', body: { message: "Data saved successfully", data: result, user: req.session.user }
            });

        })
        .catch((err) => {
            console.error('Error saving data:', err)
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error saving data to database ${err}` }
            });
        })
}
const updateUser = (req, res) => {
    const id = req.params.id

    userSchema.findByIdAndUpdate({ _id: id }, req.body)
        .then((result) => {

            reqPlatform({
                req: req, res: res, path: '../views/success.ejs', body: { message: "Data updated successfully", data: result }
            });
        }).catch((err) => {
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error updating data to database ${err}` }
            });
        })
}
const deleteUser = (req, res) => {

    const id = req.params.id
    userSchema.findByIdAndDelete({ _id: id })
        .then(() => {
            reqPlatform({
                req: req, res: res, path: '../views/success.ejs', body: { message: "Data deleted successfully" }
            });
        })
        .catch((err) => {
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error deleting data from database, user not found ${err}` }
            });
        })
}
const searchUserView = (req, res) => {
    reqPlatform({
        req: req, res: res, path: '../views/user/search', body: { myTitle: 'Search User', moment: moment, data: [] }
    });
}
const searchUser = (req, res) => {
    const value = req.body.value.toString().trim()
    userSchema.find({
        $or: [{ name: value }, { email: value }, { age: { $gt: value } }]
    })
        .then((result) => {

            reqPlatform({
                req: req, res: res, path: '../views/user/search', body: { myTitle: 'Search User', moment: moment, data: result }
            });
        })
        .catch((err) => {
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error fetching data from database ${err}` }
            });
        })
}
const editUserView = (req, res) => {
    reqPlatform({
        req: req, res: res, path: '../views/user/edit', body: { myTitle: 'Edit User', data: [] }
    });
}
const editUser = (req, res) => {
    const id = req.params.id
    userSchema.findById(id)
        .then((result) => {
            reqPlatform({
                req: req, res: res, path: '../views/user/edit', body: { myTitle: 'Edit User', data: result }
            });
        })
        .catch((err) => {
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error fetching data from database ${err}` }
            });
        })
}
const viewHome = (req, res) => { // View page
    userSchema.find().select('-password').lean()
        .then((result) => {
            reqPlatform({
                req: req, res: res, path: '../views/home', body: { myTitle: 'Home Page', data: result, moment: moment }
            });
        })
        .catch((err) => {
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error fetching data from database ${err}` }
            });
        })

}
const profile = (req, res) => {
    userSchema.findById({ _id: req.session.user.id })
        .then((result) => {
            reqPlatform({
                req: req, res: res, path: '../views/auth/my-profile', body: { myTitle: 'Profile', user: result, moment: moment, message: req.query.message }
            });
        })
        .catch((err) => {
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error fetching data from database ${err}` }
            });
        })
}
const editProfileView = (req, res) => {
    userSchema.findById({ _id: req.session.user.id })
        .then((result) => {

            reqPlatform({
                req: req, res: res, path: '../views/auth/edit-profile', body: { myTitle: 'Edit Profile', user: result, moment: moment }
            });
        })
        .catch((err) => {
            reqPlatform({
                status: 400,
                req: req, res: res, path: '../views/error', body: { message: `Error fetching data from database ${err}` }
            });
        })
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const updateData = { ...req.body };

        // Handle file upload for profile picture
        if (req.file) {
            updateData.profilePicture = req.file.path;
        }

        // Remove empty fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === '' || updateData[key] === 'Not specified') {
                delete updateData[key];
            }
        });

        const updatedUser = await userSchema.findByIdAndUpdate(
            { _id: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            reqPlatform({
                status: 404,
                req: req, res: res, path: '../views/auth/edit-profile', body: { myTitle: 'Edit Profile', user: req.session.user, message: 'User not found' }
            });
        }

        // Update session with new user data
        req.session.user = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            age: updatedUser.age,
            country: updatedUser.country,
            gender: updatedUser.gender,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            isActive: updatedUser.isActive,
            slug: updatedUser.slug,
            createdAt: updatedUser.createdAt
        };

        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({
                message: "Profile updated successfully",
                user: req.session.user,
            });
        }
        else return res.redirect('/user/profile?message=Profile updated successfully! ✅');

    } catch (error) {
        console.error('Error updating profile:', error);
        reqPlatform({
            status: 400,
            req: req, res: res, path: '../views/auth/edit-profile', body: { myTitle: 'Edit Profile', user: req.session.user, message: 'Error updating profile. Please try again.' }
        });
    }
}

const settingsView = (req, res) => {
    reqPlatform({
        req: req, res: res, path: '../views/settings', body: { myTitle: 'Settings', user: req.session.user, message: req.query.message, error: req.query.error }
    });
}


// Update profile picture
const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.session.user.id;

        if (!req.file) {
            reqPlatform({
                req: req, res: res, path: '../views/settings', body: {
                    title: 'Settings',
                    user: req.session.user,
                    message: req.query.message,
                    error: req.query.error
                }
            });
        }


        const updatedUser = await userSchema.findByIdAndUpdate(
            { _id: userId },
            { profilePicture: req.file.path },
            { new: true }
        );

        if (!updatedUser) {
            reqPlatform({
                req: req, res: res, path: '../views/settings', body: {
                    title: 'Settings',
                    user: req.session.user,
                    message: req.query.message,
                    error: req.query.error
                }
            });
        }

        // Update session
        req.session.user.profilePicture = updatedUser.profilePicture;

        res.json({ success: true, message: 'Profile picture updated successfully' });
    } catch (error) {
        reqPlatform({
            status: 400,
            req: req, res: res, path: '../views/settings', body: {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            }
        });
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            reqPlatform({
                req: req, res: res, path: '../views/settings', body: {
                    title: 'Settings',
                    user: req.session.user,
                    message: req.query.message,
                    error: req.query.error
                }
            });
        }

        const user = await userSchema.findById(userId);
        if (!user) {
            reqPlatform({
                status: 404,
                req: req, res: res, path: '../views/settings', body: {
                    title: 'Settings',
                    user: req.session.user,
                    message: req.query.message,
                    error: req.query.error
                }
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            reqPlatform({
                req: req, res: res, path: '../views/settings', body: {
                    title: 'Settings',
                    user: req.session.user,
                    message: req.query.message,
                    error: req.query.error
                }
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await userSchema.findByIdAndUpdate(
            { _id: userId },
            { password: hashedNewPassword }
        );

        reqPlatform({
            req: req, res: res, path: '../views/settings', body: {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            }
        });
    } catch (error) {
        reqPlatform({
            status: 400,
            req: req, res: res, path: '../views/settings', body: {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            }
        });
    }
}

// Delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const deletedUser = await userSchema.findByIdAndDelete(userId);
        if (!deletedUser) {
            reqPlatform({
                req: req, res: res, path: '../views/settings', body: {
                    title: 'Settings',
                    user: req.session.user,
                    message: req.query.message,
                    error: req.query.error
                }
            });
        }

        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
        });

        reqPlatform({
            req: req, res: res, path: '../views/settings', body: {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            }
        });

    } catch (error) {
        console.error('Error deleting account:', error);
        reqPlatform({
            status: 400,
            req: req, res: res, path: '../views/error', body: {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            }
        });
    }
}
// Export user data
const exportData = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await userSchema.findById(userId).select('-password');

        if (!user) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(404).json({ success: false, message: 'exportData not found' });
            }
            else return res.render('../views/error.ejs', {
                title: 'Error',
                message: 'exportData not found'
            });
        }

        const exportData = {
            personalInfo: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                age: user.age,
                gender: user.gender,
                country: user.country,
                profilePicture: user.profilePicture,
                role: user.role,
                isActive: user.isActive,
                slug: user.slug,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            settings: user.settings || {},
            exportDate: new Date().toISOString()
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="my-profile-data-export.json"');
        res.json(exportData);
    } catch (error) {
        console.error('Error exporting data:', error);
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ success: false, message: 'Error exporting data' });
        }
        else return res.render('../views/error.ejs', {
            title: 'Error',
            message: 'Error exporting data'
        });
    }
}

module.exports = {
    profile, viewHome, getAllData, addUser, deleteUser, editUser, getUserById, addUserView, updateUser,
    searchUser, editUserView, profile, editProfileView, updateProfile, settingsView,
    updateProfilePicture, changePassword, deleteAccount, exportData, searchUserView
}