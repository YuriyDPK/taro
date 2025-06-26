import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createHash, createHmac } from "crypto";

// POST - обработка Telegram авторизации
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("=== TELEGRAM AUTH API ===");
    console.log("Raw body received:", JSON.stringify(body, null, 2));

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    console.log("Bot token exists:", !!botToken);
    console.log(
      "Bot token (first 10 chars):",
      botToken?.substring(0, 10) + "..."
    );

    if (!botToken) {
      console.error("❌ TELEGRAM_BOT_TOKEN not configured");
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN not configured" },
        { status: 500 }
      );
    }

    // Проверяем подлинность данных от Telegram
    const { hash, ...userData } = body;
    console.log("Hash from Telegram:", hash);
    console.log("User data:", JSON.stringify(userData, null, 2));

    const dataKeys = Object.keys(userData).sort();
    console.log("Sorted keys:", dataKeys);

    const dataString = dataKeys
      .map((key) => `${key}=${userData[key]}`)
      .join("\n");
    console.log("Data string for HMAC:", dataString);

    const secretKey = createHash("sha256").update(botToken).digest();
    console.log("Secret key generated");

    const hmac = createHmac("sha256", secretKey)
      .update(dataString)
      .digest("hex");
    console.log("Calculated HMAC:", hmac);
    console.log("Expected hash:", hash);
    console.log("HMAC match:", hmac === hash);

    if (hmac !== hash) {
      console.error("❌ HMAC verification failed");
      console.error("Expected:", hash);
      console.error("Calculated:", hmac);
      return NextResponse.json(
        { error: "Invalid Telegram auth data" },
        { status: 401 }
      );
    }

    console.log("✅ HMAC verification passed");

    // Проверяем что данные не старше 24 часов
    const authDate = parseInt(userData.auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return NextResponse.json(
        { error: "Auth data is too old" },
        { status: 401 }
      );
    }

    // Возвращаем успешный результат - фронтенд сам вызовет signIn
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id?.toString(),
        name:
          userData.first_name +
          (userData.last_name ? ` ${userData.last_name}` : ""),
        email: `${userData.id}@telegram.user`,
        image: userData.photo_url || null,
        ...userData,
      },
    });
  } catch (error) {
    console.error("Telegram auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
