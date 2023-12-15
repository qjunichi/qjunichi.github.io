function vendorNonvendorLineChart(papers, submitted_years_object) {
  var submitted_years = Object.keys(submitted_years_object);
  var result = {};
  for(var i = 0, len = submitted_years.length; i < len; i++) {
    result[submitted_years[i]] = { total: 0, vendor: 0, nonvendor: 0 };
  }
  for(var i = 0, len = papers.length; i < len; i++) {
    var paper = papers[i];
    var submitted_year = paper.submitted_year
    result[submitted_year][(paper.vendor_flag == "TRUE" ? "vendor" : "nonvendor")] += 1;
    result[submitted_year]["total"] += 1;
  }
  var total = [];
  var vendor = [];
  var nonvendor = [];
  for(var i = 0, len = submitted_years.length; i < len; i++) {
    var record = result[submitted_years[i]];
    total.push(record["total"]);
    vendor.push(record["vendor"]);
    nonvendor.push(record["nonvendor"]);
  }

  return {
    type: 'line',
    data: {
      labels: submitted_years,
      datasets: [
        {
          label: 'total',
          data: total,
          borderColor: "#4c5364",
          backgroundColor: "rgb(78, 89, 112)",
        },
        {
          label: 'vendor',
          data: vendor,
          borderColor: "#627f7a",
          backgroundColor: "rgb(100, 128, 124)",
        },
        {
          label: 'non-vendor',
          data: nonvendor,
          borderColor: "#c38c7f",
          backgroundColor: "rgb(188, 128, 128)",
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'vendor nonvendor chart title'
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
    },
  }
};
