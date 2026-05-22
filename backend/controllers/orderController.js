import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Customer from '../models/Customer.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    const items = await OrderItem.find({ order_id: id });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ ...order.toObject(), items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customer_id, items, subtotal, tax, shipping, total, shipping_address, notes } = req.body;
    
    let customerId = customer_id;
    if (shipping_address && shipping_address.email) {
      let customer = await Customer.findOne({ email: shipping_address.email });
      if (!customer) {
        customer = new Customer({
          email: shipping_address.email,
          name: shipping_address.name,
          phone: shipping_address.phone,
          address: {
            line1: shipping_address.line1,
            city: shipping_address.city,
            state: shipping_address.state,
            postal_code: shipping_address.postal_code,
            country: shipping_address.country,
          },
        });
        await customer.save();
      }
      customerId = customer._id;
    }
    
    const order = new Order({
      customer_id: customerId,
      status: 'pending',
      subtotal,
      tax: tax || 0,
      shipping,
      total,
      shipping_address,
      notes,
    });
    
    await order.save();
    
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: order._id,
        ...item,
      }));
      await OrderItem.insertMany(orderItems);
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await OrderItem.deleteMany({ order_id: id });
    await Order.findByIdAndDelete(id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrdersByCustomerEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required.' });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.json([]);
    }

    const orders = await Order.find({ customer_id: customer._id }).sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const recentOrders = await Order.find().sort({ created_at: -1 }).limit(5);
    
    res.json({
      orders: totalOrders,
      revenue: totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
