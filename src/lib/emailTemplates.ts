// Email templates for application status notifications

export interface EmailData {
  applicantName: string
  applicantEmail: string
  statusToken: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  comments?: string
}

export const getStatusEmailSubject = (status: string): string => {
  const subjects = {
    pending: 'TOPS Antique - Application Received',
    under_review: 'TOPS Antique - Application Under Review',
    approved: 'TOPS Antique - Application Approved! 🎉',
    rejected: 'TOPS Antique - Application Status Update'
  }
  return subjects[status as keyof typeof subjects] || 'TOPS Antique - Application Status Update'
}

export const getStatusEmailBody = (data: EmailData): string => {
  const { applicantName, status, statusToken, comments } = data
  const statusUrl = `${window.location.origin}/status?token=${statusToken}`

  const statusMessages = {
    pending: {
      title: 'Application Received',
      message: 'Thank you for submitting your application for the 21st Ten Outstanding Pupils & Students - Antique. Your application has been received and is pending review.',
      emoji: '📝',
      color: '#f59e0b'
    },
    under_review: {
      title: 'Application Under Review',
      message: 'Your application is currently being reviewed by our evaluation committee. We will notify you once the review is complete.',
      emoji: '🔍',
      color: '#3b82f6'
    },
    approved: {
      title: 'Congratulations! Application Approved',
      message: 'We are pleased to inform you that your application has been approved! You have been selected for the 21st Ten Outstanding Pupils & Students - Antique program.',
      emoji: '🎉',
      color: '#10b981'
    },
    rejected: {
      title: 'Application Status Update',
      message: 'Thank you for your interest in the 21st Ten Outstanding Pupils & Students - Antique program. After careful consideration, we regret to inform you that we are unable to approve your application at this time.',
      emoji: '📋',
      color: '#ef4444'
    }
  }

  const statusInfo = statusMessages[status]

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${getStatusEmailSubject(status)}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
        ${statusInfo.emoji} TOPS Antique
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
        21st Ten Outstanding Pupils & Students
      </p>
    </div>

    <!-- Main Content -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 24px;">
      <!-- Greeting -->
      <p style="font-size: 16px; color: #374151; margin: 0 0 24px 0;">
        Dear <strong>${applicantName}</strong>,
      </p>

      <!-- Status Badge -->
      <div style="background: ${statusInfo.color}; background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">${statusInfo.emoji}</div>
        <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
          ${statusInfo.title}
        </h2>
      </div>

      <!-- Message -->
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        ${statusInfo.message}
      </p>

      ${comments ? `
      <!-- Additional Comments -->
      <div style="background: #f3f4f6; border-left: 4px solid ${statusInfo.color}; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0 0 8px 0;">
          📝 Additional Comments:
        </p>
        <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.5;">
          ${comments}
        </p>
      </div>
      ` : ''}

      <!-- Status Check Button -->
      <div style="text-align: center; margin: 32px 0 24px 0;">
        <a href="${statusUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);">
          🔍 Check Full Status
        </a>
      </div>

      <!-- Status Token -->
      <div style="background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 8px; padding: 16px; text-align: center;">
        <p style="font-size: 12px; color: #92400e; margin: 0 0 8px 0; font-weight: 600;">
          Your Status Token:
        </p>
        <p style="font-size: 20px; font-weight: bold; color: #b45309; margin: 0; letter-spacing: 2px; font-family: 'Courier New', monospace;">
          ${statusToken}
        </p>
        <p style="font-size: 11px; color: #92400e; margin: 8px 0 0 0;">
          Save this token to check your status anytime
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px;">
      <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px 0;">
        Questions? Contact us at <a href="mailto:tops.antique@example.com" style="color: #f59e0b; text-decoration: none;">tops.antique@example.com</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        © 2025 TOPS Antique Program. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Plain text version for email clients that don't support HTML
export const getStatusEmailPlainText = (data: EmailData): string => {
  const { applicantName, status, statusToken, comments } = data
  const statusUrl = `${window.location.origin}/status?token=${statusToken}`

  const statusMessages = {
    pending: 'Application Received',
    under_review: 'Application Under Review',
    approved: 'Application Approved!',
    rejected: 'Application Status Update'
  }

  return `
TOPS Antique - ${statusMessages[status]}

Dear ${applicantName},

Your application status has been updated to: ${status.toUpperCase().replace('_', ' ')}

${comments ? `\nAdditional Comments:\n${comments}\n` : ''}

Your Status Token: ${statusToken}

Check your full status at: ${statusUrl}

Questions? Contact us at tops.antique@example.com

© 2025 TOPS Antique Program
  `.trim()
}
