import db from "../database/connectionDatabase.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';



export async function postSignIn(req, res){
    const {email, password} = req.body;

    try{
         //preciso buscar a senha e o email salvos no banco
        const user = await db.query(`SELECT id, email, password FROM users WHERE email = $1;`, [email])

        //comparar se os dados de login da requisição, são os mesmos que estão no banco
        if(user.rows[0].email && bcrypt.compareSync(password, user.rows[0].password)) {

             //gerar um token de acesso
            const token = uuid();
            console.log(token);

            //inserir esse token na tabela sessions
            const session = await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2);`, [token, user.rows[0].id])

             // enviar esse token como resposta
            return res.status(200).send({token: token})

        } else {
            res.status(401).send({message: "Email ou senha incorretos"});
        }

    } catch (err){
        res.status(500).send(err.message)
    }
}