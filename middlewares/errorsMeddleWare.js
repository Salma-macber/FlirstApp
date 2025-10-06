
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    console.log('Error received', statusCode)
    console.error(err.stack)
    // res.status(statusCode).json({ message: err.message, status: statusCode })
    res.redirect('/error?message=' + err.message)

}

module.exports = { errorHandler }





//try to understand the error handling middleware
// run=> http://localhost:3000/error