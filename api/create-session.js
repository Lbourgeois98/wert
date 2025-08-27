// api/create-session.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.WERT_API_KEY, // stored securely in Vercel env
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        flow_type: "simple_full_restrict",
        wallet_address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        currency: "BTC",
        network: "bitcoin",
        currency_amount: 100.50
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create Wert session" });
  }
}
