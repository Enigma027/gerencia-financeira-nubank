import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, effect, inject, input, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-mat-table-dinamica',
    standalone: true,
    imports: [MatTableModule, MatSortModule, CurrencyPipe, MatButtonModule],
    templateUrl: './mat-table-dinamica.component.html',
    styleUrl: './mat-table-dinamica.component.scss',
})
export class MatTableDinamicaComponent implements AfterViewInit {
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor() {
        effect(() => {
            this.dataSource = new MatTableDataSource<any>(this.inputDatasource());

            if (this.sort) {
                this.dataSource.sort = this.sort;
            }
        });
    }

    ngAfterViewInit() {
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
    }

    inputDatasource = input.required<any>();
    inputDisplayColumns = input.required<string[]>();
    inputTotal = input<number>();

    private sort?: MatSort;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    setDataSourceAttributes() {
        if (this.sort) {
            this.dataSource.sort = this.sort;
        }
    }

    dataSource = new MatTableDataSource();

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: any) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    exportCsv() {
        const headers = Object.keys(this.dataSource.data[0] as Array<any>).join(',') + '\n';
        const csvRows = (this.dataSource.data as Array<any>).map(row => Object.values(row).join(','));
        const csvData = headers + csvRows.join('\n');

        // Cria um blob com o conteúdo do CSV e um link para download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'extrato_nubank.csv');
        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }
}
