import userModle from './../DB/models/User.model.js';
import jwt  from 'jsonwebtoken';

export const auth = ()=>{
    return async(req, res, next)=>{
        const {authorization} = req.headers
        try {
            if (!authorization.startsWith(process.env.BearerKey)) {
                res.status(400).json({message : 'In-valid token or In-valid Bearer Token'})
            } else {
                const token = authorization.split(process.env.BearerKey)[1]
                const decoded = jwt.verify(token,process.env.TOKENSIGNATURE)
                if (!decoded?.id || !decoded.isLoggedIn) {
                    res.status(400).json({message : 'In-valid payload'})
                } else {
                    const user = await userModle.findById(decoded.id).select('userName email')
                    if (!user) {
                        res.status(400).json({message : 'In-valid token user'})
                    } else {
                        req.authUser = user
                        next()
                    }
                }
            }
        } catch (error) {
            res.status(500).json({message : 'catch error', error})
        }
    }
}