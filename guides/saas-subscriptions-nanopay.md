- title: Building a SaaS Application with NanoPay.js Subscriptions
- date: 01-15-2025
- tags: nanopay, guide, saas, subscription, recurring
- image: images/nanopay/saas-hero.jpg
- author: @nano2dev
- video: true
-----
Meet Maria, a developer who built an AI-powered project management tool. After months of development, she needed a way to monetize her SaaS application without the complexity and fees of traditional subscription systems.

This guide shows how Maria transformed her free tool into a profitable SaaS business using NanoPay.js for subscription management.

## The SaaS Challenge: Subscription Complexity

Maria faced typical SaaS monetization challenges:
- **High payment processing fees**: 2.9% + $0.30 per transaction
- **Complex subscription management**: Recurring billing, proration, dunning
- **Geographic restrictions**: Some customers couldn't pay from certain countries
- **PCI compliance**: Required for handling credit card data
- **Chargeback risks**: Customers could dispute payments months later

## The NanoPay.js Solution: Simple Subscription Management

NanoPay.js provided Maria with a streamlined approach:
- **Zero transaction fees**: No fees on the Nano network
- **Instant payments**: No waiting for payment processing
- **Global accessibility**: Anyone with Nano can subscribe
- **No PCI compliance needed**: Cryptocurrency payments are simpler
- **Final transactions**: No chargebacks or disputes

## Step 1: Basic SaaS Subscription Implementation

Maria started with a simple subscription model for her project management tool:

```html
<!DOCTYPE html>
<html>
<head>
    <title>ProjectFlow Pro - AI Project Management</title>
    <script src="https://cdn.nano.to/pay.js"></script>
</head>
<body>
    <div class="pricing-page">
        <h1>Choose Your Plan</h1>
        
        <div class="pricing-cards">
            <!-- Free Plan -->
            <div class="plan-card">
                <h3>Free</h3>
                <div class="price">$0/month</div>
                <ul>
                    <li>Up to 3 projects</li>
                    <li>Basic AI insights</li>
                    <li>Email support</li>
                </ul>
                <button class="plan-button">Current Plan</button>
            </div>
            
            <!-- Pro Plan -->
            <div class="plan-card featured">
                <h3>Pro</h3>
                <div class="price">10 NANO/month</div>
                <ul>
                    <li>Unlimited projects</li>
                    <li>Advanced AI insights</li>
                    <li>Priority support</li>
                    <li>Team collaboration</li>
                </ul>
                
                <div data-amount="10" 
                     data-address="nano_1maria1234567890abcdefghijklmnopqrstuvwxyz" 
                     data-title="ProjectFlow Pro - Monthly Subscription"
                     data-description="Monthly access to Pro features"
                     data-contact="true"
                     class="plan-button">
                    Subscribe - 10 NANO/month
                </div>
            </div>
            
            <!-- Enterprise Plan -->
            <div class="plan-card">
                <h3>Enterprise</h3>
                <div class="price">50 NANO/month</div>
                <ul>
                    <li>Everything in Pro</li>
                    <li>Custom integrations</li>
                    <li>Dedicated support</li>
                    <li>Advanced analytics</li>
                </ul>
                
                <div data-amount="50" 
                     data-address="nano_1maria1234567890abcdefghijklmnopqrstuvwxyz" 
                     data-title="ProjectFlow Enterprise - Monthly Subscription"
                     data-description="Monthly access to Enterprise features"
                     data-contact="true"
                     class="plan-button">
                    Subscribe - 50 NANO/month
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

## Step 2: Subscription Management System

Maria built a subscription management system to track user access:

```javascript
// Subscription management system
class SubscriptionManager {
    constructor() {
        this.subscriptions = this.loadSubscriptions();
    }
    
    // Grant subscription access
    grantSubscription(email, plan, durationDays = 30) {
        const subscription = {
            email: email,
            plan: plan,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            features: this.getPlanFeatures(plan)
        };
        
        this.subscriptions[email] = subscription;
        this.saveSubscriptions();
        
        // Update UI based on plan
        this.updateUIForPlan(plan);
        
        return subscription;
    }
    
