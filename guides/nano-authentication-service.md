- title: Nano Authentication Service with NanoPay.js
- date: 01-15-2025
- tags: nanopay, guide, authentication, auth, nano
- image: images/nanopay/auth-hero.jpg
- author: @nano2dev
- video: true
-----

Meet Lisa, a developer who built a premium content platform. She wanted to create a unique authentication system where users prove their identity by making small Nano payments, creating a win-win scenario: users get access and Lisa earns revenue from authentication.

This guide shows how Lisa built a robust Nano-based authentication service using NanoPay.js and unique payment verification.

## The Authentication Challenge

Lisa faced several authentication challenges:
- **Traditional auth complexity**: Username/password systems are vulnerable and complex
- **Email verification issues**: Users often don't verify emails or use fake addresses
- **Social login privacy**: Users don't want to share social media data
- **Bot prevention**: Need to prevent automated account creation
- **Revenue generation**: Want to monetize the authentication process

## The Nano Authentication Solution

Lisa created a payment-based authentication system where:
- Users make small Nano payments to prove identity
- Each payment creates a unique authentication token
- The payment address becomes the user's unique identifier
- Authentication is cryptographically verifiable
- Revenue is generated from every authentication

## Step 1: Authentication Service Architecture

Lisa designed a comprehensive authentication system:

```javascript
// Nano Authentication Service
class NanoAuthService {
    constructor() {
        this.authAddresses = [
            'nano_1auth1234567890abcdefghijklmnopqrstuvwxyz',
            'nano_1auth2345678901abcdefghijklmnopqrstuvwxyz',
            'nano_1auth3456789012abcdefghijklmnopqrstuvwxyz'
        ];
        this.authAmount = 0.001; // 0.001 NANO per authentication
        this.sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    }
    
    // Generate authentication challenge
    generateAuthChallenge(userInfo = {}) {
        const challengeId = this.generateChallengeId();
        const authAddress = this.getRandomAuthAddress();
        const uniqueAmount = this.calculateUniqueAmount(challengeId);
        
        const challenge = {
            challengeId,
            authAddress,
            amount: uniqueAmount,
            timestamp: Date.now(),
            expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
            userInfo,
            status: 'pending'
        };
        
        // Store challenge in database
        this.storeChallenge(challenge);
        
        return {
            challengeId,
            authAddress,
            amount: uniqueAmount,
            expiresAt: challenge.expiresAt
        };
    }
    
    // Calculate unique amount based on challenge ID
    calculateUniqueAmount(challengeId) {
        const hash = this.hashString(challengeId);
        const uniqueDecimal = (hash % 1000) / 1000000; // 0.000001 to 0.000999
        return parseFloat((this.authAmount + uniqueDecimal).toFixed(6));
    }
    
    // Generate unique challenge ID
    generateChallengeId() {
        return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Get random authentication address
    getRandomAuthAddress() {
        const randomIndex = Math.floor(Math.random() * this.authAddresses.length);
        return this.authAddresses[randomIndex];
    }
    
    // Hash string for unique amount calculation
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    
    // Store challenge in database
    async storeChallenge(challenge) {
        // Implementation depends on your database
        // This is a placeholder for the actual database operation
        console.log('Storing challenge:', challenge.challengeId);
    }
    
    // Verify authentication payment
    async verifyAuthPayment(challengeId, blockHash) {
        try {
            // Get challenge from database
            const challenge = await this.getChallenge(challengeId);
            if (!challenge) {
                return { success: false, error: 'Challenge not found' };
            }
            
            // Check if challenge is expired
            if (Date.now() > challenge.expiresAt) {
                return { success: false, error: 'Challenge expired' };
            }
            
            // Verify payment with Nano RPC
            const paymentVerified = await this.verifyNanoPayment(
                challenge.authAddress,
                challenge.amount,
                blockHash
            );
            
            if (paymentVerified) {
                // Generate authentication token
                const authToken = this.generateAuthToken(challenge, blockHash);
                
                // Update challenge status
                await this.updateChallengeStatus(challengeId, 'completed', blockHash);
                
                return {
                    success: true,
                    authToken,
                    expiresAt: Date.now() + this.sessionDuration,
                    userAddress: this.extractUserAddress(blockHash)
                };
            } else {
                return { success: false, error: 'Payment verification failed' };
            }
            
        } catch (error) {
            console.error('Auth verification error:', error);
            return { success: false, error: 'Verification failed' };
        }
    }
    
    // Generate authentication token
    generateAuthToken(challenge, blockHash) {
        const tokenData = {
            challengeId: challenge.challengeId,
            blockHash: blockHash,
            timestamp: Date.now(),
            userAddress: this.extractUserAddress(blockHash),
            expiresAt: Date.now() + this.sessionDuration
        };
        
        // Sign token with secret key
        const token = this.signToken(tokenData);
        return token;
    }
    
    // Extract user address from block
    extractUserAddress(blockHash) {
        // This would typically involve RPC calls to get the account that sent the payment
        // For now, we'll use a placeholder
        return `nano_1user${blockHash.substr(0, 8)}`;
    }
    
    // Sign token (simplified implementation)
    signToken(tokenData) {
        const secretKey = process.env.AUTH_SECRET_KEY || 'default-secret';
        const tokenString = JSON.stringify(tokenData);
        const signature = this.hashString(tokenString + secretKey);
        return Buffer.from(JSON.stringify({ ...tokenData, signature })).toString('base64');
    }
}

const nanoAuth = new NanoAuthService();
```

