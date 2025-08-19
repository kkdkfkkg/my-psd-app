const express = require("express");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getToken() {
  const res = await fetch("https://api.aspose.cloud/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  });
  return res.json();
}

app.post("/update", async (req, res) => {
  try {
    const { access_token } = await getToken();

    const updateRes = await fetch("https://api.aspose.cloud/v3.0/psd/dkdlvhs.psd/replaceText", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "TextItems": Object.keys(req.body).map(key => ({
          "Text": req.body[key],
          "LayerName": key
        }))
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return res.status(500).json({ error: errText });
    }

    const pngUrl = `https://api.aspose.cloud/v3.0/psd/dkdlvhs.psd/preview?format=png&outType=link`;
    res.json({ imageUrl: pngUrl });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, ()=> console.log("Server running on port 3000"));