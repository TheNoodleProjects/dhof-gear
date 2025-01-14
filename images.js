// Imports
const fs = require("fs");
const ethers = require("ethers");
const { abi } = require("./abi");

// Setup contract
const gearAddress = "0xFf796cbbe32B2150A4585a3791CADb213D0F35A3";
const rpc = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const gear = new ethers.Contract(gearAddress, abi, rpc);

(async () => {
  // List to hold images
  let images = [];

  for (let i = 1; i <= 7777; i++) {
    console.log("Collecting: ", i);

    try {
      // Get base64 encoded URI
      let uri = await gear.tokenURI(i);
      uri = uri.split(',')[1];

      // Decode into a JSON string 
      // { 
      //   "name": "Stash #{#}",
      //   "description": "{GENERIC_STRING}", 
      //   "image": "data:image/svg+xml;base64,{BASE64_DATA}"
      // }
      const json_uri = Buffer.from(uri, 'base64').toString('utf-8');
      const image = JSON.parse(json_uri)['image']

      images.push({
        [i]: {
          image
        }
      });

      if (i % 1000 === 0) {
        // Save to file every 1000 so we don't lose everything on a crash
        console.log("Saving...")
        fs.writeFileSync("./output/images.json", JSON.stringify(images));
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  // Write output
  fs.writeFileSync("./output/images.json", JSON.stringify(images));
})();