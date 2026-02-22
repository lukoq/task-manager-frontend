import { Component, computed, inject, signal } from '@angular/core';
import { StatsService } from './stats.service';
import { Stats } from './stats.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './stats.component.html',
  imports: [],
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {
  private statsService = inject(StatsService);

  stats = signal<Stats | null>(null);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        console.log(data)
      },
      error: (err) => console.error('err', err)
    });
  }

  /* Computed */
  chartData = computed(() => {
    const s = this.stats();
    if(!s || s.total === 0) {
      return { 
        todo: 0, 
        inProgress: 0, 
        done: 0 
      };
    }

    return {
      todo: (s.todo/s.total)*100,
      inProgress: (s.inProgress/s.total)*100,
      done: (s.done/s.total)*100
    };
  });
  pieStyle = computed(() => {
    const s = this.stats();
    if(!s || s.total === 0) {
      return 'transparent';
    }
  
    const doneP = (s.done / s.total) * 100;
    const overdueP = (s.overdue / s.total) * 100;

    return `conic-gradient(
      var(--color-bdg-done) 0% ${doneP}%,
      var(--color-text-error) ${doneP}% ${doneP + overdueP}%,
      var(--color-bdg-todo) ${doneP + overdueP}% 100%
    )`;
  });
  
  completionRate = computed(() => {
    const s = this.stats();
    return s && s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
  });
  
  statsRate = computed(() => {
    const s = this.stats();
    if (!s || s.total === 0) return [];
  
    const doneP = (s.done / s.total) * 100;
    const overdueP = (s.overdue / s.total) * 100;
    const restP = 100 - doneP - overdueP;
  
    return [
      { label: 'Done', value: Math.round(doneP), color: 'var(--color-done)', start: 0 },
      { label: 'Overdue', value: Math.round(overdueP), color: 'var(--color-overdue)', start: doneP },
      { label: 'Rest', value: Math.round(restP), color: 'var(--color-todo)', start: doneP + overdueP }
    ];
  });


}