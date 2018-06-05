export class CalculationRequestModel {
  public tariff: Tariff;

  constructor() {
    this.tariff = new Tariff();
  }
}

export class Tariff {
  public insuranceBeginDate: string;
  public insuranceEndDate: string;
  public fullYear: boolean;
  public productVariant: number;
  public insuranceCoverage: number;
  public amountInsured: number;
  public travelReason: number;
  public cancellationInsurance: boolean;
  public bookingDate: string;

  // new property
  public premiumRsd: number;
  public premiumEur: number;
}
