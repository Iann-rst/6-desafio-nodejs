import { AppError } from './../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';


import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { OperationType } from '../../entities/Statement';


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to get statement operation", async () => {
    //criar o usuário
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "test@test.com",
      password: "password"
    })

    const user_id = user.id;

    //Criar uma operação de depósito
    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 600,
      description: "deposito",
      type: OperationType.DEPOSIT
    })

    //ID da primeira operação
    const statement_id = statement.id;

    //Criar um segunda operação de depósito
    await createStatementUseCase.execute({
      user_id,
      amount: 600,
      description: "deposito",
      type: OperationType.DEPOSIT
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id
    })

    expect(statementOperation.user_id).toEqual(user_id);
    expect(statementOperation).toHaveProperty("id");
  })

  it("should not be able to get statement operation of non-existent user", () => {
    expect(async () => {

      //criar o usuário
      const user = await createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "password"
      })

      const user_id = user.id;

      //Criar uma operação de depósito para o usuário
      const statement = await createStatementUseCase.execute({
        user_id,
        amount: 600,
        description: "deposito",
        type: OperationType.DEPOSIT
      })

      await getStatementOperationUseCase.execute({
        user_id: '123',
        statement_id: statement.id
      })
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to get statement operation of non-existent statement", async () => {
    expect(async () => {

      //criar o usuário
      const user = await createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "password"
      })

      const user_id = user.id;

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "statement.id"
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
