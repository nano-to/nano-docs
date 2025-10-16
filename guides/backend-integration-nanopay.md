- title: Backend Integration with NanoPay.js - Dynamic Payments
- date: 01-15-2025
- tags: nanopay, guide, backend, api, dynamic
- image: images/nanopay/backend-hero.jpg
- author: @nano2dev
- video: true
-----

Meet David, a developer who built a marketplace platform where users can sell digital products. He needed a way to generate unique payment amounts and addresses for each transaction, ensuring proper order tracking and preventing payment conflicts.

This guide shows how David implemented a robust backend system that generates dynamic payment data for NanoPay.js integration.

## The Challenge: Dynamic Payment Generation

David's marketplace faced several technical challenges:
- **Unique payments**: Each order needed a unique payment amount to prevent conflicts
- **Order tracking**: Payments needed to be linked to specific orders
- **Address management**: Multiple payment addresses for different sellers
- **Real-time updates**: Payment status needed to update immediately
- **Security**: Preventing payment manipulation and ensuring authenticity

## The Solution: Backend-Driven Dynamic Payments

David built a backend system that generates unique payment data for each transaction:

### Backend Architecture Overview

```javascript
// Backend API Structure
const express = require('express');
const app = express();
const nano = require('nano-rpc');

// Payment generation service
class PaymentGenerator {
    constructor() {
        this.baseAmount = 0.001; // Minimum amount in NANO
        this.addressPool = [
            'nano_1seller1234567890abcdefghijklmnopqrstuvwxyz',
            'nano_1seller2345678901abcdefghijklmnopqrstuvwxyz',
            'nano_1seller3456789012abcdefghijklmnopqrstuvwxyz'
        ];
    }
    
    // Generate unique payment data
    generatePaymentData(orderId, sellerId, productPrice) {
        const uniqueAmount = this.calculateUniqueAmount(orderId, productPrice);
        const paymentAddress = this.getSellerAddress(sellerId);
        const paymentId = this.generatePaymentId(orderId);
        
        return {
            paymentId,
            orderId,
            amount: uniqueAmount,
            address: paymentAddress,
            sellerId,
            timestamp: Date.now(),
            expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
        };
    }
    
    // Calculate unique amount based on order ID
    calculateUniqueAmount(orderId, basePrice) {
        // Create unique amount by adding order ID as decimal
        const orderHash = this.hashOrderId(orderId);
        const uniqueDecimal = (orderHash % 1000) / 1000000; // 0.000001 to 0.000999
        return parseFloat((basePrice + uniqueDecimal).toFixed(6));
    }
    
    // Generate unique payment ID
    generatePaymentId(orderId) {
        return `pay_${orderId}_${Date.now()}`;
    }
    
    // Hash order ID for unique amount calculation
    hashOrderId(orderId) {
        let hash = 0;
        for (let i = 0; i < orderId.length; i++) {
            const char = orderId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    // Get seller's payment address
    getSellerAddress(sellerId) {
        const sellerIndex = this.hashOrderId(sellerId) % this.addressPool.length;
        return this.addressPool[sellerIndex];
    }
}

const paymentGenerator = new PaymentGenerator();
```

## Step 1: Backend API Endpoints

David created RESTful API endpoints for payment management:

```javascript
// Payment generation endpoint
app.post('/api/payments/generate', async (req, res) => {
    try {
        const { orderId, sellerId, productPrice } = req.body;
        
        // Validate input
        if (!orderId || !sellerId || !productPrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if order already has payment
        const existingPayment = await Payment.findOne({ orderId });
        if (existingPayment) {
            return res.json({
                success: true,
                payment: existingPayment,
                message: 'Payment already generated for this order'
            });
        }
        
        // Generate new payment data
        const paymentData = paymentGenerator.generatePaymentData(
            orderId, 
            sellerId, 
            productPrice
        );
        
        // Save to database
        const payment = new Payment(paymentData);
        await payment.save();
        
        res.json({
            success: true,
            payment: paymentData
        });
        
    } catch (error) {
        console.error('Payment generation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Payment verification endpoint
app.post('/api/payments/verify', async (req, res) => {
    try {
        const { paymentId, blockHash } = req.body;
        
        // Find payment record
        const payment = await Payment.findOne({ paymentId });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        
        // Verify payment with Nano RPC
        const paymentVerified = await verifyNanoPayment(
            payment.address, 
            payment.amount, 
            blockHash
        );
        
        if (paymentVerified) {
            // Update payment status
            payment.status = 'completed';
            payment.blockHash = blockHash;
            payment.completedAt = Date.now();
            await payment.save();
            
            // Update order status
            await Order.findByIdAndUpdate(payment.orderId, {
                status: 'paid',
                paymentId: paymentId
            });
            
            res.json({
                success: true,
                verified: true,
                orderId: payment.orderId
            });
        } else {
            res.json({
                success: true,
                verified: false,
                message: 'Payment verification failed'
            });
        }
        
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Payment status endpoint
app.get('/api/payments/:paymentId/status', async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const payment = await Payment.findOne({ paymentId });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        
        res.json({
            success: true,
            payment: {
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                amount: payment.amount,
                address: payment.address,
                status: payment.status,
                expiresAt: payment.expiresAt
            }
        });
        
    } catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
```

