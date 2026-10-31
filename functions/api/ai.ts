// KP AI Teaching Assistant — Cloudflare Pages Function at /api/ai (streams Claude's answer as plain text)
// Secrets (wrangler pages secret put ... / dashboard): ANTHROPIC_API_KEY (required), AI_ACCESS_CODE (teacher passcode, required)
import Anthropic from "@anthropic-ai/sdk";

interface Env {
  ANTHROPIC_API_KEY?: string;
  AI_ACCESS_CODE?: string;
}

const MAX_INPUT = 4000; // characters per request
const MAX_HISTORY = 12; // previous turns kept for follow-up questions

const SYSTEM = `អ្នកជាជំនួយការបង្រៀនគណិតវិទ្យា សម្រាប់គ្រូនៅកម្ពុជា ថ្នាក់ទី ៧ ដល់ទី ១២ តាមកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា ។
- ឆ្លើយជាភាសាខ្មែរ (ពាក្យបច្ចេកទេសអាចមានអង់គ្លេសក្នុងវង់ក្រចក) ។
- សរសេររូបមន្តគណិតវិទ្យាជា LaTeX: $...$ សម្រាប់ក្នុងបន្ទាត់ និង $$...$$ សម្រាប់បន្ទាត់ដាច់ដោយឡែក ។
- ប្រើ Markdown: ចំណងជើង (##) បញ្ជី (-, 1.) អក្សរដិត (**...**) និងតារាង ។
- ពិនិត្យការគណនាឱ្យបានត្រឹមត្រូវ មុនផ្ដល់ចម្លើយ ។ កុំបង្កើតព័ត៌មានក្លែងក្លាយ ។
- ឆ្លើយខ្លី ច្បាស់ និងប្រើបានភ្លាមក្នុងថ្នាក់រៀន ។`;

const MODES: Record<string, string> = {
  plan: "សរសេរកិច្ចតែងការបង្រៀន (lesson plan) មួយម៉ោង មានវត្ថុបំណង សម្ភារៈ ដំណើរការបង្រៀនតាមជំហាន (រំលឹក មេរៀនថ្មី ពង្រឹង វាយតម្លៃ) ពេលវេលានីមួយៗ និងកិច្ចការផ្ទះ ។",
  exercises: "បង្កើតលំហាត់អនុវត្ត ពីងាយទៅពិបាក ហើយដាក់ចម្លើយ និងដំណោះស្រាយសង្ខេបនៅខាងចុង ។",
  quiz: "បង្កើតសំណួរពហុជ្រើសរើស (A B C D) ដែលចម្លើយខុសគួរឱ្យជឿ ហើយដាក់តារាងចម្លើយត្រឹមត្រូវនៅខាងចុង ។",
  solve: "ដោះស្រាយលំហាត់មួយជំហានម្ដងៗ ពន្យល់ហេតុផលនៃជំហាននីមួយៗ ឱ្យសិស្សយល់ ។",
  explain: "ពន្យល់គោលគំនិតឱ្យសាមញ្ញ មានឧទាហរណ៍ និងកំហុសដែលសិស្សតែងតែធ្វើ ។",
  chat: "",
};

type Turn = { role: "user" | "assistant"; content: string };

const text = (status: number, msg: string) =>
  new Response(msg, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  if (!env.AI_ACCESS_CODE || !env.ANTHROPIC_API_KEY) return text(503, "ម៉ាស៊ីនមេមិនទាន់កំណត់ ANTHROPIC_API_KEY ឬ AI_ACCESS_CODE ។");

  let body: { code?: string; mode?: string; grade?: string; prompt?: string; history?: Turn[] };
  try {
    body = await request.json();
  } catch {
    return text(400, "សំណើមិនត្រឹមត្រូវ ។");
  }
  if (body.code !== env.AI_ACCESS_CODE) return text(401, "លេខកូដគ្រូមិនត្រឹមត្រូវ ។");

  const prompt = (body.prompt ?? "").trim();
  if (!prompt) return text(400, "សូមសរសេរសំណួរ ។");
  if (prompt.length > MAX_INPUT) return text(413, `សំណួរវែងពេក (អតិបរមា ${MAX_INPUT} តួអក្សរ) ។`);

  const task = MODES[body.mode ?? "chat"] ?? "";
  const grade = /^(7|8|9|10|11|12)$/.test(body.grade ?? "") ? `ថ្នាក់ទី ${body.grade}` : "";
  const header = [grade, task].filter(Boolean).join("\n");
  const history = (Array.isArray(body.history) ? body.history : [])
    .filter((t) => (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
    .slice(-MAX_HISTORY)
    .map((t) => ({ role: t.role, content: t.content.slice(0, 8000) }));
  if (history.length && history[0].role !== "user") history.shift();

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 8000,
    output_config: { effort: "low" }, // short, fast answers for classroom use
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    messages: [...history, { role: "user", content: header ? `${header}\n\n${prompt}` : prompt }],
  } as any);

  const enc = new TextEncoder();
  const out = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") controller.enqueue(enc.encode("\n\n[[REFUSAL]]"));
        else if (final.stop_reason === "max_tokens") controller.enqueue(enc.encode("\n\n[[TRUNCATED]]"));
      } catch (err) {
        console.error("ai:", err);
        controller.enqueue(enc.encode("\n\n[[ERROR]]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(out, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