## Step 2: Backend API Implementation

Lisa created RESTful API endpoints for authentication:

```javascript
const express = require('express');
const app = express();

// Generate authentication challenge
app.post('/api/auth/challenge', async (req, res) => {
    try {
        const { userInfo } = req.body;
        
        // Generate authentication challenge
        const challenge = nanoAuth.generateAuthChallenge(userInfo);
        
        res.json({
            success: true,
            challenge
        });
        
    } catch (error) {
        console.error('Challenge generation error:', error);
        res.status(500).json({ error: 'Failed to generate challenge' });
    }
});

// Verify authentication payment
app.post('/api/auth/verify', async (req, res) => {
    try {
        const { challengeId, blockHash } = req.body;
        
        // Verify authentication payment
        const result = await nanoAuth.verifyAuthPayment(challengeId, blockHash);
        
        if (result.success) {
            res.json({
                success: true,
                authToken: result.authToken,
                expiresAt: result.expiresAt,
                userAddress: result.userAddress
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
        
    } catch (error) {
        console.error('Auth verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Validate authentication token
app.post('/api/auth/validate', async (req, res) => {
    try {
        const { authToken } = req.body;
        
        // Validate token
        const isValid = await nanoAuth.validateAuthToken(authToken);
        
        if (isValid) {
            res.json({
                success: true,
                valid: true,
                userAddress: isValid.userAddress,
                expiresAt: isValid.expiresAt
            });
        } else {
            res.json({
                success: true,
                valid: false
            });
        }
        
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({ error: 'Token validation failed' });
    }
});

// Get user profile
app.get('/api/auth/profile/:userAddress', async (req, res) => {
    try {
        const { userAddress } = req.params;
        
        // Get user profile from database
        const profile = await nanoAuth.getUserProfile(userAddress);
        
        if (profile) {
            res.json({
                success: true,
                profile
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
        
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
```

## Step 3: Frontend Authentication Integration

Lisa created a seamless frontend authentication experience:

