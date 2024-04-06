import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      //create a fake copy of the auth  service
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it(' can create an instance of auth service', async () => {
    //create  fake copy of the users service]
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asddas@gmail.com', 'sdfsdf');
    expect(user.password).not.toEqual('asdda');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('assssdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  // it('throws if an invalid password is provided', async () => {
  //   fakeUsersService.find = () =>
  //     Promise.resolve([
  //       { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
  //     ]);
  //   await expect(
  //     service.signin('laskdjf@alskdfj.com', 'passowrd'),
  //   ).rejects.toThrow(BadRequestException);
  // });

  it('throws if an invlaid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdf');

    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'fvxcvc@gmail.com', password: 'safbbvcx' } as User,
      ]);
    await expect(
      service.signin('fvxcvc@gmail.com', 'safbbvcx'),
    ).rejects.toThrow(BadRequestException);
  });

  // it('return a user if current password is provided', async () => {
  //   await service.signup('examplle@gmail.com', '05040hff');
  //   const user = await service.signin('examplle@gmail.com', '05040hffsaasaas');
  //   expect(user).toBeDefined();
  // });
});
