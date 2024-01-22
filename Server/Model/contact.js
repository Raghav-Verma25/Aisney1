// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const csvtojson = require('csvtojson');
const excelToJson = require('convert-excel-to-json');
var cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://raghav:Project0@cluster0.o6tmjgy.mongodb.net/?retryWrites=true&w=majority&dbname=Aisensy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
});
app.use(cors());

const Contact = mongoose.model('contact', contactSchema);

app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });



app.post('/contacts', async (req, res) => {
  try {
    
    const contacts = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      throw new Error('Invalid request body');
    }

    g
    await Contact.insertMany(contacts);

    res.status(200).json({ message: 'Contacts imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error importing contacts' });
  }
});


app.get('/api/contacts', async (req, res) => {
  const { page = 1, contactsPerPage = 10 } = req.query;
  const skip = (page - 1) * contactsPerPage;

  try {
    const totalContacts = await Contact.countDocuments();

    const contactList = await Contact.find().skip(skip).limit(parseInt(contactsPerPage));

    res.status(200).json({
      contacts: contactList,
      totalContacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});