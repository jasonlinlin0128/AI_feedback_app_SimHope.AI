// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/generate-questions', async (req, res) => {
    const { topic, summary, fileContent } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY; // 從環境變數讀取
    
    const prompt = `你是一個活動問卷設計專家...`; // 你的原始 prompt
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: { /* 你的 schema */ }
                }
            })
        });
        
        const result = await response.json();
        const questions = JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text).questions || [];
        res.json({ questions });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});
