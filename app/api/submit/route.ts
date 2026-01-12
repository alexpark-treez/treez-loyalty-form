import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";
import { Readable } from "stream";

const resend = new Resend(process.env.RESEND_API_KEY);

interface DriveUploadResult {
  fileId: string;
  webViewLink: string;
  fileName: string;
}

async function getGoogleAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}");
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  return auth;
}

async function uploadToDrive(
  auth: Awaited<ReturnType<typeof getGoogleAuth>>,
  file: File,
  folderName: string
): Promise<DriveUploadResult> {
  const drive = google.drive({ version: "v3", auth });

  // Check if subfolder exists, create if not
  const folderQuery = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed=false`,
    fields: "files(id, name)",
  });

  let subFolderId: string;

  if (folderQuery.data.files && folderQuery.data.files.length > 0) {
    subFolderId = folderQuery.data.files[0].id!;
  } else {
    const folderResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      fields: "id",
    });
    subFolderId = folderResponse.data.id!;
  }

  // Convert File to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Create a readable stream from buffer
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  // Upload file
  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [subFolderId],
    },
    media: {
      mimeType: file.type,
      body: stream,
    },
    fields: "id, webViewLink",
  });

  // Make file viewable by anyone with link
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: {
      type: "anyone",
      role: "reader",
    },
  });

  return {
    fileId: response.data.id!,
    webViewLink: response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`,
    fileName: file.name,
  };
}

