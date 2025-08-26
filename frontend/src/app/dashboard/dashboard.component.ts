import { Component } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  leads: any[] = [];
  total = 0;
  page = 1;
  limit = 10;
  totalPages = 1;
  loading = false;

  totalleads = 0;
  avgscore = 0;
  validemails = 0;
  validphones = 0;

  constructor(private leadService: LeadService) {}

  ngOnInit(): void {
    this.fetchLeads();
  }

  fetchLeads(): void {
    this.loading = true;
    this.leadService.getLeads(this.page, this.limit).subscribe({
      next: (res) => {
        console.log(res);
        this.leads = res.data;
        this.total = res.total;
        this.totalleads = res.totalLeads;
        this.avgscore = res.avgScore;
        this.validemails = res.validEmails;
        this.validphones = res.validPhone;

        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchLeads();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchLeads();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.leadService.uploadCSV(file).subscribe({
        next: (res) => {
          alert('Upload successful!');
          console.log(res);
        },
        error: (err) => {
          console.error(err);
          alert('Upload failed!');
        }
      });
    } else {
      alert('please only choose csv file!');
    }
  }

  exportCSV() {
    this.leadService.downloadCSV().subscribe((res: Blob) => {
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }
}
