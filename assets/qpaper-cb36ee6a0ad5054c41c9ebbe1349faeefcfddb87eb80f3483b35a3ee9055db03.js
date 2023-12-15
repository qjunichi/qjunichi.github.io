var papers;

function hrefto(link) {
  location.href = "https://arxiv.org/abs/" + link.innerHTML;
}

function all_on(id) {
  var boxes = document.querySelectorAll(id + " input");
  for(var i = 0, len = boxes.length; i < len; i++) {
    boxes[i].checked = "checked";
    boxes[i].setAttribute("checked", "checked");
  }
}

function all_off(id) {
  var boxes = document.querySelectorAll(id + " input");
  for(var i = 0, len = boxes.length; i < len; i++) {
    boxes[i].checked = false;
    boxes[i].setAttribute("checked", false);
  }
}
function toggle_f() {
  var boxes = document.querySelectorAll("input.thema_F");
  var themas_f = document.getElementById("themas_f");
  var flag = themas_f.checked == "checked" || themas_f.checked === true;
  for(var i = 0, len = boxes.length; i < len; i++) {
    if(flag) {
      boxes[i].checked = "checked";
    } else {
      boxes[i].checked = false;
    }
  }
}

function linkto(name, subname){
  document.querySelector("#sidebar_content").setAttribute("class", name);
  document.querySelector("#qpaper_content").setAttribute("class", name);
  if(subname) {
    document.querySelector("#qpaper_content > .charts").setAttribute("class", "charts " + subname);
  }
  displayContent(name);
  displaySubContent(subname);
}

function toggleBox(id) {
  var tag = document.getElementById(id);
  if(tag.checked === true || tag.checked == "checked") {
    tag.checked = false;
  } else {
    tag.checked = "checked";
  }
}

function initialize() {
  papers = vuePapers();
  initialize = function() {};
}

function displayContent(name) {
  if(name == "dashboards") {
    papers.displayGraphs();
  }
}

function displaySubContent(name) {
  if(name) {
    papers.displayChartGraph(name);
  }
}

window.addEventListener("load", function(){
  initialize();
});

function detailPage(event){
  var target = event.target.parentNode.querySelector(".paper_url");
  if(target) {
    location.href = target.innerHTML;
  }
}

function tsvToJson(tsv) {
  var result = [];
  var records = tsv.split("\n");
  var columns = records[0].split("\t");
  for(var i = 1, len = records.length; i < len; i++) {
    var record = records[i].split("\t");
    var paper = {};
    for(var j = 0, jlen = columns.length; j < jlen; j++) {
      var attr = columns[j];
      paper[columns[j]] = record[j];
    }
    if (parseInt(paper["submitted_year"]) > 2000 ) {
      result.push(paper);
    }
  }
  return result;
}

function updateGraph() {
  var content = document.querySelector("#qpaper_content .charts");
  var name = content.getAttribute("class");
  papers.displayChartGraph(name.split(" ")[1]);
}

