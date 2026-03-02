import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './profile.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isChangeModalOpen = signal(false);

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required] 
    }),
    newPassword: new FormControl('', { 
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)] 
    }),
    repeatNewPassword: new FormControl('', { 
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)] 
    }),
  });


  openChangeModal() {
    this.isChangeModalOpen.set(true);
  }

  closeChangeModal() {
    this.isChangeModalOpen.set(false);
    this.changePasswordForm.reset(); 
  }

  onSubmit() {
    if(this.changePasswordForm.valid) {
      const formData = this.changePasswordForm.getRawValue();
      this.closeChangeModal(); 
    } 
    else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

}