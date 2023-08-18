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
import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'

export class V1Service {
  public constructor() {}

  public getUndergraduate(year: string, semester: string, id: string, res: Response) {
    const convertSemester = {
      '1': '1학기 정규',
      '2': '2학기 정규',
    }

    if (!(semester in convertSemester)) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'unknown semester.',
      })
      return
    }

    const mainPath = process.cwd() + '/undergraduate/' + year + '/' + convertSemester[semester]

    if (!fs.existsSync(mainPath)) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'undergraduates file is not found.',
      })
      return
    }

    const subPath = mainPath + '/학부(과).json'

    if (!fs.existsSync(subPath)) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'undergraduates list file is not found.',
      })
      return
    }

    const undergraduates = JSON.parse(fs.readFileSync(subPath, 'utf8'))

    const undergraduate = undergraduates['api'].find((undergraduate: { [element: string]: string }) => undergraduate['식별번호'] == id)

    if (undergraduate === undefined) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'undergraduate id is not found.',
      })
      return
    }

    const dataPath = mainPath + '/전체대학/' + undergraduate['학부(과)'] + '.json'

    if (!fs.existsSync(dataPath)) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'undergraduate file is not found.',
      })
      return
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      api: data['api'],
    })
  }
}
