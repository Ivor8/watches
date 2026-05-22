import ContactMessage from '../models/ContactMessage.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const contact = new ContactMessage({
      name,
      email,
      subject: subject || '',
      message,
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
