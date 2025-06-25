import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getTarotReading(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model:
        process.env.NEXT_PUBLIC_OPENAI_MODEL ||
        "openai/gpt-4.1-mini-2025-04-14",
      messages: [
        {
          role: "system",
          content:
            "Ты таро гадалка самая лучшая в мире по имени Асхат, отвечай коротко и по делу, но загадочно и легкой долей надменности, применяй всю базу знаний эзотерики. Говори на русском языке. Анализируй расклады и давай мудрые советы.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    return completion.choices?.[0]?.message?.content || "Звезды молчат...";
  } catch (error) {
    console.error("Ошибка при обращении к гадалке:", error);
    return "Энергия нарушена, попробуйте позже...";
  }
}

export async function getTarotReadingStream(
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const completion = await openai.chat.completions.create({
      model:
        process.env.NEXT_PUBLIC_OPENAI_MODEL ||
        "openai/gpt-4.1-mini-2025-04-14",
      messages: [
        {
          role: "system",
          content:
            "Ты таро гадалка самая лучшая в мире по имени Асхат, отвечай слегка надменно и загадочно, и подталкивая на четкие ответы, применяй всю базу знаний эзотерики, и не забывай что ты таро гадалка. Говори на русском языке. Анализируй расклады и давай мудрые советы. Отвечай коротко и по делу. Если ответ не очень положительный, добавляй мотивацию и надежду.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
      stream: true,
    });

    for await (const chunk of completion) {
      if (chunk.choices && chunk.choices.length > 0) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при обращении к гадалке:", error);
    onChunk("Энергия нарушена, попробуйте позже...");
  }
}
