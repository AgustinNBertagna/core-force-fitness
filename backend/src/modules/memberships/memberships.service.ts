import { Injectable } from '@nestjs/common';

@Injectable()
export class MembershipsService {
  findAll() {
    return `This action returns all memberships`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }
}
