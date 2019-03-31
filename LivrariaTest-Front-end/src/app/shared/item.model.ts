export class Item {
  constructor (
  public name: string,
  public unitOfMeasure: string,
  public quantity: number,
  public price: number,
  public perishable: boolean,
  public validityDate: Date,
  public manufactureDate: Date) {}
}
