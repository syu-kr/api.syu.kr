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
import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER } from '@nestjs/cache-manager/dist'
import { HttpStatus } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { AxiosError, AxiosResponse } from 'axios'
import { Cache } from 'cache-manager'
import { Response } from 'express'
import * as fs from 'fs'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class V1Service {
  public githubURL: string = 'https://raw.githubusercontent.com/syu-kr/lecture.syu.kr-suwings/main/data/'

  public constructor(private readonly HttpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async getUndergraduateList(res: Response) {
    const rawGithub = this.githubURL + new Date().getFullYear() + '/1학기 정규'
    const undergraduateList1 = this.HttpService.get(rawGithub + '/학부(과).json')
    let undergraduateList = {}

    await lastValueFrom(undergraduateList1)
      .then((response: AxiosResponse) => {
        undergraduateList = response.data['api']
      })
      .catch((error: AxiosError) => {
        console.log(error.response.data)
      })

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      api: undergraduateList,
    })
  }

  public async getUndergraduate(year: string, semester: string, id: string, res: Response) {
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

    const rawGithub = this.githubURL + year + '/' + convertSemester[semester]
    // const undergraduateList = this.HttpService.get(rawGithub + '/학부(과).json')
    // let undergraduateName = ''

    const redisData = await this.cacheManager.get(year + ':' + semester + ':' + id)

    if (redisData) {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        api: redisData,
      })
      return
    }

    // await lastValueFrom(undergraduateList)
    //   .then((response: AxiosResponse) => {
    //     undergraduateName = response.data['api'].find((undergraduate: { [element: string]: string }) => undergraduate['식별번호'] == id)
    //   })
    //   .catch((error: AxiosError) => {
    //     console.log(error.response.data)
    //   })

    const undergraduate = this.HttpService.get(rawGithub + '/전체대학/' + id + '.json')
    let undergraduateData = {}

    await lastValueFrom(undergraduate)
      .then((response: AxiosResponse) => {
        undergraduateData = response.data['api']
      })
      .catch((error: AxiosError) => {
        console.log(error.response.data)
      })

    await this.cacheManager.set(year + ':' + semester + ':' + id, undergraduateData)

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      api: undergraduateData,
    })

    // const mainPath = process.cwd() + '/undergraduate/' + year + '/' + convertSemester[semester]

    // if (!fs.existsSync(mainPath)) {
    //   res.status(HttpStatus.NOT_FOUND).json({
    //     statusCode: HttpStatus.NOT_FOUND,
    //     message: 'undergraduates file is not found.',
    //   })
    //   return
    // }

    // const subPath = mainPath + '/학부(과).json'

    // if (!fs.existsSync(subPath)) {
    //   res.status(HttpStatus.NOT_FOUND).json({
    //     statusCode: HttpStatus.NOT_FOUND,
    //     message: 'undergraduates list file is not found.',
    //   })
    //   return
    // }

    // const undergraduates = JSON.parse(fs.readFileSync(subPath, 'utf8'))

    // const undergraduate = undergraduates['api'].find((undergraduate: { [element: string]: string }) => undergraduate['식별번호'] == id)

    // if (undergraduate === undefined) {
    //   res.status(HttpStatus.NOT_FOUND).json({
    //     statusCode: HttpStatus.NOT_FOUND,
    //     message: 'undergraduate id is not found.',
    //   })
    //   return
    // }

    // const dataPath = mainPath + '/전체대학/' + undergraduate['학부(과)'] + '.json'

    // if (!fs.existsSync(dataPath)) {
    //   res.status(HttpStatus.NOT_FOUND).json({
    //     statusCode: HttpStatus.NOT_FOUND,
    //     message: 'undergraduate file is not found.',
    //   })
    //   return
    // }

    // const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    // res.status(HttpStatus.OK).json({
    //   statusCode: HttpStatus.OK,
    //   api: data['api'],
    // })
  }
}