## Step 2: Frontend Integration

David integrated the backend with NanoPay.js on the frontend:

```javascript
// Frontend payment integration
class DynamicPaymentManager {
    constructor() {
        this.apiBase = '/api/payments';
        this.currentPayment = null;
    }
    
    // Generate payment for order
    async generatePayment(orderId, sellerId, productPrice) {
        try {
            const response = await fetch(`${this.apiBase}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    sellerId,
                    productPrice
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentPayment = data.payment;
                return data.payment;
            } else {
                throw new Error(data.error || 'Failed to generate payment');
            }
            
        } catch (error) {
            console.error('Payment generation error:', error);
            throw error;
        }
    }
    
    // Open NanoPay modal with dynamic data
    async openPaymentModal(orderId, sellerId, productPrice, productName) {
        try {
            // Generate payment data from backend
            const paymentData = await this.generatePayment(orderId, sellerId, productPrice);
            
            // Open NanoPay modal with dynamic data
            window.NanoPay.open({
                title: `Purchase ${productName}`,
                amount: paymentData.amount,
                address: paymentData.address,
                description: `Order #${orderId} - ${productName}`,
                success: async (block) => {
                    console.log('Payment successful:', block);
                    
                    // Verify payment with backend
                    const verified = await this.verifyPayment(paymentData.paymentId, block.block.hash);
                    
                    if (verified) {
                        // Show success message
                        this.showPaymentSuccess(orderId);
                        
                        // Redirect to success page
                        window.location.href = `/order-success?orderId=${orderId}`;
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                cancel: () => {
                    console.log('Payment cancelled');
                    this.showPaymentCancelled();
                },
                expired: () => {
                    console.log('Payment expired');
                    this.showPaymentExpired();
                }
            });
            
        } catch (error) {
            console.error('Payment modal error:', error);
            alert('Failed to initialize payment. Please try again.');
        }
    }
    
    // Verify payment with backend
    async verifyPayment(paymentId, blockHash) {
        try {
            const response = await fetch(`${this.apiBase}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentId,
                    blockHash
                })
            });
            
            const data = await response.json();
            return data.success && data.verified;
            
        } catch (error) {
            console.error('Payment verification error:', error);
            return false;
        }
    }
    
    // Check payment status
    async checkPaymentStatus(paymentId) {
        try {
            const response = await fetch(`${this.apiBase}/${paymentId}/status`);
            const data = await response.json();
            
            if (data.success) {
                return data.payment;
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            console.error('Payment status check error:', error);
            return null;
        }
    }
    
    // Show payment success
    showPaymentSuccess(orderId) {
        const successModal = document.createElement('div');
        successModal.className = 'payment-success-modal';
        successModal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Payment Successful!</h2>
                <p>Your order #${orderId} has been paid and confirmed.</p>
                <p>You will receive your digital product shortly.</p>
                <button onclick="this.parentElement.parentElement.remove()">Continue</button>
            </div>
        `;
        document.body.appendChild(successModal);
    }
    
    // Show payment cancelled
    showPaymentCancelled() {
        alert('Payment was cancelled. You can try again anytime.');
    }
    
    // Show payment expired
    showPaymentExpired() {
        alert('Payment expired. Please generate a new payment.');
    }
}

// Initialize payment manager
const paymentManager = new DynamicPaymentManager();
```

## Step 3: Database Schema

David designed a robust database schema for payment tracking:

```javascript
// MongoDB Schema for Payments
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    orderId: {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'expired', 'cancelled'],
        default: 'pending'
    },
    blockHash: {
        type: String,
        default: null
    },
    timestamp: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for performance
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ expiresAt: 1 });

