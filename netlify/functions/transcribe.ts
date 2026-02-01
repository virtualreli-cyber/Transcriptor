import { GoogleGenAI } from "@google/genai";

export default async (req: Request) => {
    // Solo permitir POST
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Falta la API Key en las variables de entorno");
            return new Response(JSON.stringify({ error: "Server Configuration Error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Leer el body como JSON
        const { audioData, mimeType } = await req.json();

        if (!audioData || !mimeType) {
            return new Response(JSON.stringify({ error: "Missing audio data" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        const SYSTEM_INSTRUCTION = "Eres un transcriptor experto. Tu única tarea es escuchar el audio y escribirlo literalmente. REGLAS: 1. Devuelve ÚNICAMENTE el texto hablado. 2. NO añadas introducciones como 'Aquí tienes...' o 'Transcripción:'. 3. Añade puntuación correcta y separa en párrafos si es largo.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: audioData } },
                    { text: "Transcribe el audio literalmente." }
                ],
            },
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });

        const text = response.text?.trim() || "(Transcripción vacía)";

        return new Response(JSON.stringify({ text }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error en la función transcribe:", error);
        return new Response(JSON.stringify({ error: "Error processing audio" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
