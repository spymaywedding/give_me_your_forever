// Gift slip upload → Google Drive
// Paste into a new project at https://script.google.com, then
// Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
// Put the resulting /exec URL into SLIP_UPLOAD_URL in main.js.

const FOLDER_ID = "13eBvRG6NCRwqmRAj5cRxWYMFHwrzle-0";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (ALLOWED_TYPES.indexOf(body.mimeType) === -1) {
      return reply({ ok: false, error: "unsupported_type" });
    }

    const bytes = Utilities.base64Decode(body.data);
    if (bytes.length > MAX_BYTES) {
      return reply({ ok: false, error: "too_large" });
    }

    const name = String(body.name || "guest").replace(/[\\/:*?"<>|]/g, "").trim().slice(0, 60) || "guest";
    const stamp = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd_HHmmss");
    const ext = body.mimeType.split("/")[1].replace("jpeg", "jpg");
    const blob = Utilities.newBlob(bytes, body.mimeType, `${stamp}_${name}.${ext}`);

    const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
    const message = String(body.message || "").slice(0, 500);
    if (message) file.setDescription(message);

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