const Payment = mongoose.model('Payment', PaymentSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    sellerId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);
```

## Step 4: Nano RPC Integration

David integrated Nano RPC for payment verification:

```javascript
// Nano RPC integration
const nanoRPC = require('nano-rpc');

class NanoPaymentVerifier {
    constructor(rpcUrl) {
        this.rpc = new nanoRPC(rpcUrl);
    }
    
    // Verify payment by checking block
    async verifyPayment(address, expectedAmount, blockHash) {
        try {
            // Get block information
            const blockInfo = await this.rpc.block_info(blockHash);
            
            if (!blockInfo) {
                return false;
            }
            
            // Check if block is for the correct address
            if (blockInfo.block_account !== address) {
                return false;
            }
            
            // Check if amount matches (convert to raw)
            const expectedAmountRaw = this.nanoToRaw(expectedAmount);
            const actualAmountRaw = blockInfo.amount;
            
            if (actualAmountRaw !== expectedAmountRaw) {
                return false;
            }
            
            // Check if block is confirmed
            const accountInfo = await this.rpc.account_info(address);
            if (accountInfo.confirmation_height === '0') {
                return false; // Not confirmed yet
            }
            
            return true;
            
        } catch (error) {
            console.error('Payment verification error:', error);
            return false;
        }
    }
    
    // Convert NANO to raw units
    nanoToRaw(nano) {
        return Math.floor(nano * Math.pow(10, 30));
    }
    
    // Get account balance
    async getAccountBalance(address) {
        try {
            const accountInfo = await this.rpc.account_info(address);
            return this.rawToNano(accountInfo.balance);
        } catch (error) {
            console.error('Balance check error:', error);
            return 0;
        }
    }
    
    // Convert raw units to NANO
    rawToNano(raw) {
        return raw / Math.pow(10, 30);
    }
}

const nanoVerifier = new NanoPaymentVerifier('https://rpc.nano.to');
```

## Step 5: Real-Time Payment Monitoring

David implemented real-time payment monitoring:

```javascript
// Real-time payment monitoring
class PaymentMonitor {
    constructor() {
        this.monitoringInterval = null;
        this.pendingPayments = new Map();
    }
    
    // Start monitoring pending payments
    startMonitoring() {
        this.monitoringInterval = setInterval(async () => {
            await this.checkPendingPayments();
        }, 30000); // Check every 30 seconds
    }
    
    // Stop monitoring
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
    
    // Check all pending payments
    async checkPendingPayments() {
        try {
            const pendingPayments = await Payment.find({
                status: 'pending',
                expiresAt: { $gt: Date.now() }
            });
            
            for (const payment of pendingPayments) {
                await this.checkPaymentStatus(payment);
            }
            
        } catch (error) {
            console.error('Payment monitoring error:', error);
        }
    }
    
    // Check individual payment status
    async checkPaymentStatus(payment) {
        try {
            // Check if payment has been received
            const balance = await nanoVerifier.getAccountBalance(payment.address);
            
            if (balance >= payment.amount) {
                // Payment received, verify it
                const accountInfo = await nanoRPC.account_info(payment.address);
                const latestBlock = accountInfo.frontier;
                
                if (latestBlock) {
                    const verified = await nanoVerifier.verifyPayment(
                        payment.address,
                        payment.amount,
                        latestBlock
                    );
                    
                    if (verified) {
                        // Update payment status
                        payment.status = 'completed';
                        payment.blockHash = latestBlock;
                        payment.completedAt = Date.now();
                        await payment.save();
                        
                        // Update order status
                        await Order.findByIdAndUpdate(payment.orderId, {
                            status: 'paid',
                            paymentId: payment.paymentId
                        });
                        
                        console.log(`Payment ${payment.paymentId} completed`);
                    }
                }
            }
            
        } catch (error) {
            console.error(`Payment check error for ${payment.paymentId}:`, error);
        }
    }
}

