import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "test@email.com",
      password: "test123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with email exists",()=>{
    expect(async ()=>{
      await createUserUseCase.execute({
        name: "User Test",
        email: "test@email.com",
        password: "test123",
      });

      await createUserUseCase.execute({
        name: "User Test 2",
        email: "test@email.com",
        password: "test123",
      });
    }).rejects.toBeInstanceOf(AppError)
  } )
});
