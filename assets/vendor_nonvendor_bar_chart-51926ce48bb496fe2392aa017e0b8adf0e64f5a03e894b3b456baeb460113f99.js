function vendorNonvendorBarChart(papers, submitted_years) {
  var submitted_year_label = Object.keys(submitted_years);
  var datasets = [[],[]];
  for(var i = 0, len = submitted_year_label.length; i < len; i++) {
    datasets[0][i] = 0;
    datasets[1][i] = 0;
  }

  for(var i = 0, len = papers.length; i < len; i++) {
    var paper = papers[i];
    var count = parseInt(paper.max_qubit_count);
    if(count > 0){
      index = paper.vendor_flag == "TRUE" ? 1 : 0;
      if(datasets[index][submitted_years[paper.submitted_year]] < count){
        datasets[index][submitted_years[paper.submitted_year]] = count;
      }
    }
  }

  return {
    type: 'bar',
    data: {
      labels: submitted_year_label,
      datasets: [
        {
          label: 'non-vendor',
          data: datasets[0],
          borderColor: "rgb(70,97,130)",
          backgroundColor: "rgb(70,97,130)",
          borderWidth: 1
        },
        {
          label: 'vendor',
          data: datasets[1],
          borderColor: "rgb(200,114,94)",
          backgroundColor: "rgb(200,114,94)",
          borderWidth: 1
        },
      ]
    },
    options: {
      title: { display: true, },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "submitted year",
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "max number of qubits employed",
          },
        }
      }
    },
  }
};
