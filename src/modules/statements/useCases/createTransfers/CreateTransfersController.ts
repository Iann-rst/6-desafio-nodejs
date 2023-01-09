import { Request, Response } from "express";
import { CreateTransfersUseCase } from './CreateTransfersUseCase';

class CreateTransfersController {
  async handle(request: Request, response: Response) {
    /**
     * Usuário que fará a transferência precisa está autenticado;
     * Passa o id do usuário destinatário via parâmetro de rota;
     *
     * Corpo da requisição deve conter o { amount e description} da transferência
     */
  }
}

export { CreateTransfersController }
