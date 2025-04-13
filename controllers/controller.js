const { Op } = require('sequelize');
const {Restaurant, Menu, Order} = require('../models')
const QRCode = require('qrcode');
const formatRupiah = require('../helpers/helper');

class Controller{
    static async home(req,res){
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }


    static async restaurant(req,res){
        try {
            const { search } = req.query;
            let option = {
                order: [['name_restaurant', 'ASC']],
            };

            if (search) {
                option.where = { name_restaurant: { [Op.iLike]: `%${search}%` } };
            }

            let data = await Restaurant.findAll(option);
            res.render('restaurant', { data });
        } catch (error) {
           
            res.send(error)
        }
    }

    static async restaurantById(req,res){
        try {
            const { id } = req.params;
        const { search } = req.query;
        let option = {
            include: [{
                model: Menu,
                required: false, 
                ...(search && search.trim() && {
                    where: { name_food: { [Op.iLike]: `%${search.trim()}%` } },
                }),
            }],
            order: [['name_restaurant', 'ASC']],
        };

        let data = await Restaurant.findByPk(id, option);

        if (!data) {
            return res.render('restaurantDetail', { data: null });
        }
        res.render('restaurantDetail', { data, formatRupiah});
        } catch (error) {
         
            res.send(error)
        }
    }
    

    static async order(req,res){
        try {
            const orders = await Order.findAll({
                where: { UserId: req.session.userId },
                include: [{ model: Menu }, { model: Restaurant }]
              });
              res.render('order', { orders, formatRupiah})
        } catch (error) {
            res.send(error)
        }
    }

    static async input(req,res){
        try {
            if (!req.session.userId) {
                return res.redirect('/login?error=Please login first');
            }
            const { MenuId, RestaurantId } = req.body;
            const menu = await Menu.findByPk(MenuId);
            const restaurant = await Restaurant.findByPk(RestaurantId);
            if (!menu || !restaurant) {
                return res.send('Menu or Restaurant not found');
            }
            await Order.create({
                UserId: req.session.userId,
                RestaurantId,
                MenuId,
                quantity: 1
            });
            res.redirect(`/restaurant/${RestaurantId}`);
        } catch (error) {
            res.send(error)
        }
    }

    static async inputOrder(req,res){
        try {
            const { MenuId } = req.params;
            const { action } = req.body; 
            const order = await Order.findOne({
              where: { MenuId, UserId: req.session.userId }
            });
            if (!order) throw new Error('Order not found');
            if (action === 'plus') order.quantity += 1;
            else if (action === 'minus' && order.quantity > 1) order.quantity -= 1;
            await order.save();
            res.redirect('/order') 
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteMenu(req, res){
        try {
            const { MenuId } = req.params;
            await Order.destroy({
                where: { MenuId, UserId: req.session.userId }
            });
            res.redirect('/order')
        } catch (error) {
            res.send(error)
        }
    }

    static async completeOrder(req, res) {
        try {
            const orders = await Order.findAll({
                where: { UserId: req.session.userId },
                include: [{ model: Menu }, { model: Restaurant }]
            });
            if (orders.length === 0) throw new Error('No orders to complete');
    
            const totalPrice = orders.reduce((sum, order) => sum + order.Menu.price * order.quantity, 0);
            const qrData = `https://payment-gateway.example.com/pay?userId=${req.session.userId}&amount=${totalPrice}`;
            const qrCodeUrl = await QRCode.toDataURL(qrData);

            req.session.pendingOrders = orders;
    
            res.render('payment', { qrCodeUrl, totalPrice, orders , formatRupiah});
        } catch (error) {
          res.send(error)
        }
    }

    static async incrementOrder(req, res) {
        try {
            const { MenuId } = req.params;
            const order = await Order.findOne({
                where: { MenuId, UserId: req.session.userId }
            });
            if (!order) throw new Error('Order not found');
            order.quantity += 1;
            await order.save();
            res.redirect('/order');
        } catch (error) {
            res.redirect('/order?error=' + encodeURIComponent(error.message));
        }
    }
    
    static async decrementOrder(req, res) {
        try {
            const { MenuId } = req.params;
            const order = await Order.findOne({
                where: { MenuId, UserId: req.session.userId }
            });
            if (!order) throw new Error('Order not found');
            if (order.quantity > 1) {
                order.quantity -= 1;
                await order.save();
            }
            res.redirect('/order');
        } catch (error) {
            res.redirect('/order?error=' + encodeURIComponent(error.message));
        }
    }

    static async donePayment(req, res) {
        try {
            await Order.destroy({ where: { UserId: req.session.userId } });
            res.redirect('/restaurant?paymentSuccess=true')
        } catch (error) {
            res.send(error)
        }
    }

    
}

module.exports = Controller