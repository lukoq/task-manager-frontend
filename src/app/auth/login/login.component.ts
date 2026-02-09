import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [RouterLink, ReactiveFormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private router = inject(Router);
  private loginService = inject(LoginService);

  loginForm = new FormGroup({
    email: new FormControl('', { 
      nonNullable: true,
      validators: [Validators.required, Validators.email] 
    }),
    password: new FormControl('', { 
      nonNullable: true,
      validators: [Validators.required] 
    })
  });

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      
      this.loginService.login(credentials).subscribe({
        next: () => {
          console.log('Logged!');
          this.router.navigate(['/tasks']);
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }
    
}