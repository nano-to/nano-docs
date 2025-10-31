const express = require('express');
const fs = require('fs');
const path = require('path');
const EmailService = require('./email-service');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('docs'));

// Mock data for demonstration - in production this would come from your actual API server
const mockUsageData = {
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
        "successes": 100
      },
      "2024-12-14": {
        "account_info": 38,
        "account_history": 9,
        "receivable": 6,
        "work_generate": 18,
        "process": 12,
        "rpc_credits": 1,
        "errors": 2,
        "successes": 86
      },
      "2024-12-13": {
        "account_info": 52,
        "account_history": 15,
        "receivable": 11,
        "work_generate": 31,
        "process": 19,
        "rpc_credits": 3,
        "errors": 4,
        "successes": 132
      },
      "2024-12-12": {
        "account_info": 41,
        "account_history": 13,
        "receivable": 7,
        "work_generate": 25,
        "process": 16,
        "rpc_credits": 2,
        "errors": 2,
        "successes": 104
      },
      "2024-12-11": {
        "account_info": 47,
        "account_history": 11,
        "receivable": 9,
        "work_generate": 28,
        "process": 14,
        "rpc_credits": 2,
        "errors": 3,
        "successes": 109
      },
      "2024-12-10": {
        "account_info": 39,
        "account_history": 8,
        "receivable": 5,
        "work_generate": 20,
        "process": 11,
        "rpc_credits": 1,
        "errors": 1,
        "successes": 84
      },
      "2024-12-09": {
        "account_info": 44,
        "account_history": 14,
        "receivable": 10,
        "work_generate": 26,
        "process": 17,
        "rpc_credits": 3,
        "errors": 2,
        "successes": 111
      }
    }
  }
};

// Usage tracking service
class UsageTracker {
  constructor() {
    this.usageFile = path.join(__dirname, 'usage.json');
    this.loadUsage();
  }

