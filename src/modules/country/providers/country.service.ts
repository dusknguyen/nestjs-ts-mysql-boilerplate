import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entity';
import { Repository } from 'typeorm';

import { CountryModel } from '../model';

@Injectable()
export class CountryService {
  constructor(@InjectRepository(Country) private countryRepository: Repository<Country>) {}

  public async getCountries(): Promise<CountryModel[]> {
    return this.countryRepository.find();
  }
}
