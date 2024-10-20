import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ExtratoNubank } from './interfaces/extrato-nubank';
import { MatTableDinamicaComponent } from '../../shared/components/mat-table-dinamica/mat-table-dinamica.component';

@Component({
    selector: 'app-gerenciamento-csv',
    standalone: true,
    imports: [MatButtonModule, MatTableDinamicaComponent],
    templateUrl: './gerenciamento-csv.component.html',
    styleUrl: './gerenciamento-csv.component.scss',
})
export class GerenciamentoCsvComponent {
    @ViewChild('fileInput', { static: true }) fileInput?: ElementRef;

    extrato = signal<ExtratoNubank[]>([]);
    displayedColumns = signal(['Descricao', 'Valor', 'Data', 'Tipo', 'Classificacao']);
    total = signal(0);

    handleFileInput() {
        const file: File = this.fileInput?.nativeElement.files[0];

        if (!file.name.includes('.csv') || !file.type.includes('csv') || file.size < 1) {
            return;
        }

        if (file) {
            const reader = new FileReader();

            reader.onload = e => {
                const csvData = e.target?.result as string;
                const objectArray = this.parseCsvDataToObjects(csvData);

                if (objectArray) {
                    objectArray.forEach((movimentacao: ExtratoNubank) => {
                        if (movimentacao.Descricao) {
                            const descricao = movimentacao.Descricao.split('-');

                            if (movimentacao.Descricao.includes('-')) {
                                movimentacao.Descricao = descricao[0] + ' - ' + descricao[1];
                            }

                            movimentacao.Descricao = movimentacao.Descricao.toUpperCase();
                        }

                        let cor = '';
                        let tipo = '';

                        if (+movimentacao.Valor < 0) {
                            cor = '#b10000';
                            tipo = 'Saída';
                        } else {
                            cor = 'green';
                            tipo = 'Entrada';
                        }

                        movimentacao.ROWCOLOR = cor;
                        movimentacao.Tipo = tipo;
                    });

                    this.total.set(objectArray.map(t => t.Valor).reduce((acc, value) => acc + value, 0));
                }

                this.extrato.set(objectArray);
            };

            reader.readAsText(file);
        }
    }

    parseCsvDataToObjects(csvData: string): ExtratoNubank[] {
        const lines = csvData.split('\n'); // Divide o arquivo em linhas
        const result: ExtratoNubank[] = [];

        if (lines.length > 0) {
            const headers = lines[0].replace('Descrição', 'Descricao').split(','); // Obtém os títulos das colunas da primeira linha
            // Itera sobre cada linha de dados (exceto a primeira)
            for (let i = 1; i < lines.length; i++) {
                const currentLine = lines[i].split(',');
                const obj: any = {};

                headers.forEach((header, index) => {
                    obj[header.trim()] = currentLine[index] ? currentLine[index].trim() : null;
                });

                result.push(obj);
            }
        }

        return result;
    }

    exportCsv() {
        const headers = Object.keys(this.extrato()[0]).join(',') + '\n';
        const csvRows = this.extrato().map(row => Object.values(row).join(','));
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
