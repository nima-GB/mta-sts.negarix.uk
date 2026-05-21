import crypto from 'crypto';

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            // Check if SECRET_KEY is set in Vercel
            const secret = process.env.SECRET_KEY;
            if (!secret) {
                console.error("DEBUG: SECRET_KEY environment variable is missing!");
                return res.status(500).json({ error: "Server Configuration Error" });
            }

            const { key } = req.body;
            if (!key) return res.status(400).json({ error: 'Missing key' });

            // Hardening: Mandatory delay to prevent brute force
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Cryptographic comparison
            const keyBuffer = Buffer.from(key, 'utf8');
            const secretBuffer = Buffer.from(secret, 'utf8');

            let isMatch = false;
            if (keyBuffer.length === secretBuffer.length) {
                isMatch = crypto.timingSafeEqual(keyBuffer, secretBuffer);
            }

            if (isMatch) {
                return res.status(200).json({ authorized: true });
            } else {
                return res.status(401).json({ authorized: false });
            }
        } catch (err) {
            console.error("DEBUG: API CRASHED:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}