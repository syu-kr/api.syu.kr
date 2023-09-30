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
  public constructor(private readonly HttpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async getProfessorList(res: Response) {
    const getProfessorList = this.HttpService.get('https://raw.githubusercontent.com/syu-kr/lecture.syu.kr-analysis/main/professor.json')
    let getProfessorListData = {}

    await lastValueFrom(getProfessorList)
      .then((response: AxiosResponse) => {
        getProfessorListData = response.data
      })
      .catch((error: AxiosError) => {
        console.log(error.response.data)
      })

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      api: getProfessorListData,
    })
  }

  public async getProfessor(name: string, res: Response) {
    const getProfessor = this.HttpService.get('https://raw.githubusercontent.com/syu-kr/cse-lecture/main/data/' + name + '.json')
    let getProfessorData = {}

    await lastValueFrom(getProfessor)
      .then((response: AxiosResponse) => {
        getProfessorData = response.data
      })
      .catch((error: AxiosError) => {
        console.log(error.response.data)
      })

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      api: getProfessorData,
    })
  }
}
