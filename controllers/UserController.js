const { where } = require('sequelize')
const { User, UserProfile } = require('../models')
const bcrypt = require('bcryptjs')


class UserController {
    static async home(req, res) {
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await User.findOne({
                where: { id: req.session.userId },
                include: [{ model: UserProfile }]
            });
            if (!user) throw new Error('User not found');
            res.render('userProfile', { user });
        } catch (error) {
            res.redirect('/home?error=' + encodeURIComponent(error.message));
        }
    }

    static async registerForm(req, res) {
        try {
            res.render('registerForm')
        } catch (error) {
            res.send(error)
        }
    }

    static async postRegister(req, res) {
        try {
            const { username, email, password, role } = req.body
            User.create({ username, email, password, role })
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }

    static async loginForm(req, res) {
        try {
            const { error } = req.query
            res.render('loginForm', { error })
        } catch (error) {
            res.send(error)
        }
    }

    static async postLogin(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ where: { username } })
            console.log(user.id, "IDIDIDIDID");
            console.log(user.password, "PASSSWORRDD");

            if (user) {

                const isValidPassword = bcrypt.compareSync(password, user.password);
                console.log(isValidPassword, "APAKAH JAWABANYA");

                if (isValidPassword) {
                    // console.log(req.session, '<<<<<<');
                    req.session.userId = user.id;
                    req.session.role = user.role;
                    console.log(req.session.userId = user.id);

                    
                    return res.redirect('/home');
                } else {
                    const error = "Invalid username/password";
                    return res.redirect(`/login?error=${error}`);
                }
            } else {
                const error = "Invalid username/password";
                return res.redirect(`/login?error=${error}`);
            }
        } catch (err) {
            res.send(err)
        }
    }


    static async getLogout(req, res) {
        try {
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            res.redirect('/login');
        } catch (err) {
            res.send(err);
        }
    }

    static async editProfileForm(req, res) {
        try {
            const user = await User.findOne({
                where: { id: req.session.userId },
                include: [{ model: UserProfile }]
            });
            if (!user) throw new Error('User not found');
            res.render('editProfile', { user });
        } catch (error) {
            res.redirect('/profile?error=' + encodeURIComponent(error.message));
        }
    }

    // Proses update profile
    static async updateProfile(req, res) {
        try {
            const { email, fullName, address } = req.body;
            const userId = req.session.userId;

            // Update tabel User
            await User.update(
                { email },
                { where: { id: userId } }
            );

            // Update atau buat UserProfile jika belum ada
            const [userProfile, created] = await UserProfile.findOrCreate({
                where: { UserId: userId },
                defaults: { fullName, address, UserId: userId }
            });

            if (!created) {
                // Jika sudah ada, update data
                await UserProfile.update(
                    { fullName, address },
                    { where: { UserId: userId } }
                );
            }

            res.redirect('/profile?success=Profile updated successfully');
        } catch (error) {
            res.redirect('/profile/edit?error=' + encodeURIComponent(error.message));
        }
    }
}



module.exports = UserController
