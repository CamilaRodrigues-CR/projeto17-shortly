import db from "../database/connectionDatabase.js"


export async function authValidate(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Envie o token na requisição!!!!")

    try {
         //  buscar na tabela sessions o token que veio na req.
        const session = await db.query(`SELECT token FROM sessions WHERE token = $1;` , [token])
   
    //  se não houver token, ou não for igual
        if (session.rowCount === 0 ) {
            return res.status(401).send({message: "Envie um token válido!!"})
        }

    // exporto esse dado para usar na rota
        res.locals.session = session;

        next()
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}