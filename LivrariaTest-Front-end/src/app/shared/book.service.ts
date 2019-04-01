import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseUrl = 'http://localhost:50750/api/';
  constructor(private http: HttpClient) { }
  books: Book[];

  getBook(id: string): Observable<Book> {
    return this.http.get(this.baseUrl + 'book/' + id)
      .pipe(map((response: any) => {
        const book: Book = response;
        return book;
      }));
  }

  saveBook(book: Book) {
    localStorage.setBook(book.name, JSON.stringify(book));
  }

  listBooks(): Observable<Book[]> {
    return this.http.get(this.baseUrl + 'book')
      .pipe(map((response: any[]) => {
        this.books = response;
        return this.books.slice();
      }));
  }

  checkIfExists(isbn: string): Observable<boolean> {
    return this.http.get(this.baseUrl + 'isbnExists' + isbn);
  }

  deleteBook(name: string) {
    localStorage.removeBook(name);
  }
}
