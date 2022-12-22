import { AppError } from './../../../../shared/errors/AppError';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';

import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { OperationType } from '../../entities/Statement';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to create a statement", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@email.com",
      name: "user test",
      password: "123password"
    })
    const user_id = user.id

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 1200,
      description: '',
      type: OperationType.DEPOSIT
    })

    expect(statement).toHaveProperty("id")
  })

  it("should not be able to create a statement to non-existent user", () => {
    expect(async () => {
      const user_id = '12314';

      await createStatementUseCase.execute({
        user_id,
        amount: 1200,
        description: '',
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to WITHDRAW money from insufficient fund", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "teste@email.com",
        name: "user test",
        password: "123password"
      })

      const user_id = user.id

      await createStatementUseCase.execute({
        user_id,
        amount: 1200,
        description: '',
        type: OperationType.DEPOSIT
      })

      //Retirar 1300 dinheiro, sendo que tem 1200 depositado
      await createStatementUseCase.execute({
        user_id,
        amount: 1300,
        description: '',
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