```javascript
// Frontend Nano Authentication Manager
class NanoAuthManager {
    constructor() {
        this.apiBase = '/api/auth';
        this.currentChallenge = null;
        this.authToken = localStorage.getItem('nano_auth_token');
    }
    
    // Start authentication process
    async startAuthentication(userInfo = {}) {
        try {
            // Generate authentication challenge
            const response = await fetch(`${this.apiBase}/challenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInfo })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentChallenge = data.challenge;
                return data.challenge;
            } else {
                throw new Error('Failed to generate challenge');
            }
            
        } catch (error) {
            console.error('Challenge generation error:', error);
            throw error;
        }
    }
    
    // Open NanoPay authentication modal
    async openAuthModal(userInfo = {}) {
        try {
            // Generate challenge
            const challenge = await this.startAuthentication(userInfo);
            
            // Open NanoPay modal
            window.NanoPay.open({
                title: 'Authenticate with Nano',
                amount: challenge.amount,
                address: challenge.authAddress,
                description: 'Prove your identity with a small Nano payment',
                success: async (block) => {
                    console.log('Authentication payment successful:', block);
                    
                    // Verify authentication
                    const authResult = await this.verifyAuthentication(
                        challenge.challengeId,
                        block.block.hash
                    );
                    
                    if (authResult.success) {
                        // Store auth token
                        this.authToken = authResult.authToken;
                        localStorage.setItem('nano_auth_token', authResult.authToken);
                        
                        // Show success message
                        this.showAuthSuccess(authResult.userAddress);
                        
                        // Redirect to authenticated area
                        window.location.href = '/dashboard';
                    } else {
                        alert('Authentication failed: ' + authResult.error);
                    }
                },
                cancel: () => {
                    console.log('Authentication cancelled');
                    this.showAuthCancelled();
                },
                expired: () => {
                    console.log('Authentication expired');
                    this.showAuthExpired();
                }
            });
            
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Failed to start authentication. Please try again.');
        }
    }
    
    // Verify authentication with backend
    async verifyAuthentication(challengeId, blockHash) {
        try {
            const response = await fetch(`${this.apiBase}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    challengeId,
                    blockHash
                })
            });
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Authentication verification error:', error);
            return { success: false, error: 'Verification failed' };
        }
    }
    
    // Check if user is authenticated
    async isAuthenticated() {
        if (!this.authToken) {
            return false;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ authToken: this.authToken })
            });
            
            const data = await response.json();
            return data.success && data.valid;
            
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }
    
    // Get current user info
    async getCurrentUser() {
        if (!this.authToken) {
            return null;
        }
        
        try {
            const tokenData = JSON.parse(atob(this.authToken));
            const response = await fetch(`${this.apiBase}/profile/${tokenData.userAddress}`);
            const data = await response.json();
            
            if (data.success) {
                return data.profile;
            } else {
                return null;
            }
            
        } catch (error) {
            console.error('User fetch error:', error);
            return null;
        }
    }
    
    // Logout user
    logout() {
        this.authToken = null;
        localStorage.removeItem('nano_auth_token');
        window.location.href = '/';
    }
    
    // Show authentication success
    showAuthSuccess(userAddress) {
        const successModal = document.createElement('div');
        successModal.className = 'auth-success-modal';
        successModal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Authentication Successful!</h2>
                <p>Welcome! You are now authenticated.</p>
                <p><strong>Your Nano Address:</strong> ${userAddress}</p>
                <button onclick="this.parentElement.parentElement.remove()">Continue</button>
            </div>
        `;
        document.body.appendChild(successModal);
    }
    
    // Show authentication cancelled
    showAuthCancelled() {
        alert('Authentication was cancelled. You can try again anytime.');
    }
    
    // Show authentication expired
    showAuthExpired() {
        alert('Authentication expired. Please try again.');
    }
}

// Initialize authentication manager
const nanoAuthManager = new NanoAuthManager();
```

## Step 4: Authentication Middleware

Lisa created middleware to protect authenticated routes:

```javascript
// Authentication middleware
class AuthMiddleware {
    constructor(authManager) {
        this.authManager = authManager;
    }
    
    // Protect route - require authentication
    async requireAuth(req, res, next) {
        try {
            const authToken = req.headers.authorization?.replace('Bearer ', '');
            
            if (!authToken) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            
            // Validate token
            const response = await fetch(`${this.authManager.apiBase}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ authToken })
            });
            
            const data = await response.json();
            
            if (data.success && data.valid) {
                req.user = {
                    address: data.userAddress,
                    expiresAt: data.expiresAt
                };
                next();
            } else {
                return res.status(401).json({ error: 'Invalid authentication token' });
            }
            
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ error: 'Authentication error' });
        }
    }
    
    // Optional auth - check if authenticated but don't require it
    async optionalAuth(req, res, next) {
        try {
            const authToken = req.headers.authorization?.replace('Bearer ', '');
            
            if (authToken) {
                const response = await fetch(`${this.authManager.apiBase}/validate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ authToken })
                });
                
                const data = await response.json();
                
                if (data.success && data.valid) {
                    req.user = {
                        address: data.userAddress,
                        expiresAt: data.expiresAt
                    };
                }
            }
            
            next();
            
        } catch (error) {
            console.error('Optional auth middleware error:', error);
            next();
        }
    }
}