  loadUsage() {
    try {
      if (fs.existsSync(this.usageFile)) {
        this.usage = JSON.parse(fs.readFileSync(this.usageFile, 'utf8'));
      } else {
        this.usage = {};
        this.saveUsage();
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
      this.usage = {};
    }
  }

  saveUsage() {
    try {
      fs.writeFileSync(this.usageFile, JSON.stringify(this.usage, null, 2));
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  }

  trackUsage(email, action, creditsUsed = 0, isError = false) {
    if (!this.usage[email]) {
      this.usage[email] = {
        credits: 0,
        plan: 'free',
        usage: {}
      };
    }

    const today = new Date().toISOString().split('T')[0];
    if (!this.usage[email].usage[today]) {
      this.usage[email].usage[today] = {
        account_info: 0,
        account_history: 0,
        receivable: 0,
        work_generate: 0,
        process: 0,
        rpc_credits: 0,
        errors: 0,
        successes: 0,
        free_usage: 0,
        paid_usage: 0
      };
    }

    // Increment usage counters
    if (this.usage[email].usage[today][action] !== undefined) {
      this.usage[email].usage[today][action]++;
    }

    if (isError) {
      this.usage[email].usage[today].errors++;
    } else {
      this.usage[email].usage[today].successes++;
    }

    // Track free vs paid usage
    if (creditsUsed > 0) {
      this.usage[email].usage[today].paid_usage += creditsUsed;
      this.usage[email].credits -= creditsUsed;
    } else {
      this.usage[email].usage[today].free_usage++;
    }

    this.saveUsage();
  }

  getWeeklyUsage(email) {
    const userData = this.usage[email] || mockUsageData[email];
    if (!userData) return null;

    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyUsage = {
      credits: userData.credits,
      plan: userData.plan,
      totalRpcUsage: 0,
      totalWorkGenerateUsage: 0,
      totalFreeUsage: 0,
      totalPaidUsage: 0,
      totalErrors: 0,
      totalSuccesses: 0,
      dailyBreakdown: [],
      errorRate: 0,
      successRate: 0,
      uptimePercentage: 0
    };

    // Calculate totals for the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayUsage = userData.usage[dateStr] || {};

      const dailyTotal = {
        date: dateStr,
        rpcUsage: (dayUsage.account_info || 0) + (dayUsage.account_history || 0) + (dayUsage.receivable || 0) + (dayUsage.process || 0),
        workGenerateUsage: dayUsage.work_generate || 0,
        freeUsage: dayUsage.free_usage || 0,
        paidUsage: dayUsage.paid_usage || 0,
        errors: dayUsage.errors || 0,
        successes: dayUsage.successes || 0
      };

      weeklyUsage.totalRpcUsage += dailyTotal.rpcUsage;
      weeklyUsage.totalWorkGenerateUsage += dailyTotal.workGenerateUsage;
      weeklyUsage.totalFreeUsage += dailyTotal.freeUsage;
      weeklyUsage.totalPaidUsage += dailyTotal.paidUsage;
      weeklyUsage.totalErrors += dailyTotal.errors;
      weeklyUsage.totalSuccesses += dailyTotal.successes;

      weeklyUsage.dailyBreakdown.unshift(dailyTotal);
    }

    // Calculate rates
    const totalRequests = weeklyUsage.totalErrors + weeklyUsage.totalSuccesses;
    if (totalRequests > 0) {
      weeklyUsage.errorRate = ((weeklyUsage.totalErrors / totalRequests) * 100).toFixed(2);
      weeklyUsage.successRate = ((weeklyUsage.totalSuccesses / totalRequests) * 100).toFixed(2);
      weeklyUsage.uptimePercentage = weeklyUsage.successRate;
    }

    return weeklyUsage;
  }
}

const usageTracker = new UsageTracker();
const emailService = new EmailService();

// Email template service
class EmailTemplateService {
  generateWeeklyReportHTML(email, usageData) {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const weekEnd = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly API Usage Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            border-left: 4px solid #667eea;
        }
        .stat-card h3 {
            margin: 0 0 10px 0;
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-card .value {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin: 0;
        }
        .stat-card .label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .section {
            margin: 30px 0;
        }
        .section h2 {
            color: #333;
            font-size: 20px;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .daily-breakdown {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
        }
        .daily-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .daily-item:last-child {
            border-bottom: none;
        }
        .daily-date {
            font-weight: 600;
            color: #333;
        }
        .daily-stats {
            display: flex;
            gap: 15px;
            font-size: 14px;
            color: #666;
        }
        .credits-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .credits-info h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        .credits-info .credits-amount {
            font-size: 36px;
            font-weight: 700;
            margin: 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .uptime-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .uptime-excellent { background-color: #28a745; }
        .uptime-good { background-color: #ffc107; }
        .uptime-poor { background-color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Weekly API Report</h1>
            <p>${weekStart} - ${weekEnd}, ${new Date().getFullYear()}</p>
        </div>
        
        <div class="content">
            <div class="credits-info">
                <h3>Current Credits Balance</h3>
                <p class="credits-amount">${usageData.credits.toLocaleString()}</p>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Plan: ${usageData.plan.charAt(0).toUpperCase() + usageData.plan.slice(1)}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>RPC Calls</h3>
                    <p class="value">${usageData.totalRpcUsage.toLocaleString()}</p>
                    <p class="label">Total this week</p>
                </div>
                
                <div class="stat-card">
                    <h3>Work Generate</h3>
                    <p class="value">${usageData.totalWorkGenerateUsage.toLocaleString()}</p>
                    <p class="label">PoW requests</p>
                </div>
                
                <div class="stat-card">
                    <h3>Free Usage</h3>
                    <p class="value">${usageData.totalFreeUsage.toLocaleString()}</p>
                    <p class="label">Included calls</p>
                </div>
                
                <div class="stat-card">
                    <h3>Paid Usage</h3>
                    <p class="value">${usageData.totalPaidUsage.toLocaleString()}</p>
                    <p class="label">Credits consumed</p>
                </div>
            </div>

            <div class="section">
                <h2>📈 Performance Metrics</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Success Rate</h3>
                        <p class="value">${usageData.successRate}%</p>
                        <p class="label">API calls succeeded</p>
                    </div>
                    
                    <div class="stat-card">
                        <h3>Error Rate</h3>
                        <p class="value">${usageData.errorRate}%</p>
                        <p class="label">API calls failed</p>
                    </div>
                    
                    <div class="stat-card">
                        <h3>Uptime</h3>
                        <p class="value">
                            <span class="uptime-indicator ${usageData.uptimePercentage >= 99 ? 'uptime-excellent' : usageData.uptimePercentage >= 95 ? 'uptime-good' : 'uptime-poor'}"></span>
                            ${usageData.uptimePercentage}%
                        </p>
                        <p class="label">Service availability</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>📅 Daily Breakdown</h2>
                <div class="daily-breakdown">
                    ${usageData.dailyBreakdown.map(day => `
                        <div class="daily-item">
                            <div class="daily-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div class="daily-stats">
                                <span>RPC: ${day.rpcUsage}</span>
                                <span>PoW: ${day.workGenerateUsage}</span>
                                <span>Free: ${day.freeUsage}</span>
                                <span>Paid: ${day.paidUsage}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>This report covers your API usage from ${weekStart} to ${weekEnd}.</p>
            <p>Questions? Contact us at <a href="mailto:support@nano.to">support@nano.to</a></p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                Generated on ${currentDate} • Nano.to API Services
            </p>
        </div>
    </div>
</body>
</html>`;
  }
}

const emailTemplateService = new EmailTemplateService();

// Routes
app.get('/preview/weekly_email/:account_email', (req, res) => {
  const { account_email } = req.params;
  
  try {
    const usageData = usageTracker.getWeeklyUsage(account_email);
    
    if (!usageData) {
      return res.status(404).json({ 
        error: 'No usage data found for this email address' 
      });
    }

    const html = emailService.generateWeeklyReportHTML(account_email, usageData);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating email preview:', error);
    res.status(500).json({ error: 'Failed to generate email preview' });
  }
});

// API endpoint to get usage data (for testing)
app.get('/api/usage/:email', (req, res) => {
  const { email } = req.params;
  const usageData = usageTracker.getWeeklyUsage(email);
  
  if (!usageData) {
    return res.status(404).json({ error: 'No usage data found' });
  }
  
  res.json(usageData);
});

// API endpoint to simulate usage tracking (for testing)
app.post('/api/track/:email', (req, res) => {
  const { email } = req.params;
  const { action, creditsUsed = 0, isError = false } = req.body;
  
  usageTracker.trackUsage(email, action, creditsUsed, isError);
  
  res.json({ success: true, message: 'Usage tracked successfully' });
});

// Send weekly report to specific user
app.post('/api/send-weekly-report/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    const usageData = usageTracker.getWeeklyUsage(email);
    
    if (!usageData) {
      return res.status(404).json({ 
        error: 'No usage data found for this email address' 
      });
    }

    const result = await emailService.sendWeeklyReport(email, usageData);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Weekly report sent successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error sending weekly report:', error);
    res.status(500).json({ error: 'Failed to send weekly report' });
  }
});

// Send weekly reports to all active users
app.post('/api/send-weekly-reports', async (req, res) => {
  try {
    const results = await emailService.sendToAllActiveUsers(usageTracker);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    res.json({
      success: true,
      message: `Weekly reports sent: ${successful} successful, ${failed} failed`,
      results: results
    });
  } catch (error) {
    console.error('Error sending weekly reports:', error);
    res.status(500).json({ error: 'Failed to send weekly reports' });
  }
});

// Get list of active users (for admin purposes)
app.get('/api/active-users', (req, res) => {
  try {
    const users = Object.keys(usageTracker.usage).map(email => {
      const usageData = usageTracker.getWeeklyUsage(email);
      return {
        email,
        credits: usageData?.credits || 0,
        plan: usageData?.plan || 'free',
        totalUsage: usageData?.totalRpcUsage || 0,
        lastActive: usageTracker.usage[email]?.last_active || 'Unknown'
      };
    }).filter(user => user.totalUsage > 0); // Only active users
    
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Error getting active users:', error);
    res.status(500).json({ error: 'Failed to get active users' });
  }
});

// Serve the documentation site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email preview available at: http://localhost:${PORT}/preview/weekly_email/user@example.com`);
});

module.exports = { app, usageTracker, emailService };
