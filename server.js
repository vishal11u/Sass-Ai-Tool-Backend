const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const AiTool = require("./routes/aitool");
const authRoutes = require("./routes/authroutes");
const contactRoute = require('./routes/contact');
const notificationRoutes = require('./routes/notifications');
const dashboard = require('./routes/dashboard');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
// app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/aitools', AiTool);
app.use('/auth', authRoutes);
app.use('/contact', contactRoute);
app.use('/notifications', notificationRoutes);
app.use('/dashboard', dashboard);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
