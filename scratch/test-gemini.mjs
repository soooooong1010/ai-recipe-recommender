import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  }
}

async function testApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("=========================================");
  console.log("🔑 Gemini API Key 테스트 시작...");
  console.log("Key Prefix:", apiKey ? `${apiKey.substring(0, 10)}...` : "없음");
  console.log("=========================================");
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY가 설정되지 않았습니다.");
    process.exit(1);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "냉장고 재료 인공지능 서비스 연결 테스트입니다. 한국어로 반가운 인사 한 문장을 출력해주세요.",
    });
    console.log("\n✅ Gemini 2.5 Flash API 연동 성공!");
    console.log("🤖 AI 응답 결과:\n", response.text);
    console.log("=========================================");
  } catch (err) {
    console.error("\n❌ Gemini API 연동 실패:");
    console.error(err.message || err);
    console.log("=========================================");
  }
}

testApiKey();
