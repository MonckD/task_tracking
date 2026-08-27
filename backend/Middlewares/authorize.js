function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Vous n\'avez pas les permissions nécessaires' });
        }
        next();
    };
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.is_admin !== true) {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
    next();
}

function authorizeAdminOr(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé' });
        }
        if (req.user.is_admin === true || roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ message: 'Vous n\'avez pas les permissions nécessaires' });
    };
}

export default authorize;
export { requireAdmin, authorizeAdminOr };