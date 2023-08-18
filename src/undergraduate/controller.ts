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

@Controller('v1/undergraduate')
export class V1Controller {
  public constructor(private readonly Service: V1Service) {}

  @Get(':year/:semester/:id')
  public getProduct(@Param('year') year: string, @Param('semester') semester: string, @Param('id') id: string, @Res() res: Response) {
    return this.Service.getUndergraduate(year, semester, id, res)
  }
}
