// Main application logic using official Wert widget
import { WertIntegration } from './wert-integration.js';

class ShawnSweepsApp {
  constructor() {
    this.wertIntegration = new WertIntegration();
    this.initializeUI();
    this.setupEventListeners();
  }

  initializeUI() {
    // Get UI elements
    this.wertButton = document.getElementById('wertButton');
    this.errorDiv = document.getElementById('errorMessage');
    this.successDiv = document.getElementById('successMessage');
    this.loadingDiv = document.getElementById('loadingMessage');
  }

  setupEventListeners() {
    this.wertButton.addEventListener('click', () => this.handleWertDeposit());
  }

  // Status message functions
  showError(message) {
    this.errorDiv.textContent = message;
    this.errorDiv.classList.remove('hidden');
    this.hideSuccess();
    this.hideLoading();
  }

  showSuccess(message) {
    this.successDiv.textContent = message;
    this.successDiv.classList.remove('hidden');
    this.hideError();
    this.hideLoading();
  }

  hideError() {
    this.errorDiv.classList.add('hidden');
  }

  hideSuccess() {
    this.successDiv.classList.add('hidden');
  }

  showLoading() {
    this.loadingDiv.classList.remove('hidden');
    this.wertButton.disabled = true;
  }

  hideLoading() {
    this.loadingDiv.classList.add('hidden');
    this.wertButton.disabled = false;
  }

  async handleWertDeposit() {
    this.hideError();
    this.hideSuccess();
    this.showLoading();

    try {
      console.log('🚀 Starting Wert deposit process...');

      // Configuration for the widget
      const config = {
        commodity: 'BTC',
        network: 'bitcoin',
        walletAddress: '39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv',
        currency: 'USD',
        currencyAmount: 100,
        theme: 'dark'
      };

      // Set up widget event listeners
      const callbacks = {
        onOpen: () => {
          console.log('✅ Widget opened successfully');
          this.showSuccess('Payment widget opened successfully!');
        },
        onClose: () => {
          console.log('🔒 Widget closed');
          this.showSuccess('Payment widget was closed. Check your wallet for any transactions.');
        },
        onPayment: (data) => {
          console.log('💰 Payment completed:', data);
          this.showSuccess('Payment completed successfully! Check your wallet for Bitcoin.');
        },
        onError: (error) => {
          console.error('❌ Widget error:', error);
          this.showError(`Payment error: ${error.message || 'Unknown error'}`);
        },
        onStatusUpdate: (status) => {
          console.log('📊 Payment status update:', status);
        }
      };

      // Initialize and open widget
      console.log('📡 Opening Wert widget...');
      const widget = await this.wertIntegration.openWidget(config);
      this.wertIntegration.setupEventListeners(callbacks);

      console.log('🎉 Widget setup completed');

    } catch (error) {
      console.error('💥 Wert integration error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to initialize payment widget. Please try again.';
      
      if (error.message.includes('partner_id')) {
        errorMessage = 'Widget configuration error. Please contact support.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.showError(errorMessage);
    } finally {
      this.hideLoading();
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 ShawnSweeps App initializing...');
  new ShawnSweepsApp();
});