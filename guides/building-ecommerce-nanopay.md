- title: Building an E-commerce Store with NanoPay.js
- date: 01-15-2025
- tags: nanopay, guide, ecommerce
- image: images/nanopay/ecommerce-hero.jpg
- author: @nano2dev
- video: true
-----
Meet Sarah, a digital artist who's been selling her artwork online for years. She's tired of losing 3-5% of every sale to payment processors and waiting days for funds to clear. When she discovered NanoPay.js, everything changed.

In this guide, we'll walk through Sarah's journey of building a complete e-commerce store using NanoPay.js, from simple product pages to advanced shopping cart functionality.

## The Problem: Traditional Payment Pain Points

Sarah's previous setup had several issues:
- **High fees**: 3-5% per transaction
- **Slow settlements**: 2-7 business days
- **Chargeback risks**: Customers could dispute payments months later
- **Geographic restrictions**: Some customers couldn't pay from certain countries
- **Complex integration**: Required merchant accounts, PCI compliance, and complex APIs

## The Solution: NanoPay.js E-commerce Integration

NanoPay.js solved all these problems:
- **Zero fees**: No transaction fees on the Nano network
- **Instant settlements**: Payments confirm in seconds
- **No chargebacks**: Cryptocurrency transactions are final
- **Global access**: Anyone with Nano can pay from anywhere
- **Simple integration**: Just add HTML attributes

## Step 1: Basic Product Page

Sarah started with a simple product page for her digital art prints:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Sarah's Digital Art - Premium Print</title>
    <script src="https://cdn.nano.to/pay.js"></script>
</head>
<body>
    <div class="product-page">
        <img src="artwork.jpg" alt="Digital Art Print">
        <h1>Sunset Dreams - Digital Print</h1>
        <p>High-resolution digital art print, perfect for home decoration.</p>
        
        <div class="pricing">
            <span class="price">5 NANO</span>
            <span class="usd">≈ $2.50 USD</span>
        </div>
        
        <!-- NanoPay.js Payment Button -->
        <div data-amount="5" 
             data-address="nano_1sarah1234567890abcdefghijklmnopqrstuvwxyz" 
             data-title="Sunset Dreams - Digital Print"
             data-description="High-resolution digital art print"
             data-contact="true"
             class="buy-button">
            Buy Now - 5 NANO
        </div>
    </div>
</body>
</html>
```

**Result**: Sarah's first sale happened within 24 hours of going live!

## Step 2: Adding Shopping Cart Functionality

As Sarah's business grew, she needed a shopping cart for multiple items. She implemented NanoPay.js's advanced line items feature:

```html
<div class="shopping-cart">
    <h2>Your Cart</h2>
    
    <div class="cart-items">
        <div class="cart-item">
            <img src="artwork1.jpg" alt="Artwork 1">
            <div class="item-details">
                <h3>Sunset Dreams</h3>
                <p>Size: 16x20 inches</p>
                <span class="price">5 NANO</span>
            </div>
        </div>
        
        <div class="cart-item">
            <img src="artwork2.jpg" alt="Artwork 2">
            <div class="item-details">
                <h3>Ocean Waves</h3>
                <p>Size: 12x16 inches</p>
                <span class="price">3 NANO</span>
            </div>
        </div>
    </div>
    
    <div class="cart-total">
        <strong>Total: 8 NANO</strong>
    </div>
    
    <!-- Advanced Shopping Cart Payment -->
    <div data-amount="8" 
         data-address="nano_1sarah1234567890abcdefghijklmnopqrstuvwxyz" 
         data-title="Digital Art Collection"
         data-line-items='[
             {
                 "name": "Sunset Dreams - Digital Print", 
                 "price": 5, 
                 "quantity": 1,
                 "variants": {"size": "16x20 inches", "format": "Digital"},
                 "description": "High-resolution digital art print",
                 "image": "artwork1.jpg"
             },
             {
                 "name": "Ocean Waves - Digital Print", 
                 "price": 3, 
                 "quantity": 1,
                 "variants": {"size": "12x16 inches", "format": "Digital"},
                 "description": "Calming ocean scene digital print",
                 "image": "artwork2.jpg"
             }
         ]'
         data-contact="true"
         class="checkout-button">
        Complete Purchase - 8 NANO
    </div>
