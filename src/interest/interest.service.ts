import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import * as fs from 'fs';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private notificationRepository: Repository<Interest>,
    private manager: EntityManager,

  ) {}
  async create(createInterestDto: CreateInterestDto) {
    const {
    name,
    description
    } = createInterestDto;
    const payload = await this.manager.query(
      'insert into interests' + 
      '(id,name,description)' + 
      'values ($1,$2)'
      ,[
        name,
        description
      ]);
      if(!payload) return 'Could not create a new interest';
    return payload;
  }

  async findAll() {
    const payload = await this.manager.query(
      'select * from interests',
      []);
    return payload;
  }

  async findOne(id: number) {
    const payload = await this.manager.query(
      'select * from notifications where id = $1',
      [id]);
    if(!payload) throw new NotFoundException(`Interest with ID ${id} not found.`)
    return payload;
  }

  async update(id: number, updateInterestDto: UpdateInterestDto) {
    const {
      name,
      description
      } = updateInterestDto;
    const payload = await this.manager.query(
      'update interests ' + 'set name = $2,' +
      'description = $3,' +
      'where id = $1',
      [
        id,
        name,
        description
      ]);
    return `Updated interest`;
  }

  async remove(id: number) {
    const payload = await this.manager.query('delete from interests where id = $1',[id])
    if(!payload) throw new NotFoundException(`Interest with ID ${id} not found.`);
    return `Deleted interest`;
  }

  async getInterests(){
    const filePath = '../../BlindMatch/blindmatch-server/data/hobbies.csv';
    const data = await fs.promises.readFile(filePath, 'utf8');
    const hobbies = data.split('\n');
    return hobbies;
  }

  async setInterests(id: number,selected:any[]){
    const blocked = [];
    const payload = await this.manager.query(
      'insert into user_interests' + 
      '(user_id,selected,blocked)' + 
      'values ($1,$2,$3)'
      ,[
        id,
        selected,
        blocked
      ]);
    return payload;
  }


}
