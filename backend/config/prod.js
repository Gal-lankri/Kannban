require('dotenv').config()

module.exports = {
  dbURL: `mongodb+srv://${process.env.DB_KEY}@cluster0.qmzv1ed.mongodb.net/?retryWrites=true&w=majority`,
  dbName : 'board_db'
}
