// File: api/create-wert-session.js
// Production-ready Wert API handler for Vercel

export default async function handler(req, res) {
  // CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    console.log('🔄 Processing Wert session request...');

    // Get API key from environment variables
    const API_KEY = process.env.WERT_API_KEY;
    
    if (!API_KEY) {
      console.error('❌ WERT_API_KEY environment variable not set');
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error - missing API key'
      });
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

    // Log request (without sensitive data)
    console.log('📝 Request data:', {
      flow_type,
      currency,
      commodity,
      network,
      currency_amount,
      wallet_address: wallet_address ? `${wallet_address.substring(0, 6)}...${wallet_address.substring(-4)}` : 'none'
    });

    // Validate required fields
    if (!flow_type || !wallet_address || !currency || !commodity || !network) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
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
    if (currency_amount && !isNaN(parseFloat(currency_amount))) {
      sessionData.currency_amount = parseFloat(currency_amount);
    }

    if (phone) {
      sessionData.phone = phone;
    }

    // Always use production API endpoint (sandbox determined by API key)
    const API_BASE_URL = 'https://partner.wert.io';
    const endpoint = `${API_BASE_URL}/api/external/hpp/create-session`;

    console.log('📡 Making request to Wert API...');

    // Make request to Wert API
    const wertResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData)
    });

    console.log(`📡 Wert API response status: ${wertResponse.status}`);

    if (!wertResponse.ok) {
      const errorText = await wertResponse.text();
      console.error('❌ Wert API error:', {
        status: wertResponse.status,
        statusText: wertResponse.statusText,
        body: errorText
      });
      
      // Parse error response if possible
      let errorMessage = 'Failed to create payment session';
      let errorDetails = errorText;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
      } catch (e) {
        // Keep raw error text
      }

      // Return appropriate error status
      const statusCode = wertResponse.status === 401 ? 401 : 
                        wertResponse.status === 400 ? 400 : 500;

      return res.status(statusCode).json({ 
        success: false,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        wertStatus: wertResponse.status
      });
    }

    const sessionResult = await wertResponse.json();
    console.log('✅ Wert session created successfully');
    
    // Return session data to frontend
    res.status(200).json({
      success: true,
      session_id: sessionResult.session_id,
      expires_at: sessionResult.expires_at || null
    });

  } catch (error) {
    console.error('💥 Server error:', error);
    
    // Determine error type and message
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Unable to connect to payment service';
      statusCode = 503;
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Network error connecting to payment service';
      statusCode = 503;
    }

    res.status(statusCode).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: error.code || undefined
    });
  }
}
