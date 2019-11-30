
const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM cines WHERE id = ?', [pId], (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        });
    });
}


module.exports = {
    getById: getById
}