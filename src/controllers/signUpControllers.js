import { db } from "../database/connectionDatabase.js";
import bcrypt from 'bcrypt';

export async function postSignUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    const senha = password;

    const passwordHash = bcrypt.hashSync(senha, 10);

    if (password !== confirmPassword) {
        return res.status(422).send({ message: 'As senhas devem ser iguais!' })
    }

    try {

        const search = await db.query(`SELECT email FROM users WHERE email = $1`, [email])

        if (search.rowCount > 0) return res.status(409).send('email já cadastrado');

        const user = await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
            [name, email, passwordHash]);

        res.status(201).send(user.rows[0])

    } catch (err) {
        res.status(500).send(err.message)
    }
}