    // Check if user has active subscription
    hasActiveSubscription(email) {
        const subscription = this.subscriptions[email];
        if (!subscription) return false;
        
        const now = new Date();
        const endDate = new Date(subscription.endDate);
        
        return now < endDate && subscription.status === 'active';
    }
    
    // Get user's current plan
    getCurrentPlan(email) {
        if (this.hasActiveSubscription(email)) {
            return this.subscriptions[email].plan;
        }
        return 'free';
    }
    
    // Get plan features
    getPlanFeatures(plan) {
        const features = {
            free: ['basic_projects', 'basic_ai'],
            pro: ['unlimited_projects', 'advanced_ai', 'priority_support', 'team_collaboration'],
            enterprise: ['unlimited_projects', 'advanced_ai', 'priority_support', 'team_collaboration', 'custom_integrations', 'dedicated_support', 'advanced_analytics']
        };
        
        return features[plan] || features.free;
    }
    
    // Update UI based on plan
    updateUIForPlan(plan) {
        // Hide/show features based on plan
        const features = this.getPlanFeatures(plan);
        
        // Update project limits
        if (features.includes('unlimited_projects')) {
            document.querySelector('.project-limit').style.display = 'none';
        }
        
        // Update AI features
        if (features.includes('advanced_ai')) {
            document.querySelector('.advanced-ai').style.display = 'block';
        }
        
        // Update support options
        if (features.includes('priority_support')) {
            document.querySelector('.priority-support').style.display = 'block';
        }
    }
    
    // Load subscriptions from localStorage
    loadSubscriptions() {
        const stored = localStorage.getItem('projectflow_subscriptions');
        return stored ? JSON.parse(stored) : {};
    }
    
    // Save subscriptions to localStorage
    saveSubscriptions() {
        localStorage.setItem('projectflow_subscriptions', JSON.stringify(this.subscriptions));
    }
}

