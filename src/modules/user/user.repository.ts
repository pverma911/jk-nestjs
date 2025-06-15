import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';

/**
 * User Repository
 */
@Injectable()
export class UserRepository extends Repository<User> {
    constructor (private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findUserByEmail(email: string) {
        return this.findOneBy({ email })
    }

    async findById(id: string) {
        return this.findOneBy({ id })
    }
}
