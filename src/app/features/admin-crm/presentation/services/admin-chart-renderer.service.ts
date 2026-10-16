import { Injectable } from '@angular/core';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  DoughnutController,
  Legend,
  LinearScale,
  Plugin,
  Tooltip,
} from 'chart.js';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip,
);

export interface AdminChartData {
  labels: string[];
  values: number[];
  colors: string[];
}

export interface AdminChartHandle {
  update(data: AdminChartData): void;
  destroy(): void;
}

const createValueLabelPlugin = (orientation: 'vertical' | 'horizontal'): Plugin<'bar'> => ({
  id: `admin-bar-values-${orientation}`,
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const values = chart.data.datasets[0].data;
    const elements = chart.getDatasetMeta(0).data;

    ctx.save();
    ctx.fillStyle = '#35463a';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    elements.forEach((element, index) => {
      const center = element.getCenterPoint();
      const { x, y } = element.getProps(['x', 'y'], true);
      ctx.textAlign = orientation === 'vertical' ? 'center' : 'left';
      ctx.fillText(
        String(values[index]),
        orientation === 'vertical' ? center.x : x + 8,
        orientation === 'vertical' ? y - 10 : center.y,
      );
    });
    ctx.restore();
  },
});

const doughnutCenterTotalPlugin: Plugin<'doughnut'> = {
  id: 'admin-doughnut-center-total',
  afterDraw(chart) {
    const total = chart.data.datasets[0].data.reduce((sum, value) => sum + Number(value), 0);
    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
    const { ctx } = chart;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#283c30';
    ctx.font = '600 27px Georgia, serif';
    ctx.fillText(String(total), centerX, centerY - 7);
    ctx.fillStyle = '#817c72';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('solicitudes', centerX, centerY + 15);
    ctx.restore();
  },
};

@Injectable()
export class AdminChartRenderer {
  createBarChart(
    canvas: HTMLCanvasElement,
    data: AdminChartData,
    onSelect: (index: number) => void,
    valueLabel: (value: number) => string,
    orientation: 'vertical' | 'horizontal' = 'horizontal',
  ): AdminChartHandle {
    const configuration: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: data.colors,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: orientation === 'vertical' ? 34 : 24,
            categoryPercentage: 0.72,
            barPercentage: 0.82,
          },
        ],
      },
      options: {
        indexAxis: orientation === 'vertical' ? 'x' : 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 550, easing: 'easeOutQuart' },
        onClick: (_event, elements) => {
          if (elements.length) onSelect(elements[0].index);
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: { label: (context) => valueLabel(context.parsed.x ?? 0) },
          },
        },
        scales:
          orientation === 'vertical'
            ? {
                x: {
                  border: { display: false },
                  grid: { display: false },
                  ticks: {
                    color: '#625f57',
                    font: { size: 9 },
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  beginAtZero: true,
                  border: { display: false },
                  grid: { color: '#f0eee7' },
                  ticks: { precision: 0, color: '#817c72', font: { size: 9 } },
                },
              }
            : {
                x: {
                  beginAtZero: true,
                  border: { display: false },
                  grid: { color: '#f0eee7' },
                  ticks: { precision: 0, color: '#817c72', font: { size: 9 } },
                },
                y: {
                  border: { display: false },
                  grid: { display: false },
                  ticks: { color: '#625f57', font: { size: 10 } },
                },
              },
      },
      plugins: [createValueLabelPlugin(orientation)],
    };
    const chart = new Chart(canvas, configuration);

    return {
      update: (nextData) => {
        chart.data.labels = nextData.labels;
        chart.data.datasets[0].data = nextData.values;
        chart.data.datasets[0].backgroundColor = nextData.colors;
        chart.update('none');
      },
      destroy: () => chart.destroy(),
    };
  }

  createDoughnutChart(
    canvas: HTMLCanvasElement,
    data: AdminChartData,
    onSelect: (index: number) => void,
  ): AdminChartHandle {
    const configuration: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: data.colors,
            borderColor: '#fffefa',
            borderWidth: 4,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        animation: { duration: 650, easing: 'easeOutQuart' },
        onClick: (_event, elements) => {
          if (elements.length) onSelect(elements[0].index);
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 7,
              boxHeight: 7,
              padding: 15,
              color: '#625f57',
              font: { size: 10 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed}`,
            },
          },
        },
      },
      plugins: [doughnutCenterTotalPlugin],
    };
    const chart = new Chart(canvas, configuration);

    return {
      update: (nextData) => {
        chart.data.labels = nextData.labels;
        chart.data.datasets[0].data = nextData.values;
        chart.data.datasets[0].backgroundColor = nextData.colors;
        chart.update('none');
      },
      destroy: () => chart.destroy(),
    };
  }
}
