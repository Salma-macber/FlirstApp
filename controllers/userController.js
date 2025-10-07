const userSchema = require('../models/userSchema')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')

const getAllData = (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(401).json({ message: "Unauthorized" });
        }
        else return res.render('../views/auth/login');
    }
    // If you need to send the token as a header to the client, you can set it in the response headers.
    // For example, if you have a token (e.g., refreshToken), you can do:

    userSchema.find().select('-password').lean()
        .then((result) => {

            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data fetched successfully",
                    data: result
                });
            }
            else return res.render('../views/home', { myTitle: 'Home Page', data: result, moment: moment, user: req.session.user });

        })
        .catch((err) => {
            console.log('Error fetching data', err)
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(500).json({ message: "Error fetching data from database" });
            }
            else return res.render('../views/error', { message: "Error fetching data from database" });
        })

}
const getUserById = (req, res) => {
    const id = req.params.id

    userSchema.findById({ _id: id })
        .then((result) => {

            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data fetched successfully",
                    data: result
                });
            }
            else return res.render('user/view', { myTitle: 'View User', data: result, moment: moment });
        })
}

const addUserView = (req, res) => { // Add page
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({
            message: "Add page",
            user: req.session.user
        });
    }
    else return res.render('user/add', { user: req.session.user });
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
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data saved successfully",
                    data: result,
                    user: req.session.user
                });
            }
            else return res.redirect('/success');
        })
        .catch((err) => {
            console.error('Error saving data:', err)
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(500).json({ message: "Error saving data to database" });
            }
            else return res.render('../views/error', { message: "Error saving data to database" });
        })
}
const updateUser = (req, res) => {
    const id = req.params.id

    userSchema.findByIdAndUpdate({ _id: id }, req.body)
        .then((result) => {

            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data updated successfully",
                    data: result
                });
            }
            else return res.redirect('/success', { message: "Data updated successfully" });
        }).catch((err) => {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(500).json({ message: "Error updating data to database" });
            }
            else return res.render('../views/error', { message: "Error updating data to database" });
        })
}
const deleteUser = (req, res) => {

    const id = req.params.id
    userSchema.findByIdAndDelete({ _id: id })
        .then(() => {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data deleted successfully",
                })
            }
            else return res.redirect('/', { message: "Data updated successfully" });
        })
        .catch((err) => {
            console.error('Error deleting data:', err)
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(404).json({ message: "Error deleting data from database, user not found" });
            }
            else return res.render('../views/error', { message: "Error deleting data from database, user not found" });
        })
}
const searchUserView = (req, res) => {
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({
            message: "Search page",
            data: []
        });
    }
    else return res.render('../views/user/search', { myTitle: 'Search User', moment: moment, data: [] });
}
const searchUser = (req, res) => {
    const value = req.body.value.toString().trim()
    userSchema.find({
        $or: [{ name: value }, { email: value }, { age: { $gt: value } }]
    })
        .then((result) => {

            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data fetched successfully",
                    data: result
                });
            }
            else return res.render('../views/user/search', { myTitle: 'Search User', data: result, moment: moment });
        })
        .catch((err) => {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(500).json({ message: "Error fetching data from database" });
            }
            else return res.render('../views/error', { message: "Error fetching data from database" });
        })
}
const editUserView = (req, res) => {
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({
            message: "Edit page",
            data: []
        });
    }
    else return res.render('../views/user/edit', { myTitle: 'Edit User' });
}
const editUser = (req, res) => {
    const id = req.params.id
    userSchema.findById(id)
        .then((result) => {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data fetched successfully",
                    data: result
                });
            }
            else return res.render('../views/user/edit', { myTitle: 'Edit User', data: result, });
        })
}
const viewHome = (req, res) => { // View page
    userSchema.find().select('-password').lean()
        .then((result) => {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data fetched successfully",
                    data: result
                });
            }
            else return res.render('../views/home', { myTitle: 'Home Page', data: result, moment: moment });
        })
        .catch((err) => {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(500).json({ message: "Error fetching data from database" });
            }
            else return res.render('../views/error', { message: "Error fetching data from database" });
        })

}
const profile = (req, res) => {
    userSchema.findById({ _id: req.session.user.id })
        .then((result) => {

            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data fetched successfully",
                    data: result
                });
            }
            else return res.render('../views/auth/my-profile', {
                myTitle: 'Profile',
                user: result,
                moment: moment,
                message: req.query.message
            });
        })
}
const editProfileView = (req, res) => {
    userSchema.findById({ _id: req.session.user.id })
        .then((result) => {

            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Data fetched successfully",
                    data: result
                });
            }
            else return res.render('../views/auth/edit-profile', { myTitle: 'Edit Profile', user: result, moment: moment });
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
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(404).json({
                    message: "User not found",
                    user: req.session.user,
                });
            }
            else return res.render('../views/auth/edit-profile', {
                myTitle: 'Edit Profile',
                user: req.session.user,
                message: 'User not found'
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
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({
                message: "Error updating profile",
                user: req.session.user,
            });
        }
        else return res.render('../views/auth/edit-profile', {
            myTitle: 'Edit Profile',
            user: req.session.user,
            message: 'Error updating profile. Please try again.'
        });
    }
}
const settingsView = (req, res) => {
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({
            message: "Settings page",
            user: req.session.user
        });
    }
    else return res.render('../views/settings', {
        title: 'Settings',
        user: req.session.user,
        message: req.query.message,
        error: req.query.error
    })
}


// Update profile picture
const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.session.user.id;

        if (!req.file) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            else return res.render('../views/settings', {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            });
        }

        const updatedUser = await userSchema.findByIdAndUpdate(
            { _id: userId },
            { profilePicture: req.file.path },
            { new: true }
        );

        if (!updatedUser) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            else return res.render('../views/settings', {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            });
        }

        // Update session
        req.session.user.profilePicture = updatedUser.profilePicture;

        res.json({ success: true, message: 'Profile picture updated successfully' });
    } catch (error) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ success: false, message: 'Error updating profile picture' });
        }
        else return res.render('../views/settings', {
            title: 'Settings',
            user: req.session.user,
            message: req.query.message,
            error: req.query.error
        });
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ success: false, message: 'New passwords do not match' });
            }
            else return res.render('../views/settings', {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            });
        }

        const user = await userSchema.findById(userId);
        if (!user) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            else return res.render('../views/settings', {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }
            else return res.render('../views/settings', {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
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

        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({ success: true, message: 'Password changed successfully' });
        }
        else return res.render('../views/settings', {
            title: 'Settings',
            user: req.session.user,
            message: req.query.message,
            error: req.query.error
        });
    } catch (error) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ success: false, message: 'Error changing password' });
        }
        else return res.render('../views/settings', {
            title: 'Settings',
            user: req.session.user,
            message: req.query.message,
            error: req.query.error
        });
    }
}

// Delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const deletedUser = await userSchema.findByIdAndDelete(userId);
        if (!deletedUser) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            else return res.render('../views/settings', {
                title: 'Settings',
                user: req.session.user,
                message: req.query.message,
                error: req.query.error
            });
        }

        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
        });

        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({ success: true, message: 'Account deleted successfully' });
        }
        else return res.render('../views/settings', {
            title: 'Settings',
            user: req.session.user,
            message: req.query.message,
            error: req.query.error
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ success: false, message: 'Error deleting account' });
        }
        else return res.render('../views/error.ejs', {
            title: 'Error',
            message: 'Error deleting account'
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