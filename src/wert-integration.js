export class WertIntegration {
  constructor() {
    this.partnerId = '01K1T8VJJ8TY67M49FDXY865GF';
    this.baseUrl = 'https://widget.wert.io';
  }

  /**
   * Create a session via backend API and return session_id
   */
  async createSession(config) {
    console.log('🔄 Creating Wert session via backend...');
    
    const sessionData = {
      wallet_address: config.walletAddress,
      currency_amount: config.currencyAmount,
      currency: config.currency || 'USD',
      commodity: config.commodity || 'BTC',
      network: config.network || 'bitcoin'
    };

    // Add phone if provided
    if (config.userPhone) {
      sessionData.phone = config.userPhone;
    }

    console.log('📤 Sending session data:', sessionData);

    // Use Railway backend URL in production, localhost in development
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://wert-production-029b.up.railway.app/api/create-wert-session'
      : '/api/create-wert-session';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData)
    });

    // Handle response
    const responseText = await response.text();
    console.log('📥 Backend response status:', response.status);
    console.log('📥 Backend response text:', responseText);

    if (!response.ok) {
      let errorMessage = 'Failed to create payment session';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Backend Error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    let sessionResponse;
    try {
      sessionResponse = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse backend response:', e);
      throw new Error('Invalid response from backend');
    }

    if (!sessionResponse.session_id) {
      console.error('❌ No session_id in response:', sessionResponse);
      throw new Error('No session ID received from backend');
    }

    console.log('✅ Session created successfully:', sessionResponse.session_id);
    return sessionResponse;
  }

  /**
   * Open Wert widget using session_id
   */
  openWidget(sessionId, options = {}) {
    console.log('🚀 Opening Wert widget with session:', sessionId);

    // Build widget URL with session
    const widgetUrl = `${this.baseUrl}/widget/sessions/${sessionId}?partner_id=${this.partnerId}&theme=dark`;
    
    console.log('🔗 Widget URL:', widgetUrl);

    // Open in popup window
    const popup = window.open(
      widgetUrl,
      'wert-widget',
      'width=460,height=700,scrollbars=yes,resizable=yes,location=no,status=no,menubar=no,toolbar=no'
    );

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      throw new Error('Popup blocked! Please allow popups for this site and try again.');
    }

    // Monitor popup for close events
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        console.log('🔒 Wert widget closed');
        // You can add callback here if needed
      }
    }, 1000);

    return popup;
  }

  /**
   * Complete flow: create session and open widget
   */
  async openWidgetWithSession(config) {
    try {
      // Step 1: Create session via backend
      const sessionResponse = await this.createSession(config);
      
      // Step 2: Open widget with session_id
      const popup = this.openWidget(sessionResponse.session_id);
      
      return {
        sessionId: sessionResponse.session_id,
        popup: popup
      };
    } catch (error) {
      console.error('❌ Failed to open widget with session:', error);
      throw error;
    }
  }
}