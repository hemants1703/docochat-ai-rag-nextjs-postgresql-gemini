import OpenAI from "openai";

export const embedChunkedText = async (
  text: string[],
  embeddingModel: "text-embedding-3-small" | "text-embedding-3-large"
): Promise<OpenAI.Embeddings.CreateEmbeddingResponse> => {
  if (!text || text.length === 0) {
    throw new Error("Text cannot be empty or whitespace.");
  }

  const openai: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const embedding: OpenAI.Embeddings.CreateEmbeddingResponse =
    await openai.embeddings.create({
      model: embeddingModel,
      input: text,
      encoding_format: "float",
    });

  if (!embedding || !embedding.data || embedding.data.length === 0) {
    throw new Error("Failed to generate embeddings");
  }

  return embedding;
};
