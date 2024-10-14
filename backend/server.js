const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const users = require("./userRoutes");
const    tutorAvailability = require("./tutorAvailabilityRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(users); 
app.use(tutorAvailability);

// Add the logout route 
app.post('/api/logout', (req, res) => {
  // Perform any necessary logout actions on the backend (e.g., clear session)
  res.status(200).send('Logged out successfully');
});  

app.listen(PORT, () => {
  connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);  
});