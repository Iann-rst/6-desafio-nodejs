import { AppError } from './../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';

import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show Profile", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("should be able to show user profile", async()=>{
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "test123"
    });

    if(user.id){
      const userInfo = await showUserProfileUseCase.execute(user.id);
      //console.log(userInfo)
      expect(userInfo.id).toEqual(user.id);
    }
  })

  it("should not be able to show the profile of a non-existent user", ()=>{
    expect(async()=>{
      const user_id = "123"
      await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(AppError)
  })
})
