import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {map, tap, debounceTime} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { statesWithFlags } from '../../assets/state';
@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit, AfterViewInit {
  public showValue: boolean;
  @ViewChild('content', { static: true }) private modal;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.showValue = false;
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
    this.aliases.push(this.fb.group({
      name: [''],
      key: ['']
    }));
  }
  public updateProfile() {
    this.profileForm2.patchValue({
      firstName: 'Nancy',
      address: {
        street: '123 Drew Street',
        state: {
          name: 'Wyoming',
          flag: 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'
        }
      },
      PhysicallyActive: true
    });
  }
  public open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${(reason)}`);
    });
  }

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : statesWithFlags.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  public formatter = (x: {name: string}) => x.name;
  public ngAfterViewInit() {
    setTimeout(() => {
      this.open(this.modal);
    }, 0);
  }
  public ngOnInit(): void {
    this.profileForm2.get('PhysicallyActive').valueChanges.subscribe((data) => {
      if (data) {
        console.log(`check ${data}`);
      } else {
        console.log(`uncheck ${data}`);
      }
    });
  }
}
