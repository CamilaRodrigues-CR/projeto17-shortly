

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Envie o token na requisição!!!!")

    try {
        

        next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}