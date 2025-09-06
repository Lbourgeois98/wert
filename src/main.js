// Main application logic using Wert Widget Initializer
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
      // Configuration for the widget
      const config = {
        walletAddress: '39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv',
        currency: 'USD',
        commodity: 'BTC',
        network: 'bitcoin',
        currencyAmount: 100,
        theme: 'dark',
        width: 460,
        height: 700
      };

      // Set up widget event listeners
      const callbacks = {
        onOpen: () => {
          console.log('Widget opened');
          this.showSuccess('Payment widget opened successfully!');
        },
        onClose: () => {
          console.log('Widget closed');
          this.showSuccess('Payment widget was closed. Check your wallet for any transactions.');
        },
        onPayment: (data) => {
          console.log('Payment completed:', data);
          this.showSuccess('Payment completed successfully! Check your wallet.');
        },
        onError: (error) => {
          console.error('Widget error:', error);
          this.showError(`Payment error: ${error.message || 'Unknown error'}`);
        }
      };

      // Initialize and open widget
      const widget = await this.wertIntegration.openWidget(config);
      this.wertIntegration.setupEventListeners(callbacks);

    } catch (error) {
      console.error('Wert integration error:', error);
      this.showError(error.message || 'Failed to initialize payment. Please try again.');
    } finally {
      this.hideLoading();
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ShawnSweepsApp();
});