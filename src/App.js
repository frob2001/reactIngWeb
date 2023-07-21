import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import DataTable from 'react-data-table-component';

Chart.register(...registerables);

function App() {
  const [data, setData] = useState(null);
  const [classificationCounts, setClassificationCounts] = useState(null);
  const chartRef = useRef(null); // Referencia para el gráfico

  useEffect(() => {
    fetch('https://apipaez.onrender.com')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setClassificationCounts(countClassifications(data));
      });
  }, []);

  // Función para contar las clasificaciones
  const countClassifications = data => {
    const counts = {
      A: 0,
      B: 0,
      C: 0,
    };

    Object.values(data).forEach(cls => {
      if (counts.hasOwnProperty(cls)) {
        counts[cls]++;
      }
    });

    return counts;
  };

  useEffect(() => {
    if (classificationCounts) {
      drawBarChart();
    }
  }, [classificationCounts]);

  // Función para dibujar el gráfico de barras
  const drawBarChart = () => {
    if (chartRef.current) {
      // Destruir el gráfico existente si hay uno
      chartRef.current.destroy();
    }

    const canvas = document.getElementById('barChart');
    const ctx = canvas.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Cantidad de clasificaciones',
            data: [classificationCounts.A, classificationCounts.B, classificationCounts.C],
            backgroundColor: ['#FF5733', '#33FF36', '#33A1FF'],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      },
    });
  };

  const columns = [
    {
      name: 'Productos',
      selector: row => row.key,
    },
    {
      name: 'Clasificación',
      selector: row => row.value,
    },
  ];

  const tableData = data && Object.entries(data).map(([key, value]) => ({ key, value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Tabla de datos</h1>
      {tableData && (
        <DataTable
          columns={columns}
          data={tableData}
          pagination
          paginationPerPage={10}
        />
      )}
      <h1>Gráfico implementado</h1>
      <canvas id="barChart" width="400" height="200"></canvas>
    </div>
  );
}

export default App;