// Initialize subscription manager
const subscriptionManager = new SubscriptionManager();
```

## Step 3: Subscription Payment Handling

Maria implemented comprehensive payment handling for subscriptions:

```javascript
// Handle subscription payments
function handleSubscriptionPayment(plan, amount) {
    window.NanoPay.open({
        title: `ProjectFlow ${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        amount: amount,
        address: 'nano_1maria1234567890abcdefghijklmnopqrstuvwxyz',
        description: `Monthly subscription to ${plan} plan`,
        contact: true, // Collect email for subscription management
        success: function(block) {
            console.log('Subscription payment successful:', block);
            
            // Grant subscription access
            const email = block.email || prompt('Please enter your email for subscription management:');
            subscriptionManager.grantSubscription(email, plan);
            
            // Show success message
            showSubscriptionSuccess(plan, block.block.hash);
            
            // Track subscription
            trackSubscription(plan, amount, email);
            
            // Send confirmation email
            sendSubscriptionConfirmation(email, plan);
        },
        cancel: function() {
            console.log('Subscription payment cancelled');
            showSubscriptionCancelled();
        },
        expired: function() {
            console.log('Subscription payment expired');
            showSubscriptionExpired();
        }
    });
}

// Show subscription success
function showSubscriptionSuccess(plan, hash) {
    const successModal = document.createElement('div');
    successModal.className = 'subscription-success-modal';
    successModal.innerHTML = `
        <div class="modal-content">
            <h2>🎉 Subscription Activated!</h2>
            <p>Welcome to ProjectFlow ${plan.charAt(0).toUpperCase() + plan.slice(1)}!</p>
            <p>Your subscription is now active. You can access all ${plan} features.</p>
            <p><strong>Transaction Hash:</strong> ${hash}</p>
            <button onclick="this.parentElement.parentElement.remove()">Continue</button>
        </div>
    `;
    document.body.appendChild(successModal);
}
```

## Step 4: Advanced Subscription Features

Maria added advanced features like usage tracking and renewal reminders:

```javascript
// Usage tracking for subscription limits
class UsageTracker {
    constructor() {
        this.usage = this.loadUsage();
    }
    
    // Track feature usage
    trackUsage(email, feature) {
        if (!this.usage[email]) {
            this.usage[email] = {};
        }
        
        if (!this.usage[email][feature]) {
            this.usage[email][feature] = 0;
        }
        
        this.usage[email][feature]++;
        this.saveUsage();
        
        // Check if user has exceeded limits
        this.checkLimits(email, feature);
    }
    
    // Check if user can use feature
    canUseFeature(email, feature) {
        const plan = subscriptionManager.getCurrentPlan(email);
        const limits = this.getFeatureLimits(plan);
        
        if (limits[feature] === 'unlimited') {
            return true;
        }
        
        const currentUsage = this.usage[email]?.[feature] || 0;
        return currentUsage < limits[feature];
    }
    
    // Get feature limits by plan
    getFeatureLimits(plan) {
        const limits = {
            free: {
                projects: 3,
                ai_insights: 10,
                team_members: 1
            },
            pro: {
                projects: 'unlimited',
                ai_insights: 'unlimited',
                team_members: 10
            },
            enterprise: {
                projects: 'unlimited',
                ai_insights: 'unlimited',
                team_members: 'unlimited'
            }
        };
        
        return limits[plan] || limits.free;
    }
    
    // Check limits and show upgrade prompt if needed
    checkLimits(email, feature) {
        if (!this.canUseFeature(email, feature)) {
            this.showUpgradePrompt(feature);
        }
    }
    
    // Show upgrade prompt
    showUpgradePrompt(feature) {
        const upgradeModal = document.createElement('div');
        upgradeModal.className = 'upgrade-prompt-modal';
        upgradeModal.innerHTML = `
            <div class="modal-content">
                <h2>Upgrade Required</h2>
                <p>You've reached the limit for ${feature} on your current plan.</p>
                <p>Upgrade to Pro or Enterprise to continue using this feature.</p>
                <div class="upgrade-options">
                    <button onclick="handleSubscriptionPayment('pro', 10)">Upgrade to Pro</button>
                    <button onclick="handleSubscriptionPayment('enterprise', 50)">Upgrade to Enterprise</button>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Maybe Later</button>
            </div>
        `;
        document.body.appendChild(upgradeModal);
    }
    
    // Load usage from localStorage
    loadUsage() {
        const stored = localStorage.getItem('projectflow_usage');
        return stored ? JSON.parse(stored) : {};
    }
    
    // Save usage to localStorage
    saveUsage() {
        localStorage.setItem('projectflow_usage', JSON.stringify(this.usage));
    }
}

// Initialize usage tracker
const usageTracker = new UsageTracker();
```

## Step 5: Subscription Renewal System

Maria implemented a renewal reminder system:

```javascript
// Subscription renewal management
class RenewalManager {
    constructor() {
        this.renewalReminders = this.loadRenewalReminders();
        this.checkRenewals();
    }
    
    // Check for subscriptions nearing expiration
    checkRenewals() {
        const subscriptions = subscriptionManager.subscriptions;
        const now = new Date();
        
        Object.keys(subscriptions).forEach(email => {
            const subscription = subscriptions[email];
            const endDate = new Date(subscription.endDate);
            const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
            
            // Send renewal reminder if subscription expires in 7 days
            if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
                this.sendRenewalReminder(email, subscription, daysUntilExpiry);
            }
            
            // Mark as expired if past end date
            if (daysUntilExpiry <= 0) {
                this.expireSubscription(email);
            }
        });
    }
    
    // Send renewal reminder
    sendRenewalReminder(email, subscription, daysLeft) {
        if (this.renewalReminders[email]) {
            return; // Already sent reminder
        }
        
        this.renewalReminders[email] = true;
        this.saveRenewalReminders();
        
        // Show renewal reminder in UI
        this.showRenewalReminder(subscription, daysLeft);
        
        // Send email reminder (if email service available)
        this.sendRenewalEmail(email, subscription, daysLeft);
    }
    
    // Show renewal reminder in UI
    showRenewalReminder(subscription, daysLeft) {
        const reminderBanner = document.createElement('div');
        reminderBanner.className = 'renewal-reminder-banner';
        reminderBanner.innerHTML = `
            <div class="banner-content">
                <span>⚠️ Your ${subscription.plan} subscription expires in ${daysLeft} days</span>
                <button onclick="handleSubscriptionPayment('${subscription.plan}', ${this.getPlanPrice(subscription.plan)})">Renew Now</button>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.insertBefore(reminderBanner, document.body.firstChild);
    }
    
    // Get plan price
    getPlanPrice(plan) {
        const prices = {
            pro: 10,
            enterprise: 50
        };
        return prices[plan] || 0;
    }
    
    // Expire subscription
    expireSubscription(email) {
        const subscription = subscriptionManager.subscriptions[email];
        if (subscription) {
            subscription.status = 'expired';
            subscriptionManager.saveSubscriptions();
            
            // Show expiration notice
            this.showExpirationNotice(email);
            
            // Downgrade to free plan
            subscriptionManager.updateUIForPlan('free');
        }
    }
    
    // Show expiration notice
    showExpirationNotice(email) {
        const expirationModal = document.createElement('div');
        expirationModal.className = 'expiration-notice-modal';
        expirationModal.innerHTML = `
            <div class="modal-content">
                <h2>Subscription Expired</h2>
                <p>Your subscription has expired. You've been moved to the free plan.</p>
                <p>Subscribe again to regain access to premium features.</p>
                <div class="subscription-options">
                    <button onclick="handleSubscriptionPayment('pro', 10)">Resubscribe to Pro</button>
                    <button onclick="handleSubscriptionPayment('enterprise', 50)">Resubscribe to Enterprise</button>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Continue with Free Plan</button>
            </div>
        `;
        document.body.appendChild(expirationModal);
    }
    
    // Load renewal reminders from localStorage
    loadRenewalReminders() {
        const stored = localStorage.getItem('projectflow_renewal_reminders');
        return stored ? JSON.parse(stored) : {};
    }
    
    // Save renewal reminders to localStorage
    saveRenewalReminders() {
        localStorage.setItem('projectflow_renewal_reminders', JSON.stringify(this.renewalReminders));
    }
}

// Initialize renewal manager
const renewalManager = new RenewalManager();
```

## Step 6: SaaS Analytics and Monitoring

Maria implemented comprehensive analytics for her SaaS:

```javascript
// SaaS analytics and monitoring
class SaaSAnalytics {
    constructor() {
        this.analytics = this.loadAnalytics();
    }
    
    // Track subscription events
    trackSubscriptionEvent(event, data = {}) {
        const eventData = {
            event: event,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            ...data
        };
        
        this.analytics.events.push(eventData);
        this.saveAnalytics();
        
        // Send to analytics service
        this.sendToAnalyticsService(eventData);
    }
    
    // Track subscription conversion
    trackSubscriptionConversion(plan, amount, email) {
        this.trackSubscriptionEvent('subscription_conversion', {
            plan: plan,
            amount: amount,
            email: email
        });
        
        // Update conversion metrics
        this.updateConversionMetrics(plan, amount);
    }
    
    // Track feature usage
    trackFeatureUsage(feature, email) {
        this.trackSubscriptionEvent('feature_usage', {
            feature: feature,
            email: email
        });
    }
    
    // Track churn (subscription cancellation)
    trackChurn(email, plan, reason) {
        this.trackSubscriptionEvent('churn', {
            email: email,
            plan: plan,
            reason: reason
        });
    }
    
    // Get subscription metrics
    getSubscriptionMetrics() {
        const events = this.analytics.events;
        const conversions = events.filter(e => e.event === 'subscription_conversion');
        const churns = events.filter(e => e.event === 'churn');
        
        return {
            totalConversions: conversions.length,
            totalChurns: churns.length,
            conversionRate: conversions.length / (conversions.length + churns.length),
            revenue: conversions.reduce((sum, c) => sum + c.amount, 0),
            averageRevenuePerUser: conversions.reduce((sum, c) => sum + c.amount, 0) / conversions.length
        };
    }
    
    // Send to analytics service
    sendToAnalyticsService(eventData) {
        // Send to your analytics service
        fetch('/api/analytics/saas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        }).catch(error => {
            console.error('Analytics error:', error);
        });
    }
    
    // Load analytics from localStorage
    loadAnalytics() {
        const stored = localStorage.getItem('projectflow_analytics');
        return stored ? JSON.parse(stored) : { events: [] };
    }
    
    // Save analytics to localStorage
    saveAnalytics() {
        localStorage.setItem('projectflow_analytics', JSON.stringify(this.analytics));
    }
}

