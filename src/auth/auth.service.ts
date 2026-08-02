import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await argon2.hash(registerDto.password);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return this.generateTokens(user.id, user.role);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Неверные учетные данные');

    if (user.lockoutUntil && new Date() < user.lockoutUntil) {
      throw new ForbiddenException('Аккаунт временно заблокирован. Повторите попытку через 15 минут.');
    }

    const isPasswordValid = await argon2.verify(user.password, loginDto.password);

    if (!isPasswordValid) {
      const attempts = user.failedLoginAttempts + 1;
      let lockoutUntil = null;
      
      if (attempts >= 5) {
        lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
      }
      
      await this.usersService.updateLoginAttempts(user.id, attempts, lockoutUntil);
      throw new UnauthorizedException('Неверные учетные данные');
    }

    if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
      await this.usersService.updateLoginAttempts(user.id, 0, null);
    }

    return this.generateTokens(user.id, user.role);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Доступ запрещен');

    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Доступ запрещен');

    return this.generateTokens(user.id, user.role);
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}