// Official Wert Widget Integration for Static Sites
import { WertWidget } from '@wert-io/widget-initializer';

export class WertIntegration {
  constructor() {
    this.partnerId = '01K1T8VJJ8TY67M49FDXY865GF';
    this.widget = null;
  }

  /**
   * Initialize and open the Wert widget using official documentation
   */
  async openWidget(config = {}) {
    try {
      console.log('🚀 Initializing Wert widget...');

      // Create widget instance with your partner ID and configuration
      this.widget = new WertWidget({
        partner_id: this.partnerId,
        
        // Transaction details
        click_id: this.generateClickId(), // Unique identifier for this transaction
        origin: window.location.origin,
        
        // Pre-fill transaction details
        commodity: config.commodity || 'BTC',
        network: config.network || 'bitcoin',
        address: config.walletAddress || '39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv',
        currency: config.currency || 'USD',
        currency_amount: config.currencyAmount || 100,
        
        // Widget appearance
        theme: config.theme || 'dark',
        color_buttons: '#ff0000',
        color_secondary: '#000000',
        
        // Widget behavior
        redirect_url: window.location.href,
        close_redirect_url: window.location.href,
        
        // Additional options
        ...config.widgetOptions
      });

      console.log('✅ Widget initialized successfully');
      
      // Open the widget
      this.widget.open();
      console.log('🎉 Widget opened');
      
      return this.widget;
    } catch (error) {
      console.error('❌ Failed to initialize widget:', error);
      throw error;
    }
  }

  /**
   * Generate a unique click ID for transaction tracking
   */
  generateClickId() {
    return `shawnsweeps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      console.warn('Widget not initialized. Call openWidget() first.');
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

    // Payment status updates
    if (callbacks.onStatusUpdate) {
      this.widget.on('status', callbacks.onStatusUpdate);
    }
  }
}