function vuePapers() {
  return new Vue({
    el: '#papers',
    data: {
      message: 'Sort Column In Table',
      papers:[],
      vendors: [],
      themas: [],
      subjects: [],
      submitted_years: {},
      graphs: {},
      sort_key: "",
      sort_asc: true,
    },
    methods: {
      sortBy(key) {
        this.sort_key === key ? (this.sort_asc = !this.sort_asc) : (this.sort_asc = true);
        this.sort_key = key;
      },
      addClass(key) {
        return {
          asc: this.sort_key === key && this.sort_asc,
          desc: this.sort_key === key && !this.sort_asc
        }
      },
      graph_data(name) {
        try {
          document.querySelector(".script_message").innerHTML = "";
          var graph_hash = this.graphs[name];
          if(graph_hash) { return graph_hash }
          if (name == "vendor_nonvendor_line_chart") {
            this.graphs[name] = vendorNonvendorLineChart(this.papers, this.submitted_years);
          } else if (name == "submitted_papers") {
            return vendorNonvendorLineChart(this.filtered_papers(), this.submitted_years);
          } else if (name == "vendors_line_chart") {
            this.graphs[name] = vendorsLineChart(this.papers, this.submitted_years);
          } else if (name == "vendor_nonvendor_box_plot") {
            this.graphs[name] = vendorNonvendorBoxPlot(this.papers, this.submitted_years);
          } else if (name == "box_plot") {
            return vendorNonvendorBoxPlot(this.filtered_papers(), this.submitted_years);
          } else if (name == "vendors_box_plot") {
            this.graphs[name] = vendorsBoxPlot(this.papers, this.submitted_years);
          } else if (name == "vendor_nonvendor_bar_chart") {
            this.graphs[name] = vendorNonvendorBarChart(this.papers, this.submitted_years);
          } else if (name == "max_qubit") {
            return vendorNonvendorBarChart(this.filtered_papers(), this.submitted_years);
          }
          return this.graphs[name];
        } catch(e) {
          document.querySelector(".script_message").innerHTML = "該当レコードはありませんでした";
        }
      },
      filtered_papers() {
        var selected_papers = [];
        var vendors = this.selectedValues(document.querySelectorAll("#vendors input.vendors"));
        var themas = this.selectedValues(document.querySelectorAll("#themas input.themas"));
        var subjects = this.selectedValues(document.querySelectorAll("#subjects input.subjects"));
        if(this.vendors.length == vendors.length && this.themas.length == themas.length && this.subjects.length == subjects.length) { return this.papers }
        if(vendors.length == 0 || themas.length == 0 || subjects.length == 0) { return []; }

        var filters = {};
        if(this.vendors.length != vendors.length) { filters["vendors"] = vendors }
        if(this.themas.length != themas.length) { filters["themas"] = themas }
        if(this.subjects.length != subjects.length) { filters["subjects"] = subjects }
        for(var i = 0, len = this.papers.length; i < len; i++) {
          var paper = this.papers[i];
          var flag = true;
          if(flag && filters["vendors"]) {
            flag = this.selectedVendor(paper, vendors);
          }
          if(flag && filters["themas"]) {
            flag = this.selectedThema(paper, vendors);
          }
          if(flag && filters["subjects"]) {
            flag = this.selectedSubject(paper, vendors);
          }
          if(flag) { selected_papers.push(paper) }
        }
        return selected_papers;
      },
      selectedValues(tags) {
        var values = [];
        for(var i = 0, len = tags.length; i < len; i++) {
          if(tags[i].checked) {
            values.push(tags[i].value);
          }
        }
        return values;
      },
      selectedVendor(paper, vendors) {
        for(var i = 0, len = vendors.length; i < len; i++) {
          if(paper.vendor_id == vendors[i]) {
            return true;
          }
        }
        return false;
      },
      selectedThema(paper, themas) {
        var thema_ids = paper.thema_ids.split(",");
        for(var i = 0, len = themas.length; i < len; i++) {
          for(var j = 0, jlen = thema_ids.length; j < jlen; j++) {
            if(thema_ids[j] == themas[i]) {
              return true;
            }
          }
        }
        return false;
      },
      selectedSubject(paper, subjects) {
        var subject_ids = paper.subject_ids.split(",");
        for(var i = 0, len = subjects.length; i < len; i++) {
          for(var j = 0, jlen = subject_ids.length; j < jlen; j++) {
            if(subject_ids[j] == subjects[i]) {
              return true;
            }
          }
        }
        return false;
      },
      displayGraphs() {
        this.displayChart("vendor_nonvendor_line_chart");
        this.displayChart("vendors_line_chart");
        this.displayChart("vendor_nonvendor_box_plot");
        this.displayChart("vendors_box_plot");
        this.displayChart("vendor_nonvendor_bar_chart");
      },
      displayChartGraph(name) {
        var data = this.graph_data(name);
        if(data) {
          var graph = document.querySelector("#chart_canvas #chart_graph");
          graph.innerHTML = "";
          var canvas = document.createElement("canvas");
          graph.appendChild(canvas);
          new Chart(canvas.getContext("2d"), data);
        }
      },
      displayChart(graph_name) {
        var data = this.graph_data(graph_name);
        if(data) {
          var graph = document.getElementById(graph_name);
          graph.innerHTML = "";
          var canvas = document.createElement("canvas");
          graph.appendChild(canvas);
          new Chart(canvas.getContext("2d"), data);
        }
      },
      firstPapers(data) {
        this.importPapers(data);
        axios.get('./sup_input.tsv?' + Date.now()).then(response => this.initialPapers(response.data))
      },
      initialPapers(data) {
        this.importPapers(data);
        var submitted_year_list = {};
        for(var i = 0, len = this.papers.length; i < len; i++) {
          var year = this.papers[i].submitted_year;
          submitted_year_list[year] = true;
        }
        submitted_year_list = Object.keys(submitted_year_list).sort();
        for(var i = 0, len = submitted_year_list.length; i < len; i++){
          this.submitted_years[submitted_year_list[i]] = i;
        }
        this.displayGraphs();
      },
      importPapers(data) {
        this.papers = this.papers.concat(tsvToJson(data));
        this.vendors = this.selectedValues(document.querySelectorAll("#vendors input.vendors"));
        this.themas = this.selectedValues(document.querySelectorAll("#themas input.themas"));
        this.subjects = this.selectedValues(document.querySelectorAll("#subjects input.subjects"));
      },
    },
    computed: {
      sort_papers() {
        if (this.sort_key != "") {
          let set = 1;
          this.sort_asc ? (set = 1) : (set = -1);
          this.papers.sort((a, b) => {
            if (a[this.sort_key] < b[this.sort_key]) return -1 * set;
            if (a[this.sort_key] > b[this.sort_key]) return 1 * set;
            return 0;
          });
          return this.papers;
        } else {
          return this.papers;
        }
      },
    },
    mounted(){
      axios.get('./input.tsv?' + Date.now()).then(response => this.firstPapers(response.data))
    },
  })
};
