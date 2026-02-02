import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req: Request) => {
    // Solo permitir POST
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Falta la API Key en las variables de entorno");
            return new Response(JSON.stringify({ error: "Server Configuration Error: Missing API Key" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Leer el body como JSON
        const { audioData, mimeType } = await req.json();

        if (!audioData || !mimeType) {
            return new Response(JSON.stringify({ error: "Missing audio data or mimeType" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: "Eres un transcriptor experto. Tu única tarea es escuchar el audio y escribirlo literalmente. REGLAS: 1. Devuelve ÚNICAMENTE el texto hablado. 2. NO añadas introducciones como 'Aquí tienes...' o 'Transcripción:'. 3. Añade puntuación correcta y separa en párrafos si es largo."
        });

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType,
                    data: audioData
                }
            },
            { text: "Transcribe el audio literalmente." }
        ]);

        const response = await result.response;
        const text = response.text();

        // Handle empty response gracefully
        const finalText = text ? text.trim() : "(Transcripción vacía)";

        return new Response(JSON.stringify({ text: finalText }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error en la función transcribe:", error);

        // Extract error message safely
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return new Response(JSON.stringify({ error: `Error processing audio: ${errorMessage}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
