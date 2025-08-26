export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.WERT_API_KEY}` // from Vercel env
      },
      body: JSON.stringify({
        commodity: req.body.commodity,
        network: req.body.network,
        address: req.body.address,
        commodity_amount: req.body.commodity_amount
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Wert API error:", err);
    res.status(500).json({ error: "Failed to create Wert session" });
  }
}
