import { Resend } from 'resend';

// Uses your Resend API key from the environment variable (or fallback)
const resend = new Resend(process.env.RESEND_API_KEY || 're_gwjvQuAW_EtVLdZWUXuvWdAfZundcpJPu');

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { user_name, user_email, user_phone, user_plan, user_message } = req.body;

    if (!user_email || !user_name) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Review Your Plan <welcome@mylateststudio.com>',
      to: [user_email],
      replyTo: 'welcome@mylateststudio.com',
      subject: `Welcome to Review Your Plan, ${user_name}!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Review Your Plan</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
            .header { background-color: #090d16; padding: 32px 28px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { color: #38bdf8; margin: 6px 0 0 0; font-size: 13px; font-weight: 500; }
            .body { padding: 32px 28px; color: #334155; line-height: 1.6; font-size: 14px; }
            .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
            .box { background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; border-left: 4px solid #0284c7; }
            .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Review Your Plan</h1>
              <p>Clarity, Confidence & Better Value</p>
            </div>
            <div class="body">
              <div class="greeting">Welcome aboard, ${user_name}!</div>
              <p>Thank you for submitting your details. We have received your request and added you to our review queue.</p>
              
              <div class="box">
                <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Your Submission Snapshot:</strong>
                <div>• <strong>Selected Plan:</strong> ${user_plan || 'General Review'}</div>
                <div>• <strong>Phone Contact:</strong> ${user_phone || 'Not provided'}</div>
                ${user_message ? `<div>• <strong>Note:</strong> ${user_message}</div>` : ''}
              </div>

              <p>Our policy specialists are evaluating available options and will get in touch with you shortly.</p>
              <p style="margin-top: 24px; margin-bottom: 0;">Warm regards,<br><strong style="color: #0f172a;">The Review Your Plan Team</strong></p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Sent directly from <strong>welcome@mylateststudio.com</strong>.</p>
              <p style="margin: 4px 0 0 0;">© 2026 Review Your Plan. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: error.message || 'Resend error' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
