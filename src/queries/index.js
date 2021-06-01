import client from '../database/index.js';

const createQuery = (obj) => {
    var keys = Object.keys(obj).filter((k) => {
        return obj[k] !== undefined && obj[k];
    });
    var names = keys.map((k, index) => {
        return k + ' = $' + (index + 1);
    }).join(', ');
    var values = keys.map((k) => {
        return obj[k];
    });
    return {
        query: names,
        values: values
    };
}

export const getUsers = async(req, res) => {
    try {
        const response = await client.query('SELECT * FROM users ORDER BY user_id ASC');

        if (response) {
            return res.status(200).json({ status: 'success', data: response.rows });
        }
    } catch (err) {
        console.log(err);
    }
};

export const createUsers = async(req, res) => {
    try {
        const { name, age } = req.body;
        const request = await client.query('INSERT INTO users (name, age)  VALUES ($1, $2) RETURNING *', [name, age]);
        res.json(`New user ${name} has been created with the age ${age}`);
    } catch (error) {
        console.log(error);
    }
};

export const updateUser = async(req, res) => {
    try {
        const { name, age } = req.body;
        const obj = {
            name,
            age
        }
        const { query, values } = createQuery(obj);
        const { id } = req.params
        console.log(query, values)

        await client.query(
            `UPDATE users SET ${query} WHERE user_id = $${values.length + 1}`, [...values, id]);

        const user = await client.query('SELECT * FROM users WHERE user_id = $1', [id]);

        console.log(user.rows);

        let response = ''
        if (name && age) {
            response = `name: ${name} & age: ${age}`
        } else if (name) {
            response = `name: ${name}`
        } else if (age) {
            response = `age: ${age}`
        }

        res.send(`Updated player ${id} with the ${response}`)
            // res.send(`Updated player ${id} with the name: ${name} and age ${age}`);
    } catch (error) {
        console.log(error)
    }
}

export const getUser = async(req, res) => {
    try {
        const { id } = req.params;
        const readUser = await client.query('SELECT * FROM users WHERE user_id = $1', [id]);
        res.send({ data: readUser.rows });
    } catch (error) {
        console.log(error)
    }
}

export const deleteUser = async(req, res) => {
    try {
        const { id } = req.params
        const deleteUser = await client.query(
            `DELETE FROM users WHERE user_id = $1`, [id]);
        res.send({ data: deleteUser.rows })
    } catch (error) {
        console.log(error);
    }
}