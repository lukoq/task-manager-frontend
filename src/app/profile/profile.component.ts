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

  showOldPassword = signal(false);
  showNewPassword = signal(false);
  showRepeatPassword = signal(false);

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


  toggleVisibility(field: 'old' | 'new' | 'repeat') {
    if(field === 'old') {
      this.showOldPassword.update(v => !v);
    }
    if(field === 'new') {
      this.showNewPassword.update(v => !v);
    }
    if(field === 'repeat') {
      this.showRepeatPassword.update(v => !v);
    }
  }


  openChangeModal() {
    this.isChangeModalOpen.set(true);
  }

  closeChangeModal() {
    this.isChangeModalOpen.set(false);
    this.changePasswordForm.reset(); 

    this.showOldPassword.set(false);
    this.showNewPassword.set(false);
    this.showRepeatPassword.set(false);
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