</div>
```

## Step 3: Physical Product Integration

Sarah decided to offer physical prints as well. She added shipping functionality:

```html
<div class="physical-product">
    <h2>Physical Art Print</h2>
    <p>Premium quality print on archival paper, shipped worldwide.</p>
    
    <div data-amount="15" 
         data-address="nano_1sarah1234567890abcdefghijklmnopqrstuvwxyz" 
         data-title="Physical Art Print - Sunset Dreams"
         data-description="Premium quality print on archival paper"
         data-shipping="true"
         data-contact="true"
         class="buy-button">
        Buy Physical Print - 15 NANO
    </div>
</div>
```

## Step 4: Programmatic Payment Handling

For more complex scenarios, Sarah implemented programmatic payment handling:

```javascript
// Handle successful payments
function handlePaymentSuccess(block) {
    console.log('Payment received:', block);
    
    // Send confirmation email
    sendConfirmationEmail(block);
    
    // Update inventory
    updateInventory();
    
    // Redirect to success page
    window.location.href = '/success?hash=' + block.block.hash;
}

// Open payment modal programmatically
function openPaymentModal(product) {
    window.NanoPay.open({
        title: product.name,
        amount: product.price,
        address: 'nano_1sarah1234567890abcdefghijklmnopqrstuvwxyz',
        description: product.description,
        success: handlePaymentSuccess,
        cancel: function() {
            console.log('Payment cancelled');
        },
        expired: function() {
            alert('Payment expired. Please try again.');
        }
    });
}
```

## Step 5: Premium Content Wall

Sarah also created premium tutorials behind a paywall:

```html
<div id="premium-tutorial" class="tutorial">
    <h2>Advanced Digital Art Techniques</h2>
    <p>This premium tutorial covers advanced techniques...</p>
    
    <div class="premium-content">
        <h3>🔒 Premium Content</h3>
        <p>Unlock this tutorial for 2 NANO</p>
        <div data-amount="2" 
             data-address="nano_1sarah1234567890abcdefghijklmnopqrstuvwxyz" 
             data-title="Premium Tutorial Access"
             data-description="Access to advanced digital art techniques">
            Unlock Tutorial - 2 NANO
        </div>
    </div>
</div>

<script>
// Lock premium content
window.NanoPay.wall({
    element: '#premium-tutorial',
    title: 'Unlock Premium Tutorial',
    amount: 2,
    address: 'nano_1sarah1234567890abcdefghijklmnopqrstuvwxyz',
    description: 'Access to advanced digital art techniques',
    button: 'Unlock Tutorial'
});
</script>
```

## Real Results: Sarah's Success Story

After implementing NanoPay.js, Sarah saw remarkable results:

### Financial Impact
- **Eliminated payment fees**: Saved $2,400 annually (previously 4% of $60k revenue)
- **Faster cash flow**: Instant settlements vs. 3-5 day delays
- **Global reach**: Customers from 15+ countries could now pay easily

### Customer Experience
- **Simplified checkout**: One-click payments with Nano wallets
- **No registration required**: Customers didn't need accounts
- **Mobile-friendly**: Works perfectly on all devices

### Technical Benefits
- **Easy maintenance**: No complex payment infrastructure
- **Reliable**: No downtime or payment processor issues
- **Scalable**: Handles any volume without additional costs

## Advanced Features Sarah Implemented

### Custom Styling
```css
<style>
/* Custom NanoPay styling to match brand */
#nano-pay-body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    border: none !important;
}

#nano-pay-submit {
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}
</style>
```

### Debug Mode for Testing
```javascript
// Enable debug mode during development
window.NanoPay.open({
    title: 'Test Payment',
    amount: 0.1,
    address: 'nano_1sarah1234567890abcdefghijklmnopqrstuvwxyz',
    debug: true, // Shows debug buttons for testing
    success: function(block) {
        console.log('Test payment successful:', block);
    }
});
```

## Key Takeaways

1. **Start Simple**: Begin with basic payment buttons, then add complexity
2. **Test Thoroughly**: Use debug mode and demo addresses for testing
3. **Customize Wisely**: Match NanoPay styling to your brand
4. **Handle Edge Cases**: Implement proper error handling and timeouts
5. **Monitor Performance**: Track conversion rates and user feedback

## Next Steps

Sarah's store now processes hundreds of Nano payments monthly. She's planning to:
- Add subscription functionality for monthly art tutorials
- Implement loyalty rewards for repeat customers
- Create a mobile app with NanoPay integration

## Resources

- [NanoPay.js Documentation](/nanopay.html)
- [Nano Wallet Setup Guide](/wallet.html)
- [Nano RPC API](/nano-rpc.html)

---

*Ready to build your own e-commerce store with NanoPay.js? Start with a simple product page and grow from there. The Nano ecosystem is waiting for your innovation!*
