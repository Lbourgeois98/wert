const crypto = require('crypto');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      wallet_address,
      currency_amount,
      currency = 'USD',
      commodity = 'BTC',
      network = 'bitcoin',
      phone
    } = req.body;

    // Validate required fields
    if (!wallet_address) {
      return res.status(400).json({ error: 'wallet_address is required' });
    }

    if (!currency_amount || currency_amount < 10) {
      return res.status(400).json({ error: 'currency_amount must be at least 10' });
    }

    // Your Wert credentials
    const WERT_API_KEY = process.env.WERT_API_KEY || '776572742d70726f642d33343733656162352d653566312d343363352d626535312d616531336165643361643539';
    const PARTNER_ID = '01K1T8VJJ8TY67M49FDXY865GF';

    // Prepare session data
    const sessionData = {
      flow_type: 'simple_full_restrict',
      wallet_address,
      currency,
      commodity,
      network,
      currency_amount: parseFloat(currency_amount),
      partner_id: PARTNER_ID
    };

    // Add optional phone if provided
    if (phone) {
      sessionData.phone = phone;
    }

    console.log('Creating Wert session with data:', sessionData);

    // Call Wert API to create session
    const response = await fetch('https://partner.wert.io/api/external/hpp/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WERT_API_KEY}`
      },
      body: JSON.stringify(sessionData)
    });

    const responseText = await response.text();
    console.log('Wert API response status:', response.status);
    console.log('Wert API response:', responseText);

    if (!response.ok) {
      let errorMessage = 'Failed to create payment session';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${responseText}`;
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        details: responseText 
      });
    }

    // Parse successful response
    let sessionResponse;
    try {
      sessionResponse = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Wert response:', e);
      return res.status(500).json({ 
        error: 'Invalid response from payment provider',
        details: responseText 
      });
    }

    // Return session_id to frontend
    if (sessionResponse.session_id) {
      return res.status(200).json({
        session_id: sessionResponse.session_id,
        success: true
      });
    } else {
      console.error('No session_id in response:', sessionResponse);
      return res.status(500).json({ 
        error: 'No session ID received from payment provider',
        details: sessionResponse 
      });
    }

  } catch (error) {
    console.error('Session creation error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}