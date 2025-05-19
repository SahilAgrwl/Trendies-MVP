import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';

// DTO for admin login
class AdminLoginDto {
  email: string;
  password: string;
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    const isValidAdmin = await this.adminService.validateAdmin(
      loginDto.email,
      loginDto.password,
    );

    if (!isValidAdmin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { success: true, email: loginDto.email };
  }
} 