// Initialize analytics
const saasAnalytics = new SaaSAnalytics();
```

## Real Results: Maria's SaaS Success Story

After implementing NanoPay.js subscriptions, Maria achieved impressive results:

### Revenue Growth
- **$3,600 monthly recurring revenue**: From 72 Pro subscribers and 12 Enterprise subscribers
- **Zero payment processing fees**: Saved $1,200+ annually vs. traditional processors
- **95% payment success rate**: Higher than traditional payment methods

### User Experience
- **Instant access**: No waiting for payment processing
- **Global accessibility**: Customers from 25+ countries
- **Simplified onboarding**: No complex payment forms

### Technical Benefits
- **Reduced complexity**: No PCI compliance or payment infrastructure
- **Better reliability**: No payment processor downtime
- **Easier maintenance**: Simpler subscription management

## Advanced SaaS Features

### Annual Subscription Discounts
```javascript
// Offer annual subscriptions with discount
function createAnnualSubscription(plan) {
    const monthlyPrice = subscriptionManager.getPlanPrice(plan);
    const annualPrice = Math.round(monthlyPrice * 10); // 2 months free
    
    window.NanoPay.open({
        title: `ProjectFlow ${plan.charAt(0).toUpperCase() + plan.slice(1)} - Annual Subscription`,
        amount: annualPrice,
        address: 'nano_1maria1234567890abcdefghijklmnopqrstuvwxyz',
        description: `Annual subscription to ${plan} plan (2 months free!)`,
        contact: true,
        success: function(block) {
            const email = block.email;
            subscriptionManager.grantSubscription(email, plan, 365); // 1 year
            saasAnalytics.trackSubscriptionConversion(plan, annualPrice, email);
        }
    });
}
```

### Team Subscriptions
```javascript
// Team subscription management
class TeamSubscriptionManager {
    constructor() {
        this.teams = this.loadTeams();
    }
    
