// File: /api/create-wert-session.js
// Production-ready Wert API handler for Vercel

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get API key from environment variables
    const API_KEY = process.env.WERT_API_KEY;
    
    if (!API_KEY) {
      console.error('WERT_API_KEY environment variable not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Validate request body
    const { 
      flow_type, 
      wallet_address, 
      currency, 
      commodity, 
      network, 
      currency_amount, 
      phone 
    } = req.body;

    if (!flow_type || !wallet_address || !currency || !commodity || !network) {
      return res.status(400).json({ 
        message: 'Missing required fields: flow_type, wallet_address, currency, commodity, network' 
      });
    }

    // Prepare session data
    const sessionData = {
      flow_type,
      wallet_address,
      currency,
      commodity,
      network
    };

    // Add optional fields
    if (currency_amount) {
      sessionData.currency_amount = parseFloat(currency_amount);
    }

    if (phone) {
      sessionData.phone = phone;
    }

    // Use production API endpoint
    const API_BASE_URL = 'https://partner.wert.io';

    // Make request to Wert API
    const wertResponse = await fetch(`${API_BASE_URL}/api/external/hpp/create-session`, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData)
    });

    if (!wertResponse.ok) {
      const errorText = await wertResponse.text();
      console.error('Wert API error:', errorText);
      
      // Parse error response if possible
      let errorMessage = 'Failed to create payment session';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Keep default error message
      }

      return res.status(wertResponse.status).json({ 
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorText : 'Contact support if this persists'
      });
    }

    const sessionResult = await wertResponse.json();
    
    // Return session data to frontend
    res.status(200).json({
      session_id: sessionResult.session_id,
      success: true
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Contact support if this persists'
    });
  }
}
