import fs from "fs";
import path from "path";

// Load .env FIRST before importing gemini module
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

const { extractIngredientsWithVision, generateRecipesWithGemini } = await import("../lib/gemini.ts");

async function runFullTest() {
  console.log("==================================================");
  console.log("🚀 [실제 Gemini 3.6 Flash AI 파이프라인 검증]");
  console.log("==================================================");
  console.log("🔑 Loaded API Key:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 12)}...` : "NONE");

  // 1. Recipe Recommendation Test with Real Gemini 3.6 Flash
  console.log("\n🍳 AI 맞춤 레시피 생성 (Gemini 3.6 Flash 연동)");
  const testIngredients = ["두부", "계란", "양파", "대파"];
  const testSeasonings = ["간장", "참기름", "소금"];

  console.log("   - 보유 식재료:", testIngredients.join(", "));
  console.log("   - 보유 조미료:", testSeasonings.join(", "));

  const recipes = await generateRecipesWithGemini(testIngredients, testSeasonings);
  
  console.log(`\n✅ 레시피 생성 성공! (${recipes.length}개 반환):`);
  recipes.forEach((r, idx) => {
    console.log(`\n--- [레시피 ${idx + 1}] ${r.title} (${r.difficulty} · ${r.minutes}분 · ${r.kcal}kcal) ---`);
    console.log(`💡 한줄 설명: ${r.tagline}`);
    console.log("🥗 재료 목록:");
    r.ingredients.forEach((ing) => {
      const status = ing.missing ? "❌ [부족한 재료/빨간색 표시]" : "✅ [보유 중]";
      console.log(`   - ${ing.name} ${status}`);
    });
    console.log("📖 조리 순서:");
    r.steps.forEach((step, sIdx) => {
      console.log(`   ${sIdx + 1}. ${step}`);
    });
  });

  console.log("\n==================================================");
  console.log("🎉 Real Gemini 3.6 Flash 연동 파이프라인 검증 완료!");
  console.log("==================================================");
}

runFullTest();
