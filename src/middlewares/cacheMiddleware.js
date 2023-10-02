import mcache from 'memory-cache';
import 'dotenv/config'

export default function (duration = 60) {
    return (req, res, next) => {
        const key = process.env.CACHE_KEY + req.originUrl || req.url;
        const cachedBody = mcache.get(key);

        if(cachedBody) {
            return res.send(JSON.parse(cachedBody));
        } else {
            res.sendResponse = res.send;
            res.send = body => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body); 
            }
            next();
        }
    };
}