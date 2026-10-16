import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly menuOpen = signal(false);
  protected readonly openMenuGroup = signal<string | null>(null);

  protected toggleMenu(): void {
    this.menuOpen.update((isOpen) => {
      if (isOpen) {
        this.openMenuGroup.set(null);
      }
      return !isOpen;
    });
  }

  protected toggleMenuGroup(group: string): void {
    this.openMenuGroup.update((openGroup) => (openGroup === group ? null : group));
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.openMenuGroup.set(null);
  }
}
