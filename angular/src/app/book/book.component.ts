import { bookTypeOptions } from './../proxy/books/book-type.enum';
import { ListService, PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService, BookDto } from '@proxy/books';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [ListService,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }] // add this line
})
export class BookComponent implements OnInit {
  public book: PagedResultDto<BookDto> = { items: [], totalCount: 0 } as PagedResultDto<BookDto>;
  public isModalOpen: boolean = false;
  public formGroup: FormGroup;
  public bookTypes = bookTypeOptions;

  constructor(
    public readonly list: ListService,
    private _bookService: BookService,
    private _formBuilder: FormBuilder) { }

  public ngOnInit() {
    const bookStreamCreator = (query: PagedAndSortedResultRequestDto) => {
      return this._bookService.getList(query);
    };

    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    });
  }

  public createBook(): void {
    this.buildForm();
    this.isModalOpen = true;
  }

  public buildForm(): void {
    this.formGroup = this._formBuilder.group({
      name: ['', Validators.required],
      type: [null, Validators.required],
      publishDate: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  // add save method
  public save() {
    if (this.formGroup.invalid) {
      return;
    }

    this._bookService.createNew(this.formGroup.value).subscribe(() => {
      this.isModalOpen = false;
      this.formGroup.reset();
      this.list.get();
    });
  }
}
