import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Interface for requests with CSRF token
interface CSRFRequest extends Request {
    csrfToken?: () => string;
}

// Store for CSRF tokens
const tokenStore = new Map<string, { token: string; timestamp: number }>();

// Clean up expired tokens periodically
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, data] of tokenStore.entries()) {
        if (now - data.timestamp > 24 * 60 * 60 * 1000) { // 24 hours
            tokenStore.delete(sessionId);
        }
    }
}, 60 * 60 * 1000); // Clean up every hour

export const generateCSRFToken = (req: CSRFRequest, res: Response, next: NextFunction) => {
    if (!req.session?.id) {
        return next(new Error('Session is required for CSRF protection'));
    }

    // Generate new token if it doesn't exist or is expired
    if (!tokenStore.has(req.session.id)) {
        const token = crypto.randomBytes(32).toString('hex');
        tokenStore.set(req.session.id, {
            token,
            timestamp: Date.now()
        });
    }

    // Add token to request object
    req.csrfToken = () => tokenStore.get(req.session.id)?.token || '';

    // Set CSRF token cookie
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    next();
};

export const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        return next();
    }

    const token = req.headers['x-xsrf-token'] || req.body._csrf;
    const storedToken = tokenStore.get(req.session?.id)?.token;

    if (!token || !storedToken || token !== storedToken) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid CSRF token'
        });
    }

    next();
};