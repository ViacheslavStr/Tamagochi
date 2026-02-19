import { Body, Controller, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put('onboarded')
  @UseGuards(JwtAuthGuard)
  async markAsOnboarded(@Request() req) {
    return this.usersService.markAsOnboarded(req.user.id);
  }
}
