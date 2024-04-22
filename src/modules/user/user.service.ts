import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createPaginator } from 'src/common/pagination';
import { USER_SECRET_KEY } from 'src/common/constant';

export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async updateById(id: string, data: any) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async create(data: any) {
    return await this.prismaService.user.create({ data });
  }

  async getById(id: string) {
    return await this.prismaService.user.findFirst({
      where: { id },
    });
  }

  async findUserByCondition(condition) {
    return await this.prismaService.user.findFirst({
      where: condition,
    });
  }

  update(data: {
    id: string;
    email?: string;
    resetPasswordToken?;
    tokenExpiryDate?;
  }) {
    const { id, email, resetPasswordToken, tokenExpiryDate } = data;
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        email: email || undefined,
        token_forgot_password: resetPasswordToken || undefined,
        token_forgot_password_expiry_date: tokenExpiryDate || undefined,
      },
    });
  }

  updateAccountInfo(
    id: string,
    {
      name,
    }: {
      name: string;
    }
  ) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  getUsers({
    perPage,
    page,
    keyword = "",
    typeAccount = "",
  }: {
    perPage: number;
    page: number;
    keyword: string;
    typeAccount: string;
  }) {
    const paginate = createPaginator({ perPage });
    let condition = {};
    if (typeAccount === "branch") {
      condition = {
        merchantId: null,
      };
    } else if (typeAccount === "merchant") {
      condition = {
        branchId: null,
      };
    }

    return paginate(
      this.prismaService.user,
      {
        where: {
          OR: [
            {
              email: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
          ...condition,
        },
        orderBy: {
          createdAt: {
            sort: "desc",
          },
        },
      },
      { page: page }
    );
  }

  login(user: any) {
    const jwtToken = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      { privateKey: USER_SECRET_KEY }
    );
    return jwtToken;
  }
}