function vendorsLineChart(papers, submitted_years) {
  var labels = {
    "Google": "72, 85, 113",
    "IBM": "194, 168, 98",
    "IonQ": "95, 133, 115",
    "Quantinuum": "144, 71, 98",
    "Rigetti": "101, 97, 114",
    "Honeywell": "3, 3, 3",
    "AlpineQuantumTechnologies": " 3, 0, 0",
  };

  var vendor_records = {};
  var label_keys = Object.keys(labels);
  var years_length = Object.keys(submitted_years);
  for(var i = 0, len = label_keys.length; i < len; i++) {
    var label = label_keys[i];
    vendor_records[label] = [];
    for(var  j = 0, jlen = years_length.length; j < jlen; j++) {
      vendor_records[label].push(0);
    }
  }

  for(var i = 0, len = papers.length; i < len; i++) {
    var paper = papers[i];
    if(paper.vendor_id && vendor_records[paper.vendor_id]) {
      vendor_records[paper.vendor_id][submitted_years[paper.submitted_year]] += 1;
    }
  }
  var datasets = [];
  for(var i = 0, len = label_keys.length; i < len; i++) {
    var label = label_keys[i];
    datasets.push({
      label: label,
      data: vendor_records[label],
      borderColor: "rgb(" + labels[label] + ")",
      backgroundCOlor: "rgba(" + labels[label] + ", 0.5)",
    })
  }

  return {
    type: 'line',
    data: {
      labels: Object.keys(submitted_years),
      datasets: datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'vendors title'
        }
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
            text: "number of submissions",
          }
        }
      }
    }
  }
};
