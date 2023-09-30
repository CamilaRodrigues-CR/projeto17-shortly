import { nanoid } from "nanoid";
import db from "../database/connectionDatabase.js";


export async function postUrl(req, res) {
    const { url } = req.body;
    const session = res.locals.session;

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
        const url = await db.query(`SELECT id , "shortUrl", url FROM urls WHERE id = $1;`, [id])

        if (url.rowCount === 0) {
            return res.sendStatus(404)
        }

        res.status(200).send(url.rows[0])

    } catch (err) {
        res.status(500).send(err.message)
    }
}


export async function getRedirectUrl(req, res) {
    //Esta **não é** uma rota autenticada.
    // Redirecionar o usuário para o link correspondente.
    //Aumentar um na contagem de visitas do link.
    //Caso a url encurtada não exista, responder com *status code* `404`.
    //rota ('/urls/open/:shortUrl')
    const { shortUrl } = req.params;

    try {
        const url = await db.query(`SELECT url FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);

        if (url.rowCount === 0) {
            return res.sendStatus(404);
        } else {

            await db.query(`UPDATE urls SET visits = visits+1 WHERE "shortUrl"=$1;`, [shortUrl]);

            res.status(302).redirect(`/${url.rows[0].url}`)

        }

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteUrl(req, res) {  // rota ('/urls/:id')
    const { id } = req.params                 // o id é da url ?
    const session = res.locals.session


    if (!session) return res.status(401).send({ message: "envie um token na requisição!!" })   // verificar o token

    try {

        // achar a shortUrl do id recebido
        const findShortUrl = await db.query(`SELECT "shortUrl", "createdByUserId" FROM urls WHERE id = $1;`, [id])

        if (findShortUrl.rowCount === 0) return res.sendStatus(404);   // erro se não encontrar a url encurtada

        //verificar se a url pertence ao usuario (comparar o id session com "createdByUserId")
        const userId = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [session.rows[0].token])

        if (userId.rows[0].userId === findShortUrl.rows[0].createdByUserId) {
            await db.query(`DELETE FROM urls WHERE "id" = $1;`, [id])   // fazer a query para o delete

            res.sendStatus(204)

        } else {
            res.sendStatus(401)
        }

    } catch (err) {
        res.status(500).send(err.message)
    }
}