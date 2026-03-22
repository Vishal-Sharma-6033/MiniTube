import fs from "fs";
import path from "path";

const TELEGRAM_API_BASE = "https://api.telegram.org";
const TELEGRAM_TIMEOUT_MS = 30000;

const getBotToken = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    const error = new Error("TELEGRAM_BOT_TOKEN is not configured");
    error.statusCode = 500;
    throw error;
  }
  return token;
};

const getChatId = () => {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    const error = new Error("TELEGRAM_CHAT_ID is not configured");
    error.statusCode = 500;
    throw error;
  }
  return chatId;
};

const buildBotApiUrl = (apiPath) => {
  const token = getBotToken();
  return `${TELEGRAM_API_BASE}/bot${token}/${apiPath}`;
};

const buildBotFileUrl = (filePath) => {
  const token = getBotToken();
  return `${TELEGRAM_API_BASE}/file/bot${token}/${filePath}`;
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = TELEGRAM_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

const buildTelegramDownloadUrl = async (fileId) => {
  const query = new URLSearchParams({ file_id: fileId });
  const response = await fetchWithTimeout(
    `${buildBotApiUrl("getFile")}?${query.toString()}`,
    { method: "GET" }
  );
  const data = await response.json();

  if (!response.ok || !data?.ok || !data?.result?.file_path) {
    const error = new Error(data?.description || "Unable to resolve Telegram file path");
    error.statusCode = 502;
    throw error;
  }

  return buildBotFileUrl(data.result.file_path);
};

export const uploadToTelegram = async (localFilepath) => {
  if (!localFilepath) {
    return null;
  }

  try {
    const fileBuffer = await fs.promises.readFile(localFilepath);
    const filename = path.basename(localFilepath);
    const chatId = getChatId();

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append(
      "document",
      new Blob([fileBuffer], { type: "application/octet-stream" }),
      filename
    );

    const response = await fetchWithTimeout(buildBotApiUrl("sendDocument"), {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data?.ok || !data?.result?.document?.file_id) {
      const error = new Error(data?.description || "Telegram upload failed");
      error.statusCode = 502;
      throw error;
    }

    const fileId = data.result.document.file_id;
    const downloadUrl = await buildTelegramDownloadUrl(fileId);

    return {
      url: downloadUrl,
      secure_url: downloadUrl,
      file_id: fileId,
      duration: null,
    };
  } catch (error) {
    console.error("Error uploading to Telegram:", error);
    throw error;
  } finally {
    if (localFilepath && fs.existsSync(localFilepath)) {
      fs.unlinkSync(localFilepath);
    }
  }
};
