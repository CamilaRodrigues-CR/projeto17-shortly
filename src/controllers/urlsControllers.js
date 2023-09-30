import { nanoid } from "nanoid";
import db from "../database/connectionDatabase.js";


export async function postUrl(req, res) {
    const { url } = req.body;
    const session = res.locals.session

    if (!session) return res.status(401).send({ message: "envie um token na requisição!!" })

    try {
        //criar um código encurtado para a url
        let shortUrl = url
        shortUrl = nanoid();

        //buscar o id do usuario para inserir na tabela   
        const userId = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [session.rows[0].token])

        //salvar o id, a url original e esse código na tabela urls
        await db.query(`INSERT INTO urls (url, "shortUrl", "createdByUserId") VALUES ($1, $2, $3);`, [url, shortUrl, userId.rows[0].userId]);

        //buscando os dados para mandar na resposta
        const searchUrl = await db.query(`SELECT id, "shortUrl", url FROM urls WHERE url = $1`, [url])

        res.status(201).send(searchUrl.rows[0])

    } catch (err) {
        res.status(500).send(err.message)
    }
}


export async function getUrlById(req, res) {
    const { id } = req.params;

    try {
        const url = await db.query(`SELECT id , "shortUrl", url FROM urls WHERE id = $1;` , [id])

        if (url.rowCount === 0) {
            return res.sendStatus(404)
        }

        res.status(200).send(url.rows[0])

    } catch (err) {
        res.status(500).send(err.message)
    }
}


export async function getRedirectUrl(req, res) {

    try {

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteUrl(req, res) {

    try {

    } catch (err) {
        res.status(500).send(err.message)
    }
}