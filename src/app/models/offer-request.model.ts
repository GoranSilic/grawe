import {Tariff} from './calculation-request.model';

export class OfferRequestModel {
  public tariff: Tariff;
  public customer: Customer;
  public insuredPersons: InsuredPerson[];

  constructor() {
    this.tariff = new Tariff();
    this.customer = new Customer();
    this.insuredPersons = [];
  }
}

export class Customer {
  public salutatoryAddress: number;
  public firstName: string;
  public lastName: string;
  public jmbg: string;
  public emailAddress: string;
  public phoneNumber: number;
  public address: Address;

  constructor() {
    this.address = new Address();
  }
}

export class InsuredPerson {
  public salutatoryAddress: number;
  public firstName: string;
  public lastName: string;
  public jmbg: string;
  public passportNumber: string;

  // new properties
  public dateOfBirth: string;

  constructor() {
    this.dateOfBirth = '-';
  }
}

export class Address {
  public street: string;
  public houseNumber: string;
  public houseNumberExtension: string;
  public zipCode: string;
  public town: string;
  public nation: string;
}


