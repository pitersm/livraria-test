import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseUrl = 'http://localhost:50750/api/Book';
  constructor(private http: HttpClient) { }
  books: Book[];

  getBook(name: string) {
    return JSON.parse(localStorage.getBook(name)) as Book;
  }

  saveBook(book: Book) {
    localStorage.setBook(book.name, JSON.stringify(book));
  }

  listBooks(): Observable<Book[]> {
    this.books = [];
    return this.http.get(this.baseUrl)
      .pipe(map((response: any[]) => {
        const books: Book[] = response;
        return books;
      }));
  }

  checkIfExists(name: string) {
    // return this.listBooks().map((i) => i.name).includes(name);
  }

  deleteBook(name: string) {
    localStorage.removeBook(name);
  }

  showLocalStorage() {
    let amount = 0;
    let size = 0;
    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i);
      const value = localStorage.getBook(key);
      console.log(amount, key, value);
      size += key.length + value.length;
      amount++;
    }
    console.log('Total entries:', amount);
    console.log('Total size:', size);
  }
}
