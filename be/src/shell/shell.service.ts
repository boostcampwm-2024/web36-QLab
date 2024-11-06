import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shell } from './shell.entity';
import { CreateShellDto } from './dto/create-shell.dto';
import { UpdateShellDto } from './dto/update-shell.dto';

@Injectable()
export class ShellService {
  constructor(
    @InjectRepository(Shell)
    private shellRepository: Repository<Shell>,
  ) {}

  async create(createShellDto: CreateShellDto) {
    const existedShell = await this.shellRepository.findOne({
      where: createShellDto,
    });
    if (existedShell) {
      throw new BadRequestException('shell already exist');
    }
    const shell = this.shellRepository.create(createShellDto);
    return this.shellRepository.save(shell);
  }

  async update(shellId: number, updateShellDto: UpdateShellDto) {
    const originShell = await this.shellRepository.findOne({
      where: { shellId },
    });
    if (!originShell) {
      throw new NotFoundException('shell not found');
    }
    return this.shellRepository.save({
      ...originShell,
      ...updateShellDto,
    });
  }

  async delete(shellId: number) {
    const { affected } = await this.shellRepository.delete({
      shellId: shellId,
    });
    if (!affected) {
      throw new NotFoundException('shell not found');
    }
  }
}