/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DoctorService } from './Doctor.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-doctor',
  templateUrl: './Doctor.component.html',
  styleUrls: ['./Doctor.component.css'],
  providers: [DoctorService]
})
export class DoctorComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  DoctorId = new FormControl('', Validators.required);
  Name = new FormControl('', Validators.required);
  Age = new FormControl('', Validators.required);
  Address = new FormControl('', Validators.required);
  phoneNumber = new FormControl('', Validators.required);
  employedBy = new FormControl('', Validators.required);


  constructor(public serviceDoctor: DoctorService, fb: FormBuilder) {
    this.myForm = fb.group({
      DoctorId: this.DoctorId,
      Name: this.Name,
      Age: this.Age,
      Address: this.Address,
      phoneNumber: this.phoneNumber,
      employedBy: this.employedBy
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDoctor.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org1.healthcare.biznet.Doctor',
      'DoctorId': this.DoctorId.value,
      'Name': this.Name.value,
      'Age': this.Age.value,
      'Address': this.Address.value,
      'phoneNumber': this.phoneNumber.value,
      'employedBy': this.employedBy.value
    };

    this.myForm.setValue({
      'DoctorId': null,
      'Name': null,
      'Age': null,
      'Address': null,
      'phoneNumber': null,
      'employedBy': null
    });

    return this.serviceDoctor.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'DoctorId': null,
        'Name': null,
        'Age': null,
        'Address': null,
        'phoneNumber': null,
        'employedBy': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org1.healthcare.biznet.Doctor',
      'Name': this.Name.value,
      'Age': this.Age.value,
      'Address': this.Address.value,
      'phoneNumber': this.phoneNumber.value,
      'employedBy': this.employedBy.value
    };

    return this.serviceDoctor.updateParticipant(form.get('DoctorId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceDoctor.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceDoctor.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'DoctorId': null,
        'Name': null,
        'Age': null,
        'Address': null,
        'phoneNumber': null,
        'employedBy': null
      };

      if (result.DoctorId) {
        formObject.DoctorId = result.DoctorId;
      } else {
        formObject.DoctorId = null;
      }

      if (result.Name) {
        formObject.Name = result.Name;
      } else {
        formObject.Name = null;
      }

      if (result.Age) {
        formObject.Age = result.Age;
      } else {
        formObject.Age = null;
      }

      if (result.Address) {
        formObject.Address = result.Address;
      } else {
        formObject.Address = null;
      }

      if (result.phoneNumber) {
        formObject.phoneNumber = result.phoneNumber;
      } else {
        formObject.phoneNumber = null;
      }

      if (result.employedBy) {
        formObject.employedBy = result.employedBy;
      } else {
        formObject.employedBy = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'DoctorId': null,
      'Name': null,
      'Age': null,
      'Address': null,
      'phoneNumber': null,
      'employedBy': null
    });
  }
}
