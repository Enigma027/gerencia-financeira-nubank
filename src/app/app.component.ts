import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatToolbarModule, MatSlideToggle, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private router = inject(Router);

    ngOnInit() {
        this.alterTheme();
        this.router.navigateByUrl('geren-csv');
    }

    isDarkMode = true;

    toggleDarkMode(event: any) {
        this.isDarkMode = event.checked;

        this.alterTheme();
    }

    alterTheme() {
        // Limpa classes anteriores
        document.body.classList.toggle('dark-theme', this.isDarkMode);
        document.body.classList.toggle('light-theme', !this.isDarkMode);
        document.body.classList.toggle('dark-theme-background', this.isDarkMode);
        document.body.classList.toggle('light-theme-background', !this.isDarkMode);
    }
}
