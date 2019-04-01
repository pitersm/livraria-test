export class Book {
  constructor (
  public id: string,
  public name: string,
  public publisher: string,
  public author: string,
  public isbn: string,
  public price: number,
  public publicationDate: Date) {}
}
