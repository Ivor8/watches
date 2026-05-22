import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ id: 1 });
    
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { shop_name, whatsapp, email, telegram_url, shipping_fee, promo_text } = req.body;
    
    let settings = await Settings.findOne({ id: 1 });
    
    if (!settings) {
      settings = new Settings();
    }
    
    if (shop_name) settings.shop_name = shop_name;
    if (whatsapp) settings.whatsapp = whatsapp;
    if (email) settings.email = email;
    if (telegram_url) settings.telegram_url = telegram_url;
    if (shipping_fee) settings.shipping_fee = Math.round(Number(shipping_fee));
    if (promo_text) settings.promo_text = promo_text;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
