export default function handler(req, res) {
    // 1. DYNAMIC CORS: Allow the domain making the request
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. Handle Preflight (OPTIONS request)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. Handle POST request
    if (req.method === 'POST') {
        const { key } = req.body;
        
        if (key === process.env.SECRET_KEY) {
            return res.status(200).json({ authorized: true });
        } else {
            return res.status(401).json({ authorized: false });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}