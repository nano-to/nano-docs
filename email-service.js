const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.setupTransporter();
  }

  setupTransporter() {
    // Configure email transporter based on environment
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendWeeklyReport(email, usageData) {
    try {
      const html = this.generateWeeklyReportHTML(email, usageData);
      
      const mailOptions = {
        from: `"Nano.to API" <${process.env.SMTP_FROM || 'noreply@nano.to'}>`,
        to: email,
        subject: `📊 Weekly API Usage Report - ${this.getWeekRange()}`,
        html: html,
        text: this.generateTextVersion(usageData)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Weekly report sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending weekly report:', error);
      return { success: false, error: error.message };
    }
  }

  async sendToAllActiveUsers(usageTracker) {
    const results = [];
    
    try {
      // Get all users with usage data
      const users = Object.keys(usageTracker.usage);
      
      for (const email of users) {
        const usageData = usageTracker.getWeeklyUsage(email);
        if (usageData && usageData.totalRpcUsage > 0) { // Only send to active users
          const result = await this.sendWeeklyReport(email, usageData);
          results.push({ email, ...result });
          
          // Add delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error sending reports to all users:', error);
      return results;
    }
  }

  getWeekRange() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(weekAgo)} - ${formatDate(today)}`;
  }

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
    <title>Nano.to API Usage Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            line-height: 1.5;
            color: #1a1a1a;
            background-color: #fafafa;
            font-size: 14px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background: #1a1a1a;
            color: white;
            padding: 24px 32px;
            border-bottom: 1px solid #e1e5e9;
        }
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .logo {
            width: 32px;
            height: 32px;
            border-radius: 6px;
        }
        .header-title {
            font-size: 18px;
            font-weight: 600;
            color: white;
        }
        .header-subtitle {
            font-size: 12px;
            color: #8b949e;
            margin-top: 4px;
        }
        .content {
            padding: 32px;
        }
        .section {
            margin-bottom: 32px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e1e5e9;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        .metric-card {
            background: #f6f8fa;
            border: 1px solid #e1e5e9;
            border-radius: 6px;
            padding: 16px;
        }
        .metric-label {
            font-size: 11px;
            color: #656d76;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .metric-value {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            font-family: 'SF Mono', Monaco, monospace;
        }
        .metric-unit {
            font-size: 12px;
            color: #656d76;
            margin-left: 4px;
        }
        .credits-section {
            background: #f6f8fa;
            border: 1px solid #e1e5e9;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .credits-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .credits-title {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
        }
        .credits-plan {
            font-size: 12px;
            color: #656d76;
            background: #e1e5e9;
            padding: 4px 8px;
            border-radius: 4px;
        }
        .credits-balance {
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
            font-family: 'SF Mono', Monaco, monospace;
        }
        .daily-breakdown {
            background: #f6f8fa;
            border: 1px solid #e1e5e9;
            border-radius: 6px;
            overflow: hidden;
        }
        .daily-header {
            background: #1a1a1a;
            color: white;
            padding: 12px 16px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .daily-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid #e1e5e9;
            font-size: 13px;
        }
        .daily-item:last-child {
            border-bottom: none;
        }
        .daily-date {
            font-weight: 600;
            color: #1a1a1a;
            font-family: 'SF Mono', Monaco, monospace;
        }
        .daily-stats {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: #656d76;
        }
        .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-value {
            font-weight: 600;
            color: #1a1a1a;
            font-family: 'SF Mono', Monaco, monospace;
        }
        .performance-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        .performance-card {
            background: #f6f8fa;
            border: 1px solid #e1e5e9;
            border-radius: 6px;
            padding: 16px;
        }
        .performance-label {
            font-size: 11px;
            color: #656d76;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .performance-value {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            font-family: 'SF Mono', Monaco, monospace;
        }
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-excellent { background-color: #28a745; }
        .status-good { background-color: #ffc107; }
        .status-poor { background-color: #dc3545; }
        .actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
        .action-button {
            display: inline-block;
            background: #1a1a1a;
            color: white;
            padding: 10px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: background-color 0.2s;
        }
        .action-button:hover {
            background: #333;
        }
        .action-button.secondary {
            background: #f6f8fa;
            color: #1a1a1a;
            border: 1px solid #e1e5e9;
        }
        .action-button.secondary:hover {
            background: #e1e5e9;
        }
        .insights {
            background: #f0f8ff;
            border: 1px solid #dbeafe;
            border-radius: 6px;
            padding: 16px;
            margin: 24px 0;
        }
        .insights-title {
            font-size: 12px;
            font-weight: 600;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .insights-content {
            font-size: 13px;
            color: #1e40af;
            line-height: 1.4;
        }
        .footer {
            background: #f6f8fa;
            border-top: 1px solid #e1e5e9;
            padding: 20px 32px;
            text-align: center;
        }
        .footer-text {
            font-size: 12px;
            color: #656d76;
            margin-bottom: 8px;
        }
        .footer-link {
            color: #1a1a1a;
            text-decoration: none;
        }
        .footer-link:hover {
            text-decoration: underline;
        }
        .footer-meta {
            font-size: 10px;
            color: #8b949e;
            margin-top: 12px;
        }
        .code-block {
            background: #f6f8fa;
            border: 1px solid #e1e5e9;
            border-radius: 6px;
            padding: 12px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 12px;
            color: #1a1a1a;
            margin: 16px 0;
        }
        .endpoint {
            color: #0969da;
            font-weight: 600;
        }
        .method {
            color: #8250df;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <div class="logo-section">
                    <img src="https://rpc.nano.to/assets/favicon.png" alt="Nano.to" class="logo">
                    <div>
                        <div class="header-title">Nano.to API</div>
                        <div class="header-subtitle">Weekly Usage Report</div>
                    </div>
                </div>
                <div class="header-subtitle">${weekStart} - ${weekEnd}, ${new Date().getFullYear()}</div>
            </div>
        </div>
        
        <div class="content">
            <div class="credits-section">
                <div class="credits-header">
                    <div class="credits-title">Credits Balance</div>
                    <div class="credits-plan">${usageData.plan.charAt(0).toUpperCase() + usageData.plan.slice(1)} Plan</div>
                </div>
                <div class="credits-balance">${usageData.credits.toLocaleString()}</div>
            </div>

            <div class="section">
                <div class="section-title">Usage Metrics</div>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">RPC Calls</div>
                        <div class="metric-value">${usageData.totalRpcUsage.toLocaleString()}<span class="metric-unit">requests</span></div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Work Generate</div>
                        <div class="metric-value">${usageData.totalWorkGenerateUsage.toLocaleString()}<span class="metric-unit">PoW</span></div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Free Usage</div>
                        <div class="metric-value">${usageData.totalFreeUsage.toLocaleString()}<span class="metric-unit">included</span></div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Paid Usage</div>
                        <div class="metric-value">${usageData.totalPaidUsage.toLocaleString()}<span class="metric-unit">credits</span></div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Performance Metrics</div>
                <div class="performance-grid">
                    <div class="performance-card">
                        <div class="performance-label">Success Rate</div>
                        <div class="performance-value">${usageData.successRate}%</div>
                    </div>
                    
                    <div class="performance-card">
                        <div class="performance-label">Error Rate</div>
                        <div class="performance-value">${usageData.errorRate}%</div>
                    </div>
                    
                    <div class="performance-card">
                        <div class="performance-label">Service Uptime</div>
                        <div class="performance-value">
                            <span class="status-indicator ${usageData.uptimePercentage >= 99 ? 'status-excellent' : usageData.uptimePercentage >= 95 ? 'status-good' : 'status-poor'}"></span>
                            ${usageData.uptimePercentage}%
                        </div>
                    </div>
                </div>
            </div>

            ${this.generateInsights(usageData)}

            <div class="section">
                <div class="section-title">Daily Breakdown</div>
                <div class="daily-breakdown">
                    <div class="daily-header">Date | RPC | PoW | Free | Paid</div>
                    ${usageData.dailyBreakdown.map(day => `
                        <div class="daily-item">
                            <div class="daily-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                            <div class="daily-stats">
                                <div class="stat-item">
                                    <span class="stat-label">RPC</span>
                                    <span class="stat-value">${day.rpcUsage}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">PoW</span>
                                    <span class="stat-value">${day.workGenerateUsage}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Free</span>
                                    <span class="stat-value">${day.freeUsage}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Paid</span>
                                    <span class="stat-value">${day.paidUsage}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="code-block">
<span class="method">GET</span> <span class="endpoint">https://rpc.nano.to</span><br>
<span class="method">POST</span> <span class="endpoint">https://rpc.nano.to</span><br>
<span class="method">GET</span> <span class="endpoint">https://docs.nano.to</span>
            </div>

            <div class="actions">
                <a href="https://rpc.nano.to?buy" class="action-button">Manage Credits</a>
                <a href="https://docs.nano.to" class="action-button secondary">API Docs</a>
                <a href="https://rpc.nano.to" class="action-button secondary">RPC Endpoint</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                This report covers your API usage from ${weekStart} to ${weekEnd}.
            </div>
            <div class="footer-text">
                Questions? Contact us at <a href="mailto:support@nano.to" class="footer-link">support@nano.to</a>
            </div>
            <div class="footer-meta">
                Generated on ${currentDate} • Nano.to API Services
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  generateInsights(usageData) {
    const insights = [];
    
    // Usage trend analysis
    const avgDailyUsage = Math.round(usageData.totalRpcUsage / 7);
    if (avgDailyUsage > 50) {
      insights.push({
        title: "High Usage Detected",
        message: `You're averaging ${avgDailyUsage} RPC calls per day. Consider upgrading to a higher plan for better performance.`
      });
    }
    
    // Error rate analysis
    if (parseFloat(usageData.errorRate) > 5) {
      insights.push({
        title: "Error Rate Alert",
        message: `Your error rate is ${usageData.errorRate}%. Check your implementation or contact support for assistance.`
      });
    }
    
    // Credits analysis
    const creditsUsedThisWeek = usageData.totalPaidUsage;
    if (creditsUsedThisWeek > usageData.credits * 0.1) {
      insights.push({
        title: "Credits Usage",
        message: `You've used ${creditsUsedThisWeek} credits this week. Consider purchasing more credits to avoid service interruption.`
      });
    }
    
    if (insights.length === 0) {
      insights.push({
        title: "Great Performance!",
        message: "Your API usage looks healthy with good success rates and efficient credit usage."
      });
    }
    
    return `
      <div class="section">
        <div class="section-title">Usage Insights</div>
        ${insights.map(insight => `
          <div class="insights">
            <div class="insights-title">${insight.title}</div>
            <div class="insights-content">${insight.message}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  generateTextVersion(usageData) {
    return `
Weekly API Usage Report
${this.getWeekRange()}

Credits Balance: ${usageData.credits.toLocaleString()}
Plan: ${usageData.plan.charAt(0).toUpperCase() + usageData.plan.slice(1)}

Usage Summary:
- RPC Calls: ${usageData.totalRpcUsage.toLocaleString()}
- Work Generate: ${usageData.totalWorkGenerateUsage.toLocaleString()}
- Free Usage: ${usageData.totalFreeUsage.toLocaleString()}
- Paid Usage: ${usageData.totalPaidUsage.toLocaleString()}

Performance:
- Success Rate: ${usageData.successRate}%
- Error Rate: ${usageData.errorRate}%
- Uptime: ${usageData.uptimePercentage}%

Daily Breakdown:
${usageData.dailyBreakdown.map(day => 
  `${new Date(day.date).toLocaleDateString()}: RPC:${day.rpcUsage} PoW:${day.workGenerateUsage} Free:${day.freeUsage} Paid:${day.paidUsage}`
).join('\n')}

Questions? Contact support@nano.to
Generated on ${new Date().toLocaleDateString()}
    `.trim();
  }
}

module.exports = EmailService;
