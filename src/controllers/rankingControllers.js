import { db } from "../database/connectionDatabase.js"

export async function getRanking(req, res) {
    //devo retornar um array com os 10 primeiros 
    //cada objeto do array deve ter : id do usuario, nome, número total de urls, e total de visitas de todos as urls

    try {

        const search = await db.query(`
        SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", SUM(visits) AS "visitCount"
        FROM users
        JOIN urls ON users.id = urls."createdByUserId"
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10;
    `);

    res.status(200).send(search.rows);

    /*
        //contar quantas urls um usuario tem
        const search = await db.query(`SELECT users.id, users.name, COUNT(urls.id) AS "linksCount"
        FROM users
        JOIN urls ON users.id = urls."createdByUserId"
        GROUP BY users.id;`)

        //somar quantas visitas ele tem
        const visits = await db.query(`SELECT SUM(visits) AS "visitCount" FROM urls GROUP BY "createdByUserId";`)

        //retornar no formato desejado
        const result = search.rows.map(r => {
            const obj = {
                ...r,
                visitCount: visits.rows[0].visitCount
            }

            return obj;
        })

        res.status(200).send(result.slice(-10))
        */

    } catch (err) {
        res.status(500).send(err.message)
    }
}