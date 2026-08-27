import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  usuarioNome: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const u = this.authService.getUsuario();
    if (u) this.usuarioNome = u.nome;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
