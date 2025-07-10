import { Router, Request, Response } from 'express';

class HealthCheckController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.check.bind(this));
    }

    check = (req: Request, res: Response): Response => {
        return res.status(200).json({
            status: 'OK',
            message: this.getSomething(),
        });
    };

    getSomething = () => {
        return 'hahaah';
    };
}

export default new HealthCheckController().router;
