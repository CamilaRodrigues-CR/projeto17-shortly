import { db } from "../database/connectionDatabase.js"

export async function getRanking(req, res) {
    //devo retornar um array com os 10 primeiros 
    //cada objeto do array deve ter : id do usuario, nome, número total de urls, e total de visitas de todos as urls

    try {
        // preciso fazer a contagem de urls e a soma das visitas
        // agrupar todos os dados de um mesmo usuario 
        //preciso ordenar o retorno para os 10 ultimos e limitar a 10
        
        const search = await db.query(`
        SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", SUM(visits) AS "visitCount"
        FROM users
        JOIN urls ON users.id = urls."createdByUserId"
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10;
    `);

    res.status(200).send(search.rows);

    } catch (err) {
        res.status(500).send(err.message)
    }
}