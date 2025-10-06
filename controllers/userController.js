const userSchema = require('../models/userSchema')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')

const getAllData = (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) res.render('../views/auth/login');
    // If you need to send the token as a header to the client, you can set it in the response headers.
    // For example, if you have a token (e.g., refreshToken), you can do:

    userSchema.find().select('-password').lean()
        .then((result) => {
            console.log(result)
            // res.status(200).json({
            //     message: "Data fetched successfully",
            //     data: result
            // })
            res.render('../views/home', { myTitle: 'Home Page', data: result, moment: moment, user: req.session.user })

            // res.render('home', { myTitle: 'Home Page', data: result, moment: moment }) // Render the home page
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })

}
const getUserById = (req, res) => {
    const id = req.params.id

    userSchema.findById({ _id: id })
        .then((result) => {
            // res.status(200).json({
            //     message: "Data fetched successfully",
            //     data: result
            // })
            res.render('user/view', { myTitle: 'View User', data: result, moment: moment })
        })
}

const addUserView = (req, res) => { // Add page
    console.log('Add page')
    console.log('req.user ', req.user)
    res.render('user/add', { user: req.session.user })
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
            console.log('Data saved successfully')
            res.status(200).json({
                message: "Data saved successfully",
                data: result,
                user: req.session.user
            })
            // res.redirect('/success') // Redirect back to home page after successful save
        })
        .catch((err) => {
            console.error('Error saving data:', err)
            res.status(500).send('Error saving data to database')
        })
}
const updateUser = (req, res) => {
    const id = req.params.id

    userSchema.findByIdAndUpdate({ _id: id }, req.body)
        .then((result) => {
            console.log('Data updated successfully')
            res.status(200).json({
                message: "Data updated successfully",
                oldData: result
            })

            // res.redirect('/success') // Redirect back to home page after successful update
        }).catch((err) => {
            console.error('Error updating data:', err.message)
            // res.status(500).send('Error updating data to database', err.message)
            res.redirect('/error', { message: err.message })
        })
}
const deleteUser = (req, res) => {
    console.log('Data deleted successfully')

    const id = req.params.id
    userSchema.findByIdAndDelete({ _id: id })
        .then(() => {
            console.log('Data deleted successfully')
            res.status(200).json({
                message: "Data deleted successfully",
            })
            // res.redirect('/') // Redirect back to home page after successful save
        })
        .catch((err) => {
            console.error('Error deleting data:', err)
            res.status(404).send('Error deleting data from database, user not found')
            // res.status(500).send('Error deleting data from database')
        })
    // res.render('user/delete', { myTitle: 'Delete User' })
    // res.redirect('/success') // Redirect back to home page after successful save
}
const searchUser = (req, res) => {
    const value = req.body.value.trim()
    userSchema.find({
        // userAge: value
        // userAge: {$gt: value }
        $or: [{ name: value }, { email: value }]
    })
        .then((result) => {
            console.log('Data fetched successfully', result)
            // res.render('user/search', { myTitle: 'Search User', data: result, moment: moment })
            res.status(200).json({
                message: "Data fetched successfully",
                data: result
            })
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })
}
const editUserView = (req, res) => {
    res.render('user/edit', { myTitle: 'Edit User' })
}
const editUser = (req, res) => {
    const id = req.params.id
    userSchema.findById(id)
        .then((result) => {
            res.render('user/edit', { myTitle: 'Edit User', data: result, })
        })
}
const viewHome = (req, res) => { // View page
    console.log('View page')
    userSchema.find().select('-password').lean()
        .then((result) => {
            console.log(result)
            res.status(200).json({
                message: "Data fetched successfully",
                data: result
            })
            // res.render('home', { myTitle: 'Home Page', data: result, moment: moment }) // Render the home page
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })

    // res.render('user/view', { myTitle: 'View User' })
}
const profile = (req, res) => {
    userSchema.findById({ _id: req.session.user.id })
        .then((result) => {
            // res.status(200).json({
            //     message: "Data fetched successfully",
            //     data: result
            // })
            res.render('../views/auth/my-profile', {
                myTitle: 'Profile',
                user: result,
                moment: moment,
                message: req.query.message
            })
        })
}
const editProfileView = (req, res) => {
    userSchema.findById({ _id: req.session.user.id })
        .then((result) => {
            // res.status(200).json({
            //     message: "Data fetched successfully",
            //     data: result
            // })
            res.render('../views/auth/edit-profile', { myTitle: 'Edit Profile', user: result, moment: moment })
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
            return res.render('../views/auth/edit-profile', {
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

        res.redirect('/user/profile?message=Profile updated successfully! ✅');

    } catch (error) {
        console.error('Error updating profile:', error);
        res.render('../views/auth/edit-profile', {
            myTitle: 'Edit Profile',
            user: req.session.user,
            message: 'Error updating profile. Please try again.'
        });
    }
}
const settingsView = (req, res) => {
    res.render('../views/settings', {
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
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const updatedUser = await userSchema.findByIdAndUpdate(
            { _id: userId },
            { profilePicture: req.file.path },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update session
        req.session.user.profilePicture = updatedUser.profilePicture;

        res.json({ success: true, message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ success: false, message: 'Error updating profile picture' });
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        }

        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await userSchema.findByIdAndUpdate(
            { _id: userId },
            { password: hashedNewPassword }
        );

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Error changing password' });
    }
}

// Delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const deletedUser = await userSchema.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
        });

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ success: false, message: 'Error deleting account' });
    }
}

// Export user data
const exportData = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await userSchema.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
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
        res.status(500).json({ success: false, message: 'Error exporting data' });
    }
}

module.exports = {
    profile, viewHome, getAllData, addUser, deleteUser, editUser, getUserById, addUserView, updateUser,
    searchUser, editUserView, profile, editProfileView, updateProfile, settingsView,
    updateProfilePicture, changePassword, deleteAccount, exportData
}