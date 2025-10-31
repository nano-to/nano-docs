# Nano.to API Weekly Email Reports

This system provides professional weekly email reports for API users, tracking usage, performance metrics, and providing insights.

## Features

- **Comprehensive Usage Tracking**: RPC calls, work generation, free vs paid usage
- **Performance Metrics**: Success/error rates, uptime percentage
- **Professional Email Templates**: Clean, responsive HTML emails
- **Daily Breakdown**: Detailed daily usage statistics
- **Usage Insights**: Automated analysis and recommendations
- **Preview System**: Test email templates before sending

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm run server
   ```

3. **Preview Email Template**
   Visit: `http://localhost:3000/preview/weekly_email/user@example.com`

## API Endpoints

### Preview Email Template
```
GET /preview/weekly_email/:account_email
```
Preview what the weekly email report will look like for a specific user.

### Send Weekly Report
```
POST /api/send-weekly-report/:email
```
Send a weekly report to a specific user.

### Send Reports to All Users
```
POST /api/send-weekly-reports
```
Send weekly reports to all active users.

### Get Active Users
```
GET /api/active-users
```
Get a list of all active users (for admin purposes).

### Track Usage (Testing)
```
POST /api/track/:email
Body: { "action": "account_info", "creditsUsed": 0, "isError": false }
```
Simulate usage tracking for testing.

### Get Usage Data
```
GET /api/usage/:email
```
Get weekly usage data for a specific user.

## Email Configuration

To send actual emails, configure these environment variables:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@nano.to
```

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as `SMTP_PASS`

## Usage Data Structure

The system tracks the following metrics:

```json
{
  "user@example.com": {
    "credits": 91813,
    "plan": "prepaid",
    "usage": {
      "2024-12-15": {
        "account_info": 45,
        "account_history": 12,
        "receivable": 8,
        "work_generate": 23,
        "process": 15,
        "rpc_credits": 2,
        "errors": 3,
        "successes": 100,
        "free_usage": 85,
        "paid_usage": 15,
        "uptime_checks": 1,
        "response_times": {
          "avg_ms": 245,
          "max_ms": 1200,
          "min_ms": 89
        }
      }
    }
  }
}
```

## Email Report Contents

Each weekly report includes:

- **Credits Balance**: Current credit balance and plan type
- **Usage Summary**: Total RPC calls, work generation requests
- **Free vs Paid Usage**: Breakdown of included vs paid usage
- **Performance Metrics**: Success rate, error rate, uptime percentage
- **Daily Breakdown**: Day-by-day usage statistics
- **Usage Insights**: Automated analysis and recommendations
- **Action Buttons**: Links to manage credits and view documentation

## Integration with Your API Server

To integrate this with your actual API server:

1. **Replace Mock Data**: Update the `UsageTracker` class to read from your actual usage database
2. **Add Usage Tracking**: Call `usageTracker.trackUsage()` in your API endpoints
3. **Configure Email**: Set up SMTP credentials for production email sending
4. **Schedule Reports**: Set up a cron job to send weekly reports automatically

### Example Integration

```javascript
// In your API server
const { usageTracker } = require('./server');

// Track usage on each API call
app.post('/rpc', (req, res) => {
  const { action, key } = req.body;
  
  // Your existing API logic here...
  
  // Track usage
  const email = getUserEmailFromKey(key);
  const creditsUsed = getCreditsForAction(action);
  const isError = !res.success;
  
  usageTracker.trackUsage(email, action, creditsUsed, isError);
  
  res.json(response);
});
```

## Automated Weekly Reports

Set up a cron job to send weekly reports every Monday:

```bash
# Add to crontab
0 9 * * 1 curl -X POST http://localhost:3000/api/send-weekly-reports
```

## Customization

### Email Template
Modify `email-service.js` to customize:
- Colors and styling
- Additional metrics
- Insight algorithms
- Call-to-action buttons

### Usage Tracking
Extend `UsageTracker` class to:
- Add new metrics
- Integrate with your database
- Add real-time tracking
- Implement rate limiting

## Testing

1. **Preview Templates**: Use the preview endpoint to see how emails look
2. **Test Tracking**: Use the track endpoint to simulate usage
3. **Send Test Emails**: Use the send endpoints to test email delivery

## Production Deployment

1. **Environment Variables**: Set up SMTP credentials
2. **Database Integration**: Replace file-based storage with your database
3. **Monitoring**: Add logging and error monitoring
4. **Scaling**: Consider using a queue system for bulk email sending

## Support

For questions or issues:
- Email: support@nano.to
- Documentation: https://docs.nano.to
- GitHub Issues: [Create an issue](https://github.com/nano-to/nano-docs/issues)

