/**
 *    ____                  __________
 *   / __ \_   _____  _____/ __/ / __ \_      __
 *  / / / / | / / _ \/ ___/ /_/ / / / / | /| / /
 * / /_/ /| |/ /  __/ /  / __/ / /_/ /| |/ |/ /
 * \____/ |___/\___/_/  /_/ /_/\____/ |__/|__/
 *
 * The copyright indication and this authorization indication shall be
 * recorded in all copies or in important parts of the Software.
 *
 * @github https://github.com/0verfl0w767
 *
 */
import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { V1Service } from './service'

@Controller('v1/professor')
export class V1Controller {
  public constructor(private readonly Service: V1Service) {}

  @Get('list')
  public async getProfessorList(@Res() res: Response) {
    return await this.Service.getProfessorList(res)
  }

  @Get(':name')
  public async getProfessor(@Param('name') name: string, @Res() res: Response) {
    return await this.Service.getProfessor(name, res)
  }
}
