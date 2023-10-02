import { db } from "../database/connectionDatabase.js";


export async function getUsers(req, res) {
    const session = res.locals.session;

    if (!session) return res.status(401).send({ message: "envie um token na requisição!!" });

    try {
        //achar o id do usuario
        const userId = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [session.rows[0].token]);

        //preciso fazer um join do usuario com todos os seus links
        const user_url = await db.query(`SELECT users.id, users.name, urls.* FROM users JOIN urls ON users.id = urls."createdByUserId" WHERE users.id = $1;`, [userId.rows[0].userId])

        // preciso somar quantas visitas totais esse usuario tem
        const TotalvisitCount = await db.query(`SELECT SUM(visits) AS "visitCount" FROM urls WHERE "createdByUserId" = $1 GROUP BY "createdByUserId";`, [userId.rows[0].userId])

        //fazer o retorno das 2 tabelas no formato desejado: 
        //(usar o reduce ou invés de map para ter o retorno no formato de objeto e não de array!!!)
        const result = user_url.rows.reduce((acc, u) => {
            const obj = {
                ...u,
                visitCount: TotalvisitCount.rows[0].visitCount,
                shortenedUrls: [
                    {
                        shortUrl: u.shortUrl,
                        url: u.url,
                        visitCount: u.visits

                    }
                ]
            }

            delete obj.url;
            delete obj.shortUrl;
            delete obj.createdByUserId;
            delete obj.createdAt;
            delete obj.visits


            return obj;
        }, {});

        res.status(200).send(result);


    } catch (err) {
        res.status(500).send(err.message)
    }
}
