import express from "express";
import ip from "ip";
import dotenv from "dotenv";
import Response from "./domain/response.js";
import log from "./logging/logger.js";
import { HttpStatus } from "./controller/patient.controller.js";

//Import Routes
import patientRoutes from "./routes/patients.route.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
//put cors above
app.use(express.json());


//Routes
app.get("/", (req, res) => {
  res.json(
    new Response(
      HttpStatus.OK.code,
      HttpStatus.OK.status,
      "patients APT, v1.0.0 - All Systems OK"
    )
  );
});
app.all("*", (req, res) => {
  res
    .status(HttpStatus.NOT_FOUND.code)
    .send(
      new Response(
        HttpStatus.NOT_FOUND.code,
        HttpStatus.NOT_FOUND.status,
        "Route Does Not Exist On The API"
      )
    );
});

app.use("api/patients", patientRoutes);



//Use ip address to host the server on local network only
function getIPAddress() {
  const interfaces = require("os").networkInterfaces();
  let addresses = [];
  for (let k in interfaces) {
    if (!interfaces.hasOwnProperty(k)) continue;
    for (let i = 0; i < interfaces[k].length; i++) {
      let address = interfaces[k][i];
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses[0] ? addresses : false;
}

//console.log(process.env)

app.listen(PORT, () => {
  log.info(`Server is Running on ${ip.address()}:${PORT}`);
});
 