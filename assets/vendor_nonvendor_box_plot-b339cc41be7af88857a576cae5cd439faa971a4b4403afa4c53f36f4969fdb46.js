function vendorNonvendorBoxPlot(papers, submitted_years) {
  var submitted_year_label = Object.keys(submitted_years);
  var datasets = [[], []];
  for(var i = 0, len = submitted_year_label.length; i < len; i++) {
    datasets[0][i] = [];
    datasets[1][i] = [];
  }
  for(var i = 0, len = papers.length; i < len; i++) {
    var paper = papers[i];
    index = paper.vendor_flag == "TRUE" ? 1 : 0;
    datasets[index][submitted_years[paper.submitted_year]].push(paper.max_qubit_count || 0)
  }

  return {
    type: "boxplot",
    data: {
      labels: Object.keys(submitted_years),
      title: {
        display: true,
        text: 'vendor nonvendor qubit title'
      },
      datasets: [
        {
          label: "non-vendor",
          backgroundColor: "rgb(70, 97, 130",
          borderColor: "black",
          borderWidth: 1,
          outlierColor: "#fff",
          padding: 10,
          itemRadius: 0,
          data: datasets[0],
        },
        {
          label: "vendor",
          backgroundColor: "rgb(200,114,94)",
          borderColor: "black",
          borderWidth: 1,
          outlierColor: "#fff",
          padding: 10,
          itemRadius: 0,
          data: datasets[1],
        }
      ]
    },
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'title'
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "submitted year",
          }
        },
        y: {
          title: {
            display: true,
            text: "number of qubits employed (without outliners)",
          },
          max: 35,
          min: 0,
        }
      }
    }
  }
};
