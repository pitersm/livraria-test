export class Book {
  constructor (
  public id: string,
  public name: string,
  public publisher: string,
  public author: string,
  public isbn: number,
  public price: number,
  public sales: number,
  public publicationDate: Date) {}
}
