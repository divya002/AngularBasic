import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Renderer2,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  tap,
  take,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError
} from 'rxjs/operators';
import { Observable, of, iif, interval, Subscription} from 'rxjs';

import { statesWithFlags } from '../../../assets/state';
import { WikipediaService } from '../../services/wikipedia.service';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit, AfterViewInit {
  public showValue: boolean;
  public searching: boolean;
  public searchFailed: boolean;
  private numbers = interval(1000);
  private numberSubscription1: Subscription;
  private numberSubscription2: Subscription;
  private allSubscription = new Subscription();
  @ViewChild('content', { static: true }) private modal: ElementRef;
  @ViewChild('firstNam', { static: false }) private naam: ElementRef;
  @ViewChild('citizen', { static: false }) private citizen: ElementRef;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private wikipediaService: WikipediaService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.showValue = false;
    this.searching = false;
    this.searchFailed = false;
  }

  profileForm2 = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    lastName: [''],
    PhysicallyActive: new FormControl(''),
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['']
    }),
    aliases: this.fb.array([
      this.fb.group({
        name: [''],
        key: ['']
      })
    ])
  });

  public onSubmit() {
    console.warn(this.profileForm2.value);
    this.showValue = true;
  }

  public CheckboxChange() {
    console.log('called');
    if (this.profileForm2.get('PhysicallyActive').value) {
      console.log('checked');
    }
  }

  public get aliases() {
    return this.profileForm2.get('aliases') as FormArray;
  }

  public addAlias() {
    this.aliases.push(
      this.fb.group({
        name: [''],
        key: ['']
      })
    );
  }
  public updateProfile() {
    this.profileForm2.patchValue({
      firstName: 'Divy Prakash',
      address: {
        street: '123 Drew Street',
        state: {
          name: 'Wyoming',
          flag: 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'
        }
      },
      PhysicallyActive: true
    });
    this.allSubscription.remove(this.numberSubscription1);
    this.numberSubscription1.unsubscribe();
  }
  public open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        result => {
          console.log(`Closed with: ${result}`);
        },
        reason => {
          console.log(`Dismissed ${reason}`);
        }
      );
  }

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : statesWithFlags
              .filter(
                v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    )

  public formatter = (x: { name: string }) => x.name;

  public wikipediaSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        iif(
          () => term.length <= 3,
          of([]),
          this.wikipediaService.searchWikipedia(term).pipe(
            tap(() => {
              this.searchFailed = false;
              console.log(term);
            }),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
        )
      ),
      tap(() => (this.searching = false))
    )

  public ngAfterViewInit() {
    setTimeout(() => {
      this.open(this.modal);
      console.log(this.naam);
    }, 0);
  }
  public changeMethod(nam: HTMLInputElement) {
    console.log(this.naam);
    console.log(nam.value);
    console.log('citizen...');
    console.log(this.citizen);
    const element = this.renderer.selectRootElement('.heading');
    const text = this.renderer.createText('Namaste!!!');
    this.renderer.appendChild(element, text);
    // this.renderer.appendChild(this.citizen.nativeElement, text);
  }
  public ngOnInit(): void {
    this.numberSubscription1 = this.numbers.subscribe((x) => {
      console.log(`subscription1 ${x}`);
    });
    this.allSubscription.add(this.numberSubscription1);

    this.numberSubscription2 = this.numbers.subscribe((x) => {
      console.log(`subscription2 ${x}`);
    });
    this.allSubscription.add(this.numberSubscription2);
    this.profileForm2.get('PhysicallyActive').valueChanges.subscribe(data => {
      if (data) {
        console.log(`check ${data}`);
      } else {
        console.log(`uncheck ${data}`);
      }
    });
  }
}
