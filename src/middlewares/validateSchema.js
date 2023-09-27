export function validateSchema(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false })

        if (validation.error) {
            const errors = validation.error.details.map(det => det.message)
            return res.status(422).send(errors)
        }

        next()
    }
}