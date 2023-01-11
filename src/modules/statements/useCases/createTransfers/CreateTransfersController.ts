import { container } from 'tsyringe';
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
    const { id } = request.user //id do usuário autenticado (que fará a transferência)
    const { recipient_user } = request.params; //id do usuário destinatário
    const { amount, description } = request.body // amount e description da transação

    const createTransfersUseCase = container.resolve(CreateTransfersUseCase);

    await createTransfersUseCase.execute({ id, recipient_user, amount, description });
    return response.status(201).send();
  }
}

export { CreateTransfersController }