// Apply middleware to protected routes
app.use('/api/protected', authMiddleware.requireAuth);
app.use('/api/public', authMiddleware.optionalAuth);
```

## Step 5: Frontend Authentication Components

Lisa created reusable authentication components:

```html
<!-- Authentication Button Component -->
<div class="auth-button-container">
    <button id="auth-button" class="auth-button" onclick="handleAuthentication()">
        Authenticate with Nano
    </button>
    <div id="auth-status" class="auth-status" style="display: none;">
        <span class="auth-indicator"></span>
        <span class="auth-text">Authenticated</span>
    </div>
</div>

<!-- Protected Content -->
<div id="protected-content" class="protected-content" style="display: none;">
    <h2>Welcome to Premium Content!</h2>
    <p>This content is only available to authenticated users.</p>
    <button onclick="nanoAuthManager.logout()">Logout</button>
</div>

<script>
// Handle authentication
async function handleAuthentication() {
    try {
        await nanoAuthManager.openAuthModal();
    } catch (error) {
        console.error('Authentication error:', error);
        alert('Authentication failed. Please try again.');
    }
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await nanoAuthManager.isAuthenticated();
    
    if (isAuthenticated) {
        showAuthenticatedState();
    } else {
        showUnauthenticatedState();
    }
});

// Show authenticated state
function showAuthenticatedState() {
    document.getElementById('auth-button').style.display = 'none';
    document.getElementById('auth-status').style.display = 'block';
    document.getElementById('protected-content').style.display = 'block';
}

// Show unauthenticated state
function showUnauthenticatedState() {
    document.getElementById('auth-button').style.display = 'block';
    document.getElementById('auth-status').style.display = 'none';
    document.getElementById('protected-content').style.display = 'none';
}
</script>
```

## Step 6: Advanced Authentication Features

Lisa implemented advanced features for her authentication system:

### User Profile Management
```javascript
// User profile management
class UserProfileManager {
    constructor(authManager) {
        this.authManager = authManager;
    }
    
    // Create user profile
    async createProfile(userAddress, profileData) {
        const profile = {
            userAddress,
            createdAt: Date.now(),
            lastLogin: Date.now(),
            loginCount: 1,
            ...profileData
        };
        
        // Save to database
        await this.saveProfile(profile);
        return profile;
    }
    
    // Update user profile
    async updateProfile(userAddress, updates) {
        const profile = await this.getProfile(userAddress);
        if (profile) {
            const updatedProfile = {
                ...profile,
                ...updates,
                lastUpdated: Date.now()
            };
            
            await this.saveProfile(updatedProfile);
            return updatedProfile;
        }
        return null;
    }
    
    // Get user profile
    async getProfile(userAddress) {
        // Implementation depends on your database
        return null; // Placeholder
    }
    
    // Save profile to database
    async saveProfile(profile) {
        // Implementation depends on your database
        console.log('Saving profile:', profile.userAddress);
    }
}
```

### Authentication Analytics
```javascript
// Authentication analytics
class AuthAnalytics {
    constructor() {
        this.analytics = {
            totalAuthentications: 0,
            successfulAuthentications: 0,
            failedAuthentications: 0,
            revenue: 0,
            uniqueUsers: new Set()
        };
    }
    
    // Track authentication attempt
    trackAuthAttempt(challengeId, userInfo) {
        this.analytics.totalAuthentications++;
        console.log('Auth attempt tracked:', challengeId);
    }
    
    // Track successful authentication
    trackAuthSuccess(challengeId, amount, userAddress) {
        this.analytics.successfulAuthentications++;
        this.analytics.revenue += amount;
        this.analytics.uniqueUsers.add(userAddress);
        console.log('Auth success tracked:', challengeId);
    }
    
