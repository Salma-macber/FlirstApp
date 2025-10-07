
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    console.log('Error received', statusCode)
    console.error(err.stack)
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({ title: 'Error', message: err.message })
    }
    else return res.redirect('/error?message=' + err.message)

}

module.exports = { errorHandler }





//try to understand the error handling middleware
// run=> http://localhost:3000/error