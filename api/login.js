export default function handler(req, res) {
    // 1. CORS Headers: Tells the browser "It's safe to talk to this API"
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. Handle Preflight (OPTIONS request) - This stops 405 errors
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Handle POST request (Your actual login logic)
    if (req.method === 'POST') {
        // Parse the body. Note: In some Vercel versions, body is parsed automatically.
        const { key } = req.body;
        
        console.log("DEBUG: Login attempt processing...");

        // Compare against the Environment Variable (The Vault)
        if (key === process.env.SECRET_KEY) {
            return res.status(200).json({ authorized: true });
        } else {
            return res.status(401).json({ authorized: false });
        }
    }

    // 4. Reject anything else
    return res.status(405).json({ message: 'Method not allowed' });
}