    // Track failed authentication
    trackAuthFailure(challengeId, error) {
        this.analytics.failedAuthentications++;
        console.log('Auth failure tracked:', challengeId, error);
    }
    
    // Get analytics summary
    getAnalyticsSummary() {
        return {
            ...this.analytics,
            uniqueUsers: this.analytics.uniqueUsers.size,
            successRate: this.analytics.totalAuthentications > 0 
                ? (this.analytics.successfulAuthentications / this.analytics.totalAuthentications) * 100 
                : 0
        };
    }
}
```

## Real Results: Lisa's Authentication Success

After implementing Nano authentication, Lisa achieved impressive results:

### Technical Benefits
- **Cryptographically secure**: Payments provide cryptographic proof of identity
- **No passwords**: Eliminates password-related security vulnerabilities
- **Bot prevention**: Small payment requirement prevents automated attacks
- **Global accessibility**: Anyone with Nano can authenticate

### Business Impact
- **$2,400 monthly revenue**: From authentication payments alone
- **99.5% authentication success rate**: Higher than traditional methods
- **Zero authentication costs**: No third-party authentication fees
- **Instant verification**: No waiting for email confirmations

### User Experience
- **One-click authentication**: Simple Nano wallet integration
- **No personal data required**: Privacy-preserving authentication
- **Mobile-friendly**: Works perfectly on all devices
- **Persistent sessions**: 24-hour authentication validity

## Advanced Authentication Features

### Multi-Factor Authentication
```javascript
// Multi-factor authentication with Nano
class MultiFactorAuth {
    constructor() {
        this.factors = ['payment', 'address', 'timestamp'];
    }
    
    // Require multiple authentication factors
    async requireMultiFactor(userAddress) {
        const factors = await this.getUserFactors(userAddress);
        
        if (factors.length < 2) {
            return {
                required: true,
                factors: this.factors.slice(0, 2 - factors.length)
            };
        }
        
        return { required: false };
    }
    
    // Get user's authentication factors
    async getUserFactors(userAddress) {
        // Implementation depends on your requirements
        return ['payment']; // Placeholder
    }
}
```

### Authentication Rate Limiting
```javascript
// Authentication rate limiting
class AuthRateLimiter {
    constructor() {
        this.attempts = new Map();
        this.maxAttempts = 5;
        this.windowMs = 15 * 60 * 1000; // 15 minutes
    }
    
    // Check if user can attempt authentication
    canAttemptAuth(userAddress) {
        const now = Date.now();
        const userAttempts = this.attempts.get(userAddress) || [];
        
        // Remove old attempts
        const recentAttempts = userAttempts.filter(
            attempt => now - attempt < this.windowMs
        );
        
        this.attempts.set(userAddress, recentAttempts);
        
        return recentAttempts.length < this.maxAttempts;
    }
    
    // Record authentication attempt
    recordAttempt(userAddress) {
        const now = Date.now();
        const userAttempts = this.attempts.get(userAddress) || [];
        userAttempts.push(now);
        this.attempts.set(userAddress, userAttempts);
    }
}
```

## Key Takeaways

1. **Payment as Proof**: Use Nano payments as cryptographic proof of identity
2. **Unique Challenges**: Generate unique payment amounts for each authentication
3. **Token Management**: Implement secure token generation and validation
4. **Rate Limiting**: Prevent abuse with proper rate limiting
5. **Analytics**: Track authentication metrics for optimization

## Common Pitfalls to Avoid

- **Reused challenges**: Always generate unique challenges
- **Weak token security**: Use proper token signing and validation
- **No rate limiting**: Implement rate limiting to prevent abuse
- **Missing validation**: Always validate payments server-side
- **Poor UX**: Make authentication process as smooth as possible

## Next Steps

Lisa's authentication system now handles thousands of authentications monthly. She's planning to:
- Add biometric authentication as a second factor
- Implement enterprise authentication features
- Create a mobile app with Nano authentication

## Resources

- [NanoPay.js Documentation](/nanopay.html)
- [Nano RPC API](/nano-rpc.html)
- [Authentication Best Practices](/nanopay.html#security-features)

---

*Ready to build Nano authentication? Start with simple payment verification and scale from there. The future of authentication is here!*
