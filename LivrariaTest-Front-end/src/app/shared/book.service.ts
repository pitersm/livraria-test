import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseUrl = 'http://localhost:50750/api/book/';
  constructor(private http: HttpClient) { }
  books: Book[];

  getBook(id: string): Observable<Book> {
    return this.http.get(this.baseUrl + id)
      .pipe(map((response: any) => {
        const book: Book = response;
        return book;
      }));
  }

  saveBook(book: Book) {
    return this.http.post(this.baseUrl, book);
  }

  updateBook(book: Book) {
    return this.http.put(this.baseUrl + book.id, book);
  }

  listBooks(): Observable<Book[]> {
    return this.http.get(this.baseUrl)
      .pipe(map((response: any[]) => {
        this.books = response;
        return this.books.slice();
      }));
  }

  checkIfExists(isbn: number): Observable<boolean> {
    return this.http.get(this.baseUrl + 'isbn/' + isbn)
    .pipe(map((response: any) => {
      const exists: boolean = response;
      return exists;
    }));
  }

  deleteBook(id: string) {
    return this.http.delete(this.baseUrl + id);
  }
}
