import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async validateAdmin(email: string, password: string): Promise<boolean> {
    // Using any to bypass TypeScript error since the model is correctly defined in schema
    const admin = await (this.prisma as any).admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return false;
    }

    // Simple password check (In a real-world app, you'd use bcrypt for hashed passwords)
    return admin.password === password;
  }
} 