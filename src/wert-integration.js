// Wert Widget Integration using backend API
import { WertWidget } from '@wert-io/widget-initializer';

export class WertIntegration {
  constructor() {
    this.partnerId = '01K1T8VJJ8TY67M49FDXY865GF';
    this.isSandbox = true; // Set to false for production
    this.widget = null;
  }

  /**
   * Create a payment session via your backend API
   */
  async createSession(sessionData) {
    try {
      console.log('Creating session via backend API:', sessionData);
      
      const response = await fetch('/api/create-wert-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Backend API Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Session created successfully:', result);
      return result;
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
      // Prepare session data for backend
      const sessionData = {
        flow_type: config.flowType || 'simple_full_restrict',
        wallet_address: config.walletAddress || '39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv',
        currency: config.currency || 'USD',
        commodity: config.commodity || 'BTC',
        network: config.network || 'bitcoin'
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

      // Initialize widget with session from backend
      this.widget = new WertWidget({
        partner_id: this.partnerId,
        session_id: session.session_id,
        theme: config.theme || 'dark',
        width: config.width || 460,
        height: config.height || 700,
        ...config.widgetOptions
      });

      console.log('Widget initialized with session:', session.session_id);
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