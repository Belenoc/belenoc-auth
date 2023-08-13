import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from '../common/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(CreateUserDto: UserDto): Promise<User> {
    try {
      const { password, ...userData } = CreateUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: this.hashService.hashPassword(password),
      });
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(LoginUserDto: UserDto): Promise<User> {
    const { password, email } = LoginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!this.hashService.comparePasswords(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return user;
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(
      'Internal server error, please contact administrator',
    );
  }
}
