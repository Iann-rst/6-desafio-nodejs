import { AppError } from './../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';


import { GetBalanceUseCase } from './GetBalanceUseCase';

import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { OperationType } from '../../entities/Statement';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should be able to get user balance", async () => {

    //Cria o usuário
    const user = await createUserUseCase.execute({
      email: "test@test.com",
      name: "test",
      password: "test"
    });

    const user_id = user.id
    //Cria uma operação de deposito
    await createStatementUseCase.execute({
      user_id,
      amount: 600,
      description: "depósito",
      type: OperationType.DEPOSIT
    })

    //Cria uma operação de saque
    await createStatementUseCase.execute({
      user_id,
      amount: 400,
      description: "saque",
      type: OperationType.WITHDRAW
    })

    //Pega o saldo do usuário

    const balance = await getBalanceUseCase.execute({
      user_id
    })

    //console.log(balance)

    expect(balance.statement.length).toEqual(2);
    expect(balance.balance).toEqual(200);
  })

  it("should not be able to get balance of non-existent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "123"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
