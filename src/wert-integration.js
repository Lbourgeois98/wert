// Wert Widget Integration using @wert-io/widget-initializer
import { WertWidget } from '@wert-io/widget-initializer';

export class WertIntegration {
  constructor() {
    this.partnerId = '01K1T8VJJ8TY67M49FDXY865GF';
    this.apiKey = '776572742d70726f642d33343733656162352d653566312d343363352d626535312d616531336165643361643539';
    this.isSandbox = true; // Set to false for production
    this.widget = null;
  }

  /**
   * Create a payment session via Wert API
   */
  async createSession(sessionData) {
    const apiUrl = this.isSandbox 
      ? 'https://partner-sandbox.wert.io/api/external/hpp/create-session'
      : 'https://partner.wert.io/api/external/hpp/create-session';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'X-Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Session creation failed:', error);
      throw error;
    }
  }

  /**
   * Initialize the Wert widget with session
   */
  async initializeWidget(config = {}) {
    try {
      // Create session first
      const sessionData = {
        flow_type: 'simple_full_restrict',
        wallet_address: config.walletAddress || '39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv',
        currency: config.currency || 'USD',
        commodity: config.commodity || 'BTC',
        network: config.network || 'bitcoin',
        ...config.sessionData
      };

      // Add optional fields
      if (config.currencyAmount) {
        sessionData.currency_amount = parseFloat(config.currencyAmount);
      }
      if (config.phone) {
        sessionData.phone = config.phone;
      }

      console.log('Creating session with data:', sessionData);
      const session = await this.createSession(sessionData);
      console.log('Session created:', session);

      // Initialize widget with session
      this.widget = new WertWidget({
        partner_id: this.partnerId,
        session_id: session.session_id,
        theme: config.theme || 'dark',
        width: config.width || 460,
        height: config.height || 700,
        ...config.widgetOptions
      });

      return this.widget;
    } catch (error) {
      console.error('Widget initialization failed:', error);
      throw error;
    }
  }

  /**
   * Open the widget
   */
  async openWidget(config = {}) {
    try {
      if (!this.widget) {
        await this.initializeWidget(config);
      }
      
      this.widget.open();
      return this.widget;
    } catch (error) {
      console.error('Failed to open widget:', error);
      throw error;
    }
  }

  /**
   * Close the widget
   */
  closeWidget() {
    if (this.widget) {
      this.widget.close();
    }
  }

  /**
   * Set up event listeners for the widget
   */
  setupEventListeners(callbacks = {}) {
    if (!this.widget) {
      console.warn('Widget not initialized. Call initializeWidget() first.');
      return;
    }

    // Widget opened
    if (callbacks.onOpen) {
      this.widget.on('open', callbacks.onOpen);
    }

    // Widget closed
    if (callbacks.onClose) {
      this.widget.on('close', callbacks.onClose);
    }

    // Payment completed
    if (callbacks.onPayment) {
      this.widget.on('payment', callbacks.onPayment);
    }

    // Error occurred
    if (callbacks.onError) {
      this.widget.on('error', callbacks.onError);
    }

    // Position changed
    if (callbacks.onPosition) {
      this.widget.on('position', callbacks.onPosition);
    }
  }
}