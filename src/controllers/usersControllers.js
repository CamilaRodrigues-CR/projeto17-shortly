import db from "../database/connectionDatabase.js";


export async function getUsers(req, res) {
    const session = res.locals.session;

    if (!session) return res.status(401).send({ message: "envie um token na requisição!!" });

    try {
        //achar o id do usuario
        const userId = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [session.rows[0].token]);

        //preciso fazer um join do usuario com todos os seus links
        const user_url = await db.query(`SELECT users.*, urls.* FROM users JOIN urls ON users.id = urls."createdByUserId" WHERE users.id = $1;`, [userId.rows[0].userId])

        // preciso somar quantas visitas totais esse usuario tem
        const TotalvisitCount = await db.query(`SELECT SUM(visits) AS "visitCount" FROM urls WHERE "createdByUserId" = $1 GROUP BY "createdByUserId";`, [userId.rows[0].userId])

        //fazer o retorno das 2 tabelas no formato desejado:
        const result = user_url.rows.map(u => {
            const obj = {
                ...u,
                TotalvisitCount: TotalvisitCount.rows[0].visitCount,
                shortenedUrls: {
                    // id:u.urls.id,
                    shortUrl: u.shortUrl,
                    url: u.url,
                    visitCount: u.visits

                }
            }

            delete obj.email;
            delete obj.password;
            delete obj.url;
            delete obj.shortUrl;
            delete obj.createdByUserId;
            delete obj.createdAt;
            delete obj.visits


            return obj;

        });

        res.send(result);

        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

/*
  
       {
  id: 3,
  name: 'João',
  email: 'joao@driven.com.br',
  password: '$2b$10$AEx/kNrh3trxsac9YvTfL.l4iyZid926MxL020b6jyjMN6vfrcM82',
  createdat: 2023-09-30T14:52:10.883Z,
  url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOymDnSJ8A29IxPaq86wB7os59kt6Dbv1CwQ&usqp=CAU',
  shortUrl: '2wIeoe6VPe-YjEPfyUq2U',
  createdAt: 2023-10-02T14:52:11.932Z,
  createdByUserId: 2,
  visits: 0
}

  */