async function appendToSheet(
  auth: Awaited<ReturnType<typeof getGoogleAuth>>,
  data: {
    dispensaryName: string;
    contactName: string;
    contactEmail: string;
    website: string;
    storeCount: string;
    transferringPoints: string;
    brandHexCodes: string;
    designNotes: string;
    logoUrl: string;
    iconUrl: string;
    backgroundUrl: string;
    submittedAt: string;
  }
) {
  const sheets = google.sheets({ version: "v4", auth });

  const values = [
    [
      data.submittedAt,
      data.dispensaryName,
      data.contactName,
      data.contactEmail,
      data.website,
      data.storeCount,
      data.transferringPoints,
      data.brandHexCodes,
      data.designNotes,
      data.logoUrl,
      data.iconUrl,
      data.backgroundUrl,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:L",
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

async function sendAdminEmail(data: {
  dispensaryName: string;
  contactName: string;
  contactEmail: string;
  website: string;
  storeCount: string;
  transferringPoints: string;
  brandHexCodes: string;
  designNotes: string;
  logoUrl: string;
  iconUrl: string;
  backgroundUrl: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "alex.park@treez.io";

  await resend.emails.send({
    from: "Treez Loyalty <onboarding@resend.dev>",
    to: adminEmail,
    subject: `New Loyalty Onboarding: ${data.dispensaryName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #6ABF4B; color: white; padding: 24px; text-align: center; }
            .content { padding: 24px; max-width: 600px; margin: 0 auto; }
            .field { margin-bottom: 16px; }
            .label { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
            .value { font-size: 16px; }
            .preview { display: inline-block; margin-right: 12px; }
            .preview img { max-width: 100px; max-height: 60px; border: 1px solid #ddd; border-radius: 4px; }
            .link { color: #6ABF4B; text-decoration: none; }
            .footer { text-align: center; padding: 24px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">New Loyalty Onboarding</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">${data.dispensaryName}</p>
          </div>
          <div class="content">
            <h2 style="margin-top: 0;">Business Information</h2>
            <div class="field">
              <div class="label">Dispensary Name</div>
              <div class="value">${data.dispensaryName}</div>
            </div>
            <div class="field">
              <div class="label">Contact Name</div>
              <div class="value">${data.contactName}</div>
            </div>
            <div class="field">
              <div class="label">Contact Email</div>
              <div class="value"><a href="mailto:${data.contactEmail}" class="link">${data.contactEmail}</a></div>
            </div>
            <div class="field">
              <div class="label">Website</div>
              <div class="value"><a href="${data.website}" class="link" target="_blank">${data.website}</a></div>
            </div>
            <div class="field">
              <div class="label">Store Count</div>
              <div class="value">${data.storeCount}</div>
            </div>
            <div class="field">
              <div class="label">Transferring Points</div>
              <div class="value">${data.transferringPoints}</div>
            </div>

            <h2>Brand Assets</h2>
            <div class="field">
              <div class="label">Brand Colors</div>
              <div class="value">${data.brandHexCodes || "Not provided"}</div>
            </div>
            <div class="field">
              <div class="label">Design Notes</div>
              <div class="value">${data.designNotes || "None"}</div>
            </div>
            <div class="field">
              <div class="label">Uploaded Files</div>
              <div class="value">
                <p><a href="${data.logoUrl}" class="link">View Logo</a></p>
                <p><a href="${data.iconUrl}" class="link">View Icon</a></p>
                ${data.backgroundUrl ? `<p><a href="${data.backgroundUrl}" class="link">View Background</a></p>` : ""}
              </div>
            </div>

            <p style="margin-top: 24px;">
              <a href="https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}" class="link" style="font-weight: 600;">View in Google Sheet &rarr;</a>
            </p>
          </div>
          <div class="footer">
            <p>This email was sent from the Treez Loyalty Onboarding Form</p>
          </div>
        </body>
      </html>
    `,
  });
}

async function sendClientEmail(data: {
  dispensaryName: string;
  contactName: string;
  contactEmail: string;
}) {
  await resend.emails.send({
    from: "Treez Loyalty <onboarding@resend.dev>",
    to: data.contactEmail,
    subject: "Welcome to Treez Loyalty! We received your submission",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #6ABF4B; color: white; padding: 32px; text-align: center; }
            .content { padding: 32px; max-width: 600px; margin: 0 auto; }
            .button { display: inline-block; background: #6ABF4B; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; }
            .footer { text-align: center; padding: 24px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Treez Loyalty!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.contactName},</p>

            <p>Thank you for submitting your onboarding information for <strong>${data.dispensaryName}</strong>! We're excited to help you launch your loyalty program.</p>

            <h2 style="color: #6ABF4B;">What Happens Next?</h2>
            <ol>
              <li><strong>Review:</strong> Our design team will review your brand assets within 24-48 hours.</li>
              <li><strong>Design:</strong> We'll create your custom loyalty program materials.</li>
              <li><strong>Launch:</strong> We'll work with you to get everything set up and running.</li>
            </ol>

            <p>If you have any questions in the meantime, feel free to reach out to us.</p>

            <p style="margin-top: 32px;">
              <a href="https://www.treez.io" class="button">Visit Treez.io</a>
            </p>

            <p style="margin-top: 32px;">Best regards,<br>The Treez Team</p>
          </div>
          <div class="footer">
            <p>Treez Inc. | Building the future of cannabis retail</p>
            <p><a href="https://www.treez.io" style="color: #6ABF4B;">www.treez.io</a></p>
          </div>
        </body>
      </html>
    `,
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting form submission...");

    const formData = await request.formData();

    const dispensaryName = formData.get("dispensaryName") as string;
    const contactName = formData.get("contactName") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const website = formData.get("website") as string;
    const storeCount = formData.get("storeCount") as string;
    const transferringPoints = formData.get("transferringPoints") as string;
    const brandHexCodes = formData.get("brandHexCodes") as string;
    const designNotes = formData.get("designNotes") as string;
    const logo = formData.get("logo") as File;
    const icon = formData.get("icon") as File;
    const backgroundImage = formData.get("backgroundImage") as File | null;

    console.log("Form data received:", { dispensaryName, contactName, contactEmail });

    // Check env vars
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.error("Missing GOOGLE_SERVICE_ACCOUNT_KEY");
      return NextResponse.json({ error: "Server configuration error: Missing Google credentials" }, { status: 500 });
    }
    if (!process.env.GOOGLE_SHEET_ID) {
      console.error("Missing GOOGLE_SHEET_ID");
      return NextResponse.json({ error: "Server configuration error: Missing Sheet ID" }, { status: 500 });
    }
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.error("Missing GOOGLE_DRIVE_FOLDER_ID");
      return NextResponse.json({ error: "Server configuration error: Missing Drive Folder ID" }, { status: 500 });
    }

    // Get Google Auth
    console.log("Getting Google Auth...");
    let auth;
    try {
      auth = await getGoogleAuth();
      console.log("Google Auth obtained successfully");
    } catch (authError) {
      console.error("Google Auth error:", authError);
      return NextResponse.json({ error: "Failed to authenticate with Google" }, { status: 500 });
    }

    // Create sanitized folder name
    const folderName = dispensaryName.replace(/[^a-zA-Z0-9\s-]/g, "").trim();

    // Upload files to Drive
    console.log("Uploading logo to Drive...");
    let logoResult;
    try {
      logoResult = await uploadToDrive(auth, logo, folderName);
      console.log("Logo uploaded:", logoResult.webViewLink);
    } catch (uploadError) {
      console.error("Logo upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload logo to Google Drive" }, { status: 500 });
    }

    console.log("Uploading icon to Drive...");
    let iconResult;
    try {
      iconResult = await uploadToDrive(auth, icon, folderName);
      console.log("Icon uploaded:", iconResult.webViewLink);
    } catch (uploadError) {
      console.error("Icon upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload icon to Google Drive" }, { status: 500 });
    }

    let backgroundResult: DriveUploadResult | null = null;
    if (backgroundImage && backgroundImage.size > 0) {
      console.log("Uploading background to Drive...");
      try {
        backgroundResult = await uploadToDrive(auth, backgroundImage, folderName);
        console.log("Background uploaded:", backgroundResult.webViewLink);
      } catch (uploadError) {
        console.error("Background upload error:", uploadError);
        // Non-fatal, continue without background
      }
    }

    const submittedAt = new Date().toISOString();

    // Append to Google Sheet
    console.log("Appending to Google Sheet...");
    try {
      await appendToSheet(auth, {
        dispensaryName,
        contactName,
        contactEmail,
        website,
        storeCount,
        transferringPoints,
        brandHexCodes,
        designNotes,
        logoUrl: logoResult.webViewLink,
        iconUrl: iconResult.webViewLink,
        backgroundUrl: backgroundResult?.webViewLink || "",
        submittedAt,
      });
      console.log("Sheet updated successfully");
    } catch (sheetError) {
      console.error("Sheet append error:", sheetError);
      return NextResponse.json({ error: "Failed to save to Google Sheet" }, { status: 500 });
    }

    // Send emails
    console.log("Sending emails...");
    try {
      await Promise.all([
        sendAdminEmail({
          dispensaryName,
          contactName,
          contactEmail,
          website,
          storeCount,
          transferringPoints,
          brandHexCodes,
          designNotes,
          logoUrl: logoResult.webViewLink,
          iconUrl: iconResult.webViewLink,
          backgroundUrl: backgroundResult?.webViewLink || "",
        }),
        sendClientEmail({
          dispensaryName,
          contactName,
          contactEmail,
        }),
      ]);
      console.log("Emails sent successfully");
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Non-fatal - data is saved, just email failed
    }

    console.log("Form submission completed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: `Failed to process submission: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
