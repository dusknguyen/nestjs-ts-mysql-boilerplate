/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-plusplus */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import * as crypto from 'crypto';
import { ADMIN_ROLES } from 'src/constants';
import { ConfigEntity, Country, Roles, User } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class InitService {
  constructor(
    @InjectRepository(ConfigEntity) private configRepository: Repository<ConfigEntity>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    void this.initConfig();
    void this.initCountry();
    void this.initRoles();
    void this.initAdmin();
  }

  public async initConfig(): Promise<void> {
    const config = await this.configRepository.findOne({ where: { id: 1 } });
    if (config) return;
    const initConfig = new ConfigEntity();
    initConfig.id = 1;
    initConfig.mintingPhrase = new Date(Date.now());
    initConfig.revealPhrase = new Date(Date.now() + 10 * 60 * 1000);
    await this.configRepository.save(initConfig);
  }

  public async initCountry(): Promise<void> {
    const country = await this.countryRepository.find();
    if (!country || country.length === 0) {
      const defaultCountry = [
        {
          id: '1',
          country_name: 'Afghanistan',
        },
        {
          id: '2',
          country_name: 'Albania',
        },
        {
          id: '3',
          country_name: 'Algeria',
        },
        {
          id: '4',
          country_name: 'American Samoa',
        },
        {
          id: '5',
          country_name: 'Andorra',
        },
        {
          id: '6',
          country_name: 'Angola',
        },
        {
          id: '7',
          country_name: 'Anguilla',
        },
        {
          id: '8',
          country_name: 'Antarctica',
        },
        {
          id: '9',
          country_name: 'Antigua And Barbuda',
        },
        {
          id: '10',
          country_name: 'Argentina',
        },
        {
          id: '11',
          country_name: 'Armenia',
        },
        {
          id: '12',
          country_name: 'Aruba',
        },
        {
          id: '13',
          country_name: 'Australia',
        },
        {
          id: '14',
          country_name: 'Austria',
        },
        {
          id: '15',
          country_name: 'Azerbaijan',
        },
        {
          id: '16',
          country_name: 'Bahamas The',
        },
        {
          id: '17',
          country_name: 'Bahrain',
        },
        {
          id: '18',
          country_name: 'Bangladesh',
        },
        {
          id: '19',
          country_name: 'Barbados',
        },
        {
          id: '20',
          country_name: 'Belarus',
        },
        {
          id: '21',
          country_name: 'Belgium',
        },
        {
          id: '22',
          country_name: 'Belize',
        },
        {
          id: '23',
          country_name: 'Benin',
        },
        {
          id: '24',
          country_name: 'Bermuda',
        },
        {
          id: '25',
          country_name: 'Bhutan',
        },
        {
          id: '26',
          country_name: 'Bolivia',
        },
        {
          id: '27',
          country_name: 'Bosnia and Herzegovina',
        },
        {
          id: '28',
          country_name: 'Botswana',
        },
        {
          id: '29',
          country_name: 'Bouvet Island',
        },
        {
          id: '30',
          country_name: 'Brazil',
        },
        {
          id: '31',
          country_name: 'British Indian Ocean Territory',
        },
        {
          id: '32',
          country_name: 'Brunei',
        },
        {
          id: '33',
          country_name: 'Bulgaria',
        },
        {
          id: '34',
          country_name: 'Burkina Faso',
        },
        {
          id: '35',
          country_name: 'Burundi',
        },
        {
          id: '36',
          country_name: 'Cambodia',
        },
        {
          id: '37',
          country_name: 'Cameroon',
        },
        {
          id: '38',
          country_name: 'Canada',
        },
        {
          id: '39',
          country_name: 'Cape Verde',
        },
        {
          id: '40',
          country_name: 'Cayman Islands',
        },
        {
          id: '41',
          country_name: 'Central African Republic',
        },
        {
          id: '42',
          country_name: 'Chad',
        },
        {
          id: '43',
          country_name: 'Chile',
        },
        {
          id: '44',
          country_name: 'China',
        },
        {
          id: '45',
          country_name: 'Christmas Island',
        },
        {
          id: '46',
          country_name: 'Cocos (Keeling) Islands',
        },
        {
          id: '47',
          country_name: 'Colombia',
        },
        {
          id: '48',
          country_name: 'Comoros',
        },
        {
          id: '49',
          country_name: 'Congo',
        },
        {
          id: '50',
          country_name: 'Congo The Democratic Republic Of The',
        },
        {
          id: '51',
          country_name: 'Cook Islands',
        },
        {
          id: '52',
          country_name: 'Costa Rica',
        },
        {
          id: '53',
          country_name: "Cote D'Ivoire (Ivory Coast)",
        },
        {
          id: '54',
          country_name: 'Croatia (Hrvatska)',
        },
        {
          id: '55',
          country_name: 'Cuba',
        },
        {
          id: '56',
          country_name: 'Cyprus',
        },
        {
          id: '57',
          country_name: 'Czech Republic',
        },
        {
          id: '58',
          country_name: 'Denmark',
        },
        {
          id: '59',
          country_name: 'Djibouti',
        },
        {
          id: '60',
          country_name: 'Dominica',
        },
        {
          id: '61',
          country_name: 'Dominican Republic',
        },
        {
          id: '62',
          country_name: 'East Timor',
        },
        {
          id: '63',
          country_name: 'Ecuador',
        },
        {
          id: '64',
          country_name: 'Egypt',
        },
        {
          id: '65',
          country_name: 'El Salvador',
        },
        {
          id: '66',
          country_name: 'Equatorial Guinea',
        },
        {
          id: '67',
          country_name: 'Eritrea',
        },
        {
          id: '68',
          country_name: 'Estonia',
        },
        {
          id: '69',
          country_name: 'Ethiopia',
        },
        {
          id: '70',
          country_name: 'External Territories of Australia',
        },
        {
          id: '71',
          country_name: 'Falkland Islands',
        },
        {
          id: '72',
          country_name: 'Faroe Islands',
        },
        {
          id: '73',
          country_name: 'Fiji Islands',
        },
        {
          id: '74',
          country_name: 'Finland',
        },
        {
          id: '75',
          country_name: 'France',
        },
        {
          id: '76',
          country_name: 'French Guiana',
        },
        {
          id: '77',
          country_name: 'French Polynesia',
        },
        {
          id: '78',
          country_name: 'French Southern Territories',
        },
        {
          id: '79',
          country_name: 'Gabon',
        },
        {
          id: '80',
          country_name: 'Gambia The',
        },
        {
          id: '81',
          country_name: 'Georgia',
        },
        {
          id: '82',
          country_name: 'Germany',
        },
        {
          id: '83',
          country_name: 'Ghana',
        },
        {
          id: '84',
          country_name: 'Gibraltar',
        },
        {
          id: '85',
          country_name: 'Greece',
        },
        {
          id: '86',
          country_name: 'Greenland',
        },
        {
          id: '87',
          country_name: 'Grenada',
        },
        {
          id: '88',
          country_name: 'Guadeloupe',
        },
        {
          id: '89',
          country_name: 'Guam',
        },
        {
          id: '90',
          country_name: 'Guatemala',
        },
        {
          id: '91',
          country_name: 'Guernsey and Alderney',
        },
        {
          id: '92',
          country_name: 'Guinea',
        },
        {
          id: '93',
          country_name: 'Guinea-Bissau',
        },
        {
          id: '94',
          country_name: 'Guyana',
        },
        {
          id: '95',
          country_name: 'Haiti',
        },
        {
          id: '96',
          country_name: 'Heard and McDonald Islands',
        },
        {
          id: '97',
          country_name: 'Honduras',
        },
        {
          id: '98',
          country_name: 'Hong Kong S.A.R.',
        },
        {
          id: '99',
          country_name: 'Hungary',
        },
        {
          id: '100',
          country_name: 'Iceland',
        },
        {
          id: '101',
          country_name: 'India',
        },
        {
          id: '102',
          country_name: 'Indonesia',
        },
        {
          id: '103',
          country_name: 'Iran',
        },
        {
          id: '104',
          country_name: 'Iraq',
        },
        {
          id: '105',
          country_name: 'Ireland',
        },
        {
          id: '106',
          country_name: 'Israel',
        },
        {
          id: '107',
          country_name: 'Italy',
        },
        {
          id: '108',
          country_name: 'Jamaica',
        },
        {
          id: '109',
          country_name: 'Japan',
        },
        {
          id: '110',
          country_name: 'Jersey',
        },
        {
          id: '111',
          country_name: 'Jordan',
        },
        {
          id: '112',
          country_name: 'Kazakhstan',
        },
        {
          id: '113',
          country_name: 'Kenya',
        },
        {
          id: '114',
          country_name: 'Kiribati',
        },
        {
          id: '115',
          country_name: 'Korea North',
        },
        {
          id: '116',
          country_name: 'Korea South',
        },
        {
          id: '117',
          country_name: 'Kuwait',
        },
        {
          id: '118',
          country_name: 'Kyrgyzstan',
        },
        {
          id: '119',
          country_name: 'Laos',
        },
        {
          id: '120',
          country_name: 'Latvia',
        },
        {
          id: '121',
          country_name: 'Lebanon',
        },
        {
          id: '122',
          country_name: 'Lesotho',
        },
        {
          id: '123',
          country_name: 'Liberia',
        },
        {
          id: '124',
          country_name: 'Libya',
        },
        {
          id: '125',
          country_name: 'Liechtenstein',
        },
        {
          id: '126',
          country_name: 'Lithuania',
        },
        {
          id: '127',
          country_name: 'Luxembourg',
        },
        {
          id: '128',
          country_name: 'Macau S.A.R.',
        },
        {
          id: '129',
          country_name: 'Macedonia',
        },
        {
          id: '130',
          country_name: 'Madagascar',
        },
        {
          id: '131',
          country_name: 'Malawi',
        },
        {
          id: '132',
          country_name: 'Malaysia',
        },
        {
          id: '133',
          country_name: 'Maldives',
        },
        {
          id: '134',
          country_name: 'Mali',
        },
        {
          id: '135',
          country_name: 'Malta',
        },
        {
          id: '136',
          country_name: 'Man (Isle of)',
        },
        {
          id: '137',
          country_name: 'Marshall Islands',
        },
        {
          id: '138',
          country_name: 'Martinique',
        },
        {
          id: '139',
          country_name: 'Mauritania',
        },
        {
          id: '140',
          country_name: 'Mauritius',
        },
        {
          id: '141',
          country_name: 'Mayotte',
        },
        {
          id: '142',
          country_name: 'Mexico',
        },
        {
          id: '143',
          country_name: 'Micronesia',
        },
        {
          id: '144',
          country_name: 'Moldova',
        },
        {
          id: '145',
          country_name: 'Monaco',
        },
        {
          id: '146',
          country_name: 'Mongolia',
        },
        {
          id: '147',
          country_name: 'Montserrat',
        },
        {
          id: '148',
          country_name: 'Morocco',
        },
        {
          id: '149',
          country_name: 'Mozambique',
        },
        {
          id: '150',
          country_name: 'Myanmar',
        },
        {
          id: '151',
          country_name: 'Namibia',
        },
        {
          id: '152',
          country_name: 'Nauru',
        },
        {
          id: '153',
          country_name: 'Nepal',
        },
        {
          id: '154',
          country_name: 'Netherlands Antilles',
        },
        {
          id: '155',
          country_name: 'Netherlands The',
        },
        {
          id: '156',
          country_name: 'New Caledonia',
        },
        {
          id: '157',
          country_name: 'New Zealand',
        },
        {
          id: '158',
          country_name: 'Nicaragua',
        },
        {
          id: '159',
          country_name: 'Niger',
        },
        {
          id: '160',
          country_name: 'Nigeria',
        },
        {
          id: '161',
          country_name: 'Niue',
        },
        {
          id: '162',
          country_name: 'Norfolk Island',
        },
        {
          id: '163',
          country_name: 'Northern Mariana Islands',
        },
        {
          id: '164',
          country_name: 'Norway',
        },
        {
          id: '165',
          country_name: 'Oman',
        },
        {
          id: '166',
          country_name: 'Pakistan',
        },
        {
          id: '167',
          country_name: 'Palau',
        },
        {
          id: '168',
          country_name: 'Palestinian Territory Occupied',
        },
        {
          id: '169',
          country_name: 'Panama',
        },
        {
          id: '170',
          country_name: 'Papua new Guinea',
        },
        {
          id: '171',
          country_name: 'Paraguay',
        },
        {
          id: '172',
          country_name: 'Peru',
        },
        {
          id: '173',
          country_name: 'Philippines',
        },
        {
          id: '174',
          country_name: 'Pitcairn Island',
        },
        {
          id: '175',
          country_name: 'Poland',
        },
        {
          id: '176',
          country_name: 'Portugal',
        },
        {
          id: '177',
          country_name: 'Puerto Rico',
        },
        {
          id: '178',
          country_name: 'Qatar',
        },
        {
          id: '179',
          country_name: 'Reunion',
        },
        {
          id: '180',
          country_name: 'Romania',
        },
        {
          id: '181',
          country_name: 'Russia',
        },
        {
          id: '182',
          country_name: 'Rwanda',
        },
        {
          id: '183',
          country_name: 'Saint Helena',
        },
        {
          id: '184',
          country_name: 'Saint Kitts And Nevis',
        },
        {
          id: '185',
          country_name: 'Saint Lucia',
        },
        {
          id: '186',
          country_name: 'Saint Pierre and Miquelon',
        },
        {
          id: '187',
          country_name: 'Saint Vincent And The Grenadines',
        },
        {
          id: '188',
          country_name: 'Samoa',
        },
        {
          id: '189',
          country_name: 'San Marino',
        },
        {
          id: '190',
          country_name: 'Sao Tome and Principe',
        },
        {
          id: '191',
          country_name: 'Saudi Arabia',
        },
        {
          id: '192',
          country_name: 'Senegal',
        },
        {
          id: '193',
          country_name: 'Serbia',
        },
        {
          id: '194',
          country_name: 'Seychelles',
        },
        {
          id: '195',
          country_name: 'Sierra Leone',
        },
        {
          id: '196',
          country_name: 'Singapore',
        },
        {
          id: '197',
          country_name: 'Slovakia',
        },
        {
          id: '198',
          country_name: 'Slovenia',
        },
        {
          id: '199',
          country_name: 'Smaller Territories of the UK',
        },
        {
          id: '200',
          country_name: 'Solomon Islands',
        },
        {
          id: '201',
          country_name: 'Somalia',
        },
        {
          id: '202',
          country_name: 'South Africa',
        },
        {
          id: '203',
          country_name: 'South Georgia',
        },
        {
          id: '204',
          country_name: 'South Sudan',
        },
        {
          id: '205',
          country_name: 'Spain',
        },
        {
          id: '206',
          country_name: 'Sri Lanka',
        },
        {
          id: '207',
          country_name: 'Sudan',
        },
        {
          id: '208',
          country_name: 'Suriname',
        },
        {
          id: '209',
          country_name: 'Svalbard And Jan Mayen Islands',
        },
        {
          id: '210',
          country_name: 'Swaziland',
        },
        {
          id: '211',
          country_name: 'Sweden',
        },
        {
          id: '212',
          country_name: 'Switzerland',
        },
        {
          id: '213',
          country_name: 'Syria',
        },
        {
          id: '214',
          country_name: 'Taiwan',
        },
        {
          id: '215',
          country_name: 'Tajikistan',
        },
        {
          id: '216',
          country_name: 'Tanzania',
        },
        {
          id: '217',
          country_name: 'Thailand',
        },
        {
          id: '218',
          country_name: 'Togo',
        },
        {
          id: '219',
          country_name: 'Tokelau',
        },
        {
          id: '220',
          country_name: 'Tonga',
        },
        {
          id: '221',
          country_name: 'Trinidad And Tobago',
        },
        {
          id: '222',
          country_name: 'Tunisia',
        },
        {
          id: '223',
          country_name: 'Turkey',
        },
        {
          id: '224',
          country_name: 'Turkmenistan',
        },
        {
          id: '225',
          country_name: 'Turks And Caicos Islands',
        },
        {
          id: '226',
          country_name: 'Tuvalu',
        },
        {
          id: '227',
          country_name: 'Uganda',
        },
        {
          id: '228',
          country_name: 'Ukraine',
        },
        {
          id: '229',
          country_name: 'United Arab Emirates',
        },
        {
          id: '230',
          country_name: 'United Kingdom',
        },
        {
          id: '231',
          country_name: 'United States',
        },
        {
          id: '232',
          country_name: 'United States Minor Outlying Islands',
        },
        {
          id: '233',
          country_name: 'Uruguay',
        },
        {
          id: '234',
          country_name: 'Uzbekistan',
        },
        {
          id: '235',
          country_name: 'Vanuatu',
        },
        {
          id: '236',
          country_name: 'Vatican City State (Holy See)',
        },
        {
          id: '237',
          country_name: 'Venezuela',
        },
        {
          id: '238',
          country_name: 'Vietnam',
        },
        {
          id: '239',
          country_name: 'Virgin Islands (British)',
        },
        {
          id: '240',
          country_name: 'Virgin Islands (US)',
        },
        {
          id: '241',
          country_name: 'Wallis And Futuna Islands',
        },
        {
          id: '242',
          country_name: 'Western Sahara',
        },
        {
          id: '243',
          country_name: 'Yemen',
        },
        {
          id: '244',
          country_name: 'Yugoslavia',
        },
        {
          id: '245',
          country_name: 'Zambia',
        },
        {
          id: '246',
          country_name: 'Zimbabwe',
        },
        {
          id: '247',
          country_name: 'Other',
        },
      ];
      const countryList = new Array<Country>();
      for (let i = 0; i < defaultCountry.length; i++) {
        const newCountry = new Country();
        newCountry.id = i + 1;
        newCountry.countryName = defaultCountry[i].country_name;
        countryList.push(newCountry);
      }
      await this.countryRepository.save(countryList);
    }
  }

  public async initRoles(): Promise<void> {
    const check = await this.rolesRepository.find();
    if (!check || check.length === 0) {
      const admin = new Roles();
      admin.id = ADMIN_ROLES;
      await this.rolesRepository.save(admin);
    }
  }

  public async initAdmin(): Promise<void> {
    const userAdmin = await this.userRepository.find();
    if (!userAdmin || userAdmin.length === 0) {
      const username = 'admin';
      const password = process.env['ADMIN_PASSWORD'] || '123456';
      const email = 'admin@gmail.com';
      const newUserAdmin = new User();
      newUserAdmin.id = crypto.randomBytes(36).toString('hex').substr(1, 36);
      newUserAdmin.name = username;
      newUserAdmin.password = await hash(password, 10);
      newUserAdmin.email = email;
      const role = await this.rolesRepository.findOneBy({ id: ADMIN_ROLES });
      if (role) {
        newUserAdmin.roles.push(role);
      }

      await this.userRepository.save(newUserAdmin);
    }
  }
}
