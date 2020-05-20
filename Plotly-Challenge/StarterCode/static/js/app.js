//create function for graphs to pull into main function -> 
//start by importing json file then filtering data
//have to use id's in the json file

function graphs(id) {
    d3.json("data/samples.json").then(data => {

        //show data in console log
        console.log(data);

        var graphData = data.samples.filter(data => parseInt(data.id)===id)[0];

        //show filtered data and idData in console log
        console.log(id);
        console.log(graphData);

//Need to define variables from json file to make charts

        //barchart variables -> need top ten values instead of all values
        var ten_sample = graphData.sample_values.slice(0,10);
        var ten_otu = graphData.otu_ids.slice(0,10);
        var otu_label = graphData.otu_labels.slice(0,10);

        //bubble variables  -> can use all values
        var bub_samp = graphData.sample_values;
        var otu_bub = graphData.otu_ids;
        var otu_lab_bub = graphData.otu_labels;

        //create trace for bar graph
        var barTrace = {
            x: ten_sample,
            y: ten_otu,
            text: otu_label,
            name: "bar belly",
            type: "bar",
            hoverinfo: otu_label,
            textposition: 'auto',
            orientation: "h",
            width: 200,
            marker: {
                color: 'rgb(158,202,225)',
                opacity: .5,
                line: {
                    color: "black",
                    width: 1.5
                }
            }    
        };

        //put bar trace into array
        var barGraph = [barTrace];

        //create plot bar graph
        Plotly.newPlot("bar", barGraph);

        //create trace for bubble graph
        var bubbleTrace = {
            x: otu_bub,
            y: bub_samp,
            text: otu_lab_bub,
            mode: 'markers',
            size:otu_bub,
            markers: {
                size: otu_bub
            },
            name: "bubble belly",
            type: "bubble"
        };

        //put bubble trace into array
        var bubbleGraph = [bubbleTrace];

        //create plot bubble graph
        Plotly.newPlot("bubble", bubbleGraph);
    });
}

function init() {

    // Display the default plot
    graphs(940);

    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    d3.json("data/samples.json").then(data => {
        data.names.forEach(function(name){
            dropdownMenu.append("option").text(name).property("value");
        });
    });
}

//optionChanged from html -> when dropdown is selected the values will change

function optionChanged(id) {
    graphs(parseInt(id));
}

init()



    





