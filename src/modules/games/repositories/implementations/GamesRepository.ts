import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('games')
      .where("games.title ILIKE :title", { title:`%${param}%` })
      .getMany()
    
    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
      SELECT COUNT(*) as count FROM games
    `);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder('games')
      .innerJoinAndSelect('games.users', 'users')
      .where('games.id = :id', { id })
      .getOneOrFail() 

    const { users } = game
    
    return users
  }
}
