// File: /api/create-session.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    const response = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.WERT_API_KEY, // 🔒 store in Vercel env vars
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flow_type: "simple_full_restrict",
        wallet_address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // replace with your wallet
        currency: "BTC",
        network: "bitcoin",
        currency_amount: amount, // dynamic from frontend
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data); // returns session_id
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
