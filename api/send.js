import { Resend } from 'resend';

// 1. Initialize Resend securely on the server
const resend = new Resend(process.env.RESEND_API_KEY || 're_MjMV14q8_2fC7SS6sm2ymUXcmUQXX3DbS');

export default async function handler(req, res) {
  // 2. Only allow POST requests (reject GET/PUT)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 3. Extract the form data sent from index.html
    const { user_name, user_email, user_phone, user_plan, user_message } = req.body;

    if (!user_email || !user_name) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // 4. Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Review Your Plan <welcome@reviewyourplan.com>',
      to: [user_email],
      replyTo: 'welcome@reviewyourplan.com',
      subject: `Welcome to Review Your Plan, ${user_name}!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 24px; margin: 0; }
            .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
            .header { background: #090d16; padding: 32px 28px; text-align: center; }
            .header h1 { color: #fff; font-size: 22px; margin: 0; }
            .body { padding: 32px 28px; color: #334155; line-height: 1.6; font-size: 14px; }
            .box { background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #0284c7; }
            .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Review Your Plan</h1>
            </div>
            <div class="body">
              <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">
                Welcome aboard, ${user_name}!
              </div>
              <p>Thank you for submitting your details. We have received your request and added you to our review queue.</p>
              
              <div class="box">
                <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Your Submission Snapshot:</strong>
                <div>• <strong>Selected Plan:</strong> ${user_plan || 'General Review'}</div>
                <div>• <strong>Phone:</strong> ${user_phone || 'Not provided'}</div>
                ${user_message ? `<div>• <strong>Note:</strong> ${user_message}</div>` : ''}
              </div>

              <p>Our specialists will evaluate your details and reach out shortly.</p>
              <p>Warm regards,<br><strong>The Review Your Plan Team</strong></p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Sent directly from welcome@reviewyourplan.com</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 5. Respond back to index.html with success
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}