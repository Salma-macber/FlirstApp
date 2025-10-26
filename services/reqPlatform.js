const reqPlatform = ({ req: req, res: res, body: body, path: path, status: status }) => {
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(status ?? 200).json(body);
    }
    else return res.render(path, body);
}

module.exports = reqPlatform;