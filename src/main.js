// Main application logic using backend session API
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

      // Configuration for the session
      const config = {
        walletAddress: '39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv',
        currencyAmount: 100,
        currency: 'USD',
        commodity: 'BTC',
        network: 'bitcoin'
      };

      console.log('📡 Creating session and opening widget...');
      
      // Create session via backend and open widget
      const result = await this.wertIntegration.openWidgetWithSession(config);
      
      console.log('🎉 Widget opened successfully with session:', result.sessionId);
      this.showSuccess('Payment widget opened successfully! Complete your purchase in the popup window.');

      // Monitor popup for close events
      const popup = result.popup;
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log('🔒 Widget popup closed');
          this.showSuccess('Payment widget was closed. Check your wallet for any transactions.');
        }
      }, 1000);

    } catch (error) {
      console.error('💥 Wert integration error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to initialize payment widget. Please try again.';
      
      if (error.message.includes('Popup blocked')) {
        errorMessage = 'Popup blocked! Please allow popups for this site and try again.';
      } else if (error.message.includes('wallet_address')) {
        errorMessage = 'Invalid wallet address. Please contact support.';
      } else if (error.message.includes('currency_amount')) {
        errorMessage = 'Invalid amount. Minimum purchase is $10.';
      } else if (error.message.includes('Backend Error')) {
        errorMessage = 'Backend service unavailable. Please try again later.';
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