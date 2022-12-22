import { AppError } from './../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authentication User", ()=>{
  beforeEach(()=>{
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("should be able to authenticate user", async ()=>{

    const user = {
      email: "teste@email.com",
      name: "User Test",
      password: "teste123"
    }
    await createUserUseCase.execute(user)

    const authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authentication).toHaveProperty("token")
  })

  it("should not be able to authenticate user with wrong password", ()=>{
    expect(async ()=>{
      const user = {
        email: "teste@email.com",
        name: "User Test",
        password: "teste123"
      }
      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "134"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to authenticate non-existent user", ()=>{
    expect(async()=>{
      await authenticateUserUseCase.execute({
        email: "123@email.com",
        password: "123password"
      })
    })
  })
})
