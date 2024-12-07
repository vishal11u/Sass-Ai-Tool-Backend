const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const AiTool = require("./routes/aitool");
const authRoutes = require("./routes/authroutes");
const contactRoute = require("./routes/contact");
const notificationRoutes = require("./routes/notifications");
const dashboard = require("./routes/dashboard");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/aitools", AiTool);
app.use("/auth", authRoutes);
app.use("/contact", contactRoute);
app.use("/notifications", notificationRoutes);
app.use("/dashboard", dashboard);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
