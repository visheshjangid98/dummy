import { Rcon } from "rcon-client";
import Admin from "../model/admin.js";



async function runCommandIfOnline(command) {
  let ad;
  try {
    ad = await Admin.findOne();
    if (!ad) {
      throw new Error('Admin configuration not found in database');
    }

    const SERVER_HOST = ad.rcon_ip;   // Only IP, without port
    const RCON_PORT = ad.rcon_port;                 // Your custom RCON port
    const RCON_PASSWORD = ad.rcon_pass;

    console.log(`[RCON] Attempting to connect to ${SERVER_HOST}:${RCON_PORT}`);

    const rcon = await Rcon.connect({
      host: SERVER_HOST,
      port: RCON_PORT,
      password: RCON_PASSWORD
    });

    console.log(`[RCON] Successfully connected to ${SERVER_HOST}:${RCON_PORT}`);

    // If connection is successful, send the command
    const response = await rcon.send(command);
    console.log('Command Response:', response);
    rcon.end(); // Close the connection after sending the command
    return response; // Return the response

  } catch (error) {
    const ip = ad?.rcon_ip || 'unknown';
    const port = ad?.rcon_port || 'unknown';
    console.error(`[RCON] Connection failed to ${ip}:${port} - ${error.message}`);
    // Throw a new error specifically indicating the server is offline
    throw new Error(`RCON connection failed: ${error.message}`);
  }
}

export default runCommandIfOnline;
