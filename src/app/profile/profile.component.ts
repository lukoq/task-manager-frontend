import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { finalize } from 'rxjs';

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
  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);

  profile = signal<Profile | null>(null);
  profilePictureUrl = signal<string>('default-avatar.png');


  private profileService = inject(ProfileService);

  isLoading = false;

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
    if (this.changePasswordForm.valid) {
      this.isLoading = true; 

      const {oldPassword, newPassword} = this.changePasswordForm.getRawValue();

      this.profileService.changePassword(oldPassword, newPassword).pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => {
            this.changePasswordForm.reset();
            setTimeout(() => this.closeChangeModal(), 500);
          },
          error: (err) => console.error(err)
        });
    } 
    else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  
  ngOnInit(): void {
    this.loadProfileInfo();
    this.loadProfilePicture()
  }


  loadProfilePicture() {
    this.profileService.getProfilePicture().subscribe({
      next: (data) => {
        this.profilePictureUrl.set(URL.createObjectURL(data));
      },
      error: () => {
        this.profilePictureUrl.set('default-avatar.png');
      }
    });
  }

  loadProfileInfo() {
    this.profileService.getProfileInfo().subscribe({
      next: (data) => {
        this.profile.set(data);
      },
      error: (err) => console.error('err', err)
    });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if(!file){
      return;
    } 

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if(!allowedTypes.includes(file.type)) {
      this.errorMessage.set(' Only JPEG, PNG and WEBP images are allowed');
      return;
    }

    if(file.size > 5 * 1024 * 1024) {
      this.errorMessage.set(' File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    this.errorMessage.set(null);
    this.isUploading.set(true);

    this.profileService.uploadProfilePicture(file).subscribe({
      next: () => this.isUploading.set(false),
      error: (err) => {
        this.isUploading.set(false);
        this.errorMessage.set(err.error?.message ?? ' Upload failed');
      }
    });
  }

}