// Start payment monitoring
const paymentMonitor = new PaymentMonitor();
paymentMonitor.startMonitoring();
```

## Step 6: Frontend Usage Examples

David created simple frontend components for easy integration:

```html
<!-- Product page with dynamic payment -->
<div class="product-page">
    <h1>Premium Digital Art</h1>
    <p>High-resolution digital artwork</p>
    <div class="price">5.5 NANO</div>
    
    <button onclick="purchaseProduct('art_001', 'seller_123', 5.5, 'Premium Digital Art')">
        Buy Now
    </button>
</div>

<script>
// Purchase product function
async function purchaseProduct(productId, sellerId, price, productName) {
    try {
        // Generate order ID
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Open payment modal with dynamic data
        await paymentManager.openPaymentModal(orderId, sellerId, price, productName);
        
    } catch (error) {
        console.error('Purchase error:', error);
        alert('Failed to initialize purchase. Please try again.');
    }
}
</script>
```

## Real Results: David's Marketplace Success

After implementing dynamic backend integration, David achieved remarkable results:

### Technical Benefits
- **Zero payment conflicts**: Unique amounts prevent duplicate payments
- **Perfect order tracking**: Every payment linked to specific orders
- **Real-time updates**: Payment status updates immediately
- **Scalable architecture**: Handles thousands of concurrent payments

### Business Impact
- **$15,000 monthly revenue**: From digital product sales
- **99.8% payment success rate**: Higher than traditional processors
- **Instant settlements**: No waiting for payment processing
- **Global accessibility**: Customers from 40+ countries

### User Experience
- **Seamless checkout**: One-click payments with Nano wallets
- **Real-time confirmation**: Immediate payment verification
- **Mobile optimization**: Perfect experience on all devices

## Advanced Features

### Payment Analytics Dashboard
```javascript
// Payment analytics
class PaymentAnalytics {
    async getPaymentStats(timeframe = '30d') {
        const startDate = this.getStartDate(timeframe);
        
        const stats = await Payment.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPayments: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    completedPayments: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    completedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
                    }
                }
            }
        ]);
        
        return stats[0] || {
            totalPayments: 0,
            totalAmount: 0,
            completedPayments: 0,
            completedAmount: 0
        };
    }
    
    getStartDate(timeframe) {
        const now = Date.now();
        const days = parseInt(timeframe.replace('d', ''));
        return now - (days * 24 * 60 * 60 * 1000);
    }
}
```

### Multi-Seller Support
```javascript
// Multi-seller payment routing
class MultiSellerPaymentRouter {
    constructor() {
        this.sellerAddresses = new Map();
    }
    
    // Register seller address
    registerSeller(sellerId, address) {
        this.sellerAddresses.set(sellerId, address);
    }
    
    // Route payment to correct seller
    routePayment(sellerId, amount, orderId) {
        const sellerAddress = this.sellerAddresses.get(sellerId);
        if (!sellerAddress) {
            throw new Error(`Seller ${sellerId} not found`);
        }
        
        return {
            address: sellerAddress,
            amount: amount,
            sellerId: sellerId,
            orderId: orderId
        };
    }
}
```

## Key Takeaways

1. **Unique Payment Generation**: Use order IDs to create unique payment amounts
2. **Backend Verification**: Always verify payments server-side
3. **Real-time Monitoring**: Implement payment status monitoring
4. **Database Design**: Proper indexing for performance
5. **Error Handling**: Comprehensive error handling and logging

## Common Pitfalls to Avoid

- **Payment conflicts**: Always use unique amounts
- **Race conditions**: Implement proper locking mechanisms
- **Security vulnerabilities**: Validate all inputs server-side
- **Performance issues**: Use proper database indexing
- **Missing monitoring**: Implement real-time payment tracking

## Next Steps

David's marketplace now processes hundreds of dynamic payments daily. He's planning to:
- Add subscription payments with recurring billing
- Implement escrow payments for high-value items
- Create a mobile app with the same backend integration

## Resources

- [NanoPay.js Documentation](/nanopay.html)
- [Nano RPC API](/nano-rpc.html)
- [Backend Integration Examples](/nanopay.html#programmatic-usage)

---

*Ready to build dynamic payments with NanoPay.js? Start with unique payment generation and scale from there. The future of payment processing is here!*