    // Create team subscription
    createTeamSubscription(teamName, plan, memberEmails) {
        const team = {
            name: teamName,
            plan: plan,
            members: memberEmails,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        };
        
        this.teams[teamName] = team;
        this.saveTeams();
        
        return team;
    }
    
    // Add member to team
    addTeamMember(teamName, email) {
        const team = this.teams[teamName];
        if (team && !team.members.includes(email)) {
            team.members.push(email);
            this.saveTeams();
        }
    }
    
    // Check if user is team member
    isTeamMember(email) {
        return Object.values(this.teams).some(team => 
            team.members.includes(email) && team.status === 'active'
        );
    }
}
```

## Key Takeaways

1. **Start Simple**: Begin with basic subscription tiers, then add complexity
2. **Track Everything**: Use analytics to optimize conversion and retention
3. **Handle Renewals**: Implement reminder systems for subscription renewals
4. **Mobile First**: Ensure perfect mobile experience for subscriptions
5. **Test Pricing**: Experiment with different price points and plans

## Common SaaS Pitfalls to Avoid

- **Over-complicating pricing**: Start with 2-3 clear tiers
- **Ignoring churn**: Track and analyze subscription cancellations
- **Poor onboarding**: Guide users through subscription benefits
- **No renewal reminders**: Users forget to renew subscriptions
- **Complex payment flows**: Keep subscription signup simple

## Next Steps

Maria's SaaS now has a solid subscription foundation. She's planning to:
- Add usage-based billing for API calls
- Implement referral programs for subscribers
- Create enterprise features for large teams

## Resources

- [NanoPay.js Documentation](/nanopay.html)
- [Subscription Management Examples](/nanopay.html#programmatic-usage)
- [Nano Wallet Setup](/wallet.html)

---

*Ready to build your SaaS with NanoPay.js? Start with a simple subscription model and scale from there. The future of SaaS monetization is here!*
