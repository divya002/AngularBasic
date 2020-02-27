import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {
  public showValue: boolean;
  constructor(private fb: FormBuilder) { 
    this.showValue = false;
  }
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    PhysicallyActive: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl('')
    })
  });

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

  onSubmit() {
    console.warn(this.profileForm2.value);
    this.showValue=true;
  }
  CheckboxChange(){
    console.log('called');
    if (this.profileForm2.get('PhysicallyActive').value) {
      console.log('checked');
    }
  }
  get aliases() {
    return this.profileForm2.get('aliases') as FormArray;
  }
  addAlias() {
    this.aliases.push(this.fb.group({
      name: [''],
      key: ['']
    }));
  }
  updateProfile() {
    this.profileForm.patchValue({
      firstName: 'Nancy',
      address: {
        street: '123 Drew Street'
      }
    });
  }
  ngOnInit(): void {
    this.profileForm2.get('PhysicallyActive').valueChanges.subscribe((data)=>{
      if (data) {
        console.log(`check ${data}`);
      } else {
        console.log(`uncheck ${data}`);
      }
    });
  }
}
