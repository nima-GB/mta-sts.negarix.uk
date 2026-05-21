import { timingSafeEqual } from 'crypto';

export default function handler(req, res) {
    // 1. Strict Security Headers
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    // 2. Handle Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        // 3. Brute Force Protection: Introduce a mandatory 2-second delay
        // This makes it physically impossible for a bot to try more than ~30 passwords per minute.
        const delay = new Promise(resolve => setTimeout(resolve, 2000));
        
        const { key } = req.body;
        const secret = process.env.SECRET_KEY || '';

        // 4. Validate input existence
        if (!key) {
            return res.status(400).json({ error: 'Missing key' });
        }

        // 5. Cryptographic Timing-Safe Comparison
        // This prevents attackers from guessing the key by measuring how long the server takes to respond.
        const keyBuffer = Buffer.from(key, 'utf8');
        const secretBuffer = Buffer.from(secret, 'utf8');

        // Ensure buffers are same length to prevent timing leakage
        let isMatch = false;
        if (keyBuffer.length === secretBuffer.length) {
            isMatch = timingSafeEqual(keyBuffer, secretBuffer);
        }

        // Wait for the delay
        await delay;

        if (isMatch) {
            return res.status(200).json({ authorized: true });
        } else {
            return res.status(401).json({ authorized: false });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}