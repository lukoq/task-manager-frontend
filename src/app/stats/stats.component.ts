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


}