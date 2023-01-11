import { IStatementsRepository } from './../../repositories/IStatementsRepository';
import { IUsersRepository } from './../../../users/repositories/IUsersRepository';
import { inject } from 'tsyringe';
import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/AppError';
import { OperationType } from '../../entities/Statement';

interface ITransfer {
  id: string;
  recipient_user: string;
  amount: number;
  description: string;
}

@injectable()
class CreateTransfersUseCase {

  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementRepository: IStatementsRepository
  ) { }
  async execute({ id, recipient_user, amount, description }: ITransfer) {
    /** Realizar uma transferência:
     * 1º Precisa do id do usuário que irá realizar a transferência;
     * 2º Precisa do id do usuário que vai receber a transferência;
     * 3º Valor transferindo não deve ser superior ao saldo da conta;
     */

    const sender_user = await this.userRepository.findById(id);

    if (!sender_user) {
      throw new AppError("User not found", 404)
    }

    const receiver_user = await this.userRepository.findById(recipient_user)
    if (!receiver_user) {
      throw new AppError("User not found", 404)
    }

    const { balance } = await this.statementRepository.getUserBalance({ user_id: id })
    if (amount > balance) {
      throw new AppError("Insufficient money to carry out the transfer!")
    }


    /**
     * TRANSFERÊNCIA: Saque da conta remetente e deposito na conta destinatária
     */

    // Operação de transferência na conta do usuário que vai fazer a transferência
    await this.statementRepository.create({
      type: OperationType.TRANSFER,
      amount,
      description,
      user_id: id
    })

    // Operação de transferência na conta do usuário que vai receber a transferência, passando como sender_id o ID do usuário que está realizando a transferência
    await this.statementRepository.create({
      type: OperationType.TRANSFER,
      amount,
      description,
      user_id: recipient_user,
      sender_id: id
    })


  }
}

export { CreateTransfersUseCase }
