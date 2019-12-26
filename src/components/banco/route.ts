import * as controller  from './controller';
import  {validar}  from '../../helpers/aunthentication';
import  { Router,Request,Response } from 'express';
const router = Router();


router.get('/',validar, async (req:Request, res:Response):Promise<Response> => {
    try {
        let {message,response,code} = await controller.get(req.query);
        if(message) return res.status(code).json(message);
        return res.status(code).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error interno"});
    }
});

router.get('/:id',validar, async (req:Request, res:Response):Promise<Response> => {
    let {id} = req.params;
    try {
        let {message,response,code} = await controller.getOne(id,req.query);
        if(message) return res.status(code).json(message);
        return res.status(code).json(response);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error interno"});
    }
});

router.post('/',validar, async (req:Request, res:Response):Promise<Response> => {
    try {
        let {response,code} = await controller.create(req.body);
        return res.status(code).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error interno"});
    }
});

router.post('/:id',validar, async (req:Request, res:Response):Promise<Response> => {
    try {
        let {response,code} = await controller.update(req.params,req.body);
        return res.status(code).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error interno"});
    }
});

router.delete('/:id',validar, async (req:Request, res:Response):Promise<Response> => {
    try {
        let {response,code} = await controller.remove(req.params);
        return res.status(code).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error interno"});
    }
});

export default router;