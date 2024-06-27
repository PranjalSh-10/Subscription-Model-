// Import the 'express' module along with 'Request' and 'Response' types from express

import app from "./app";
import { config } from "./config/appConfig";

// Specify the port number for the server
const PORT = config.PORT;


// Start the server and listen on the specified port
app.listen(PORT, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on port`, PORT);
});