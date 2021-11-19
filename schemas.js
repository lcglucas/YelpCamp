const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0).max(99),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    deletedImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})