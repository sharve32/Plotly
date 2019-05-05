function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var urlmeta = "/metadata/" + sample;
  d3.json(urlmeta).then(function(sample){
    var sample_metadata = d3.select("#sample-metadata");
    
    //clearing existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      panel.appen("h6").text(`${key}:${value}`);
    });
  });
  console.log("Exiting Building MetaData");    
};

// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);

// var selectioninput = `/wfreq/<sample>`;
// d3.json(selectionipnut).then(function(level) {

  
// })


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var urlsample = `/samples/${sample}`;
  d3.json(urlsample).then(function(sdata) {

    // @TODO: Build a Bubble Chart using the sample data
    var xValues = sdata.otu_ids;
    var yValues = sdata.sample_values;
    var tValues = sdata.otu_labels;

    var trace1 = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: yValues,
        color: xValues
      }
    };

    var data = [trace1];
    var layout = {
      margin: {t:0},
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_data = [{
      values: values.slice(0,10),
      labels: ids.slice(0,10),
      hovertext: labels.slice(0,10),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    var pie_layout = {
      margin: {t:0, l:0}
    };

    Plotly.plot('pie', pie_data, pie_layout);
  });  
  console.log('Exiting Build Charts');
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
