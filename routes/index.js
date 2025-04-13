const Controller = require('../controllers/Controller'); // Controller untuk fitur restoran
const UserController = require('../controllers/UserController'); // Controller untuk autentikasi
const { isAdmin, isLoggedIn } = require('../midllewares/middleware');
const router = require('express').Router();

// Rute Autentikasi
router.get('/register', UserController.registerForm); // Menampilkan form register
router.post('/register', UserController.postRegister); // Proses register
router.get('/login', UserController.loginForm); // Menampilkan form login
router.post('/login', UserController.postLogin); // Proses login
router.get('/logout', isLoggedIn, UserController.getLogout); // Logout

// Middleware untuk memastikan pengguna sudah login sebelum mengakses fitur restoran
router.use(isLoggedIn);

// Rute Fitur Restoran
router.get('/home',  isLoggedIn, UserController.home); // Halaman home (dari UserController untuk testing)
router.get('/profile', isLoggedIn, UserController.getProfile)
router.get('/profile/edit', isLoggedIn, UserController.editProfileForm); // Menampilkan form edit
router.post('/profile/edit', isLoggedIn, UserController.updateProfile);  // Proses update profile
router.get('/restaurant',  isLoggedIn, Controller.restaurant); // Daftar restoran dengan fitur search
router.get('/restaurant/:id',  isLoggedIn, Controller.restaurantById); // Detail restoran dan menu
router.post('/input',  isLoggedIn, Controller.input); // Form input order
router.get('/order',  isLoggedIn, Controller.order); // Halaman order dengan tombol qty dan delete
router.post('/order/complete',  isLoggedIn, Controller.completeOrder)
router.post('/order/done',  isLoggedIn, Controller.donePayment);
router.post('/order/increment/:MenuId',  isLoggedIn, Controller.incrementOrder); // Rute baru untuk tombol +
router.post('/order/decrement/:MenuId',  isLoggedIn, Controller.decrementOrder); // -
router.post('/order/input/:MenuId',  isLoggedIn, Controller.inputOrder); // Menambah/mengurangi qty di halaman order
router.post('/order/delete/:MenuId',  isLoggedIn, Controller.deleteMenu); // Menghapus menu dari order
router.get('/logout', isLoggedIn, UserController.getLogout); // Logout

module.exports = router;