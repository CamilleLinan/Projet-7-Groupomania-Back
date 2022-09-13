const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator()

passwordSchema
.is().min(4)
.has().uppercase()
.has().lowercase()
.has().digits(1);

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({ error: `Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et sans espace` });
    }
}