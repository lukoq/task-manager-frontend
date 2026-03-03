import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  
  const formGroup = control.parent;
  if(!formGroup) {
    return null;
  } 

  const newPassword = formGroup.get('newPassword')?.value;
  const repeatPassword = control.value;

  return newPassword === repeatPassword ? null : { passwordsMismatch: true };
};
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

  profile = signal<Profile | null>(null);

  private profileService = inject(ProfileService);

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
      validators: [Validators.required, Validators.minLength(5), passwordMatchValidator] 
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

  ngOnInit(): void {
    this.loadProfileInfo();
  }

  loadProfileInfo() {
    this.profileService.getProfileInfo().subscribe({
      next: (data) => {
        this.profile.set(data);
      },
      error: (err) => console.error('err', err)
    });
  }

}