let commodityChart = document.getElementById('commodity-chart');
let modeChart = document.getElementById('mode-chart');
let yearChart = document.getElementById('year-chart');

let chartsHidden = true;

let chartState = {
    traceOne: {
        data: null,
        idA: null,
        idB: null,
    },
    traceTwo: {
        data: null,
        idA: null,
        idB: null
    },
    chartType: null,    // init, edge, import, export, within
    metric: 'tons',     // tons, usd, usd_per_ton
    metricPrefix: '',   // '$', ''
    filter: null,
}

let defaultPrimaryMarker = {
    color: 'rgb(255, 118, 33)',
    line: {
        color: 'black',
        width: 1
    }
}

let defaultSecondaryMarker = {
    color: 'rgb(117, 117, 117)',
    line: {
        color: 'black',
        width: 1
    }
}

let defaultLayout = {
    xaxis: {
        categoryorder: 'total descending',
        tickprefix: ' '
    },
    yaxis: {
        type: 'log',
        title: chartState.metric,
        tickprefix: chartState.metricPrefix
    },
    dragmode: 'pan'
};

let defaultYearLayout = {
    title: {
        text: 'By Year'
    },
    yaxis: {
        type: 'log',
        title: chartState.metric,
        tickprefix: chartState.metricPrefix
    },
    dragmode: 'pan',
};

let defaultConfig = {
    scrollZoom: true
};

// Lower chart opacity while they update

function fadeOutCharts() {
    commodityChart.style.opacity = 0.4
    modeChart.style.opacity = 0.4
    yearChart.style.opacity = 0.4
    disableMapInteractions = true;
}

// Reset chart opacity once done updating

function fadeInCharts() {
    commodityChart.style.opacity = 1
    modeChart.style.opacity = 1
    yearChart.style.opacity = 1
    disableMapInteractions = false;
}

// Get legend labels for the chart when two traces are present (changes depending on what the chart is displaying)

function getChartLegendLabels() {

    if (chartState.chartType == 'edge') {

        let edgeOneFrom = nodeSet.find(node => node.data.id == chartState.traceOne.idA).data.label
        let edgeOneTo = nodeSet.find(node => node.data.id == chartState.traceOne.idB).data.label
        let edgeTwoFrom = nodeSet.find(node => node.data.id == chartState.traceTwo.idA).data.label
        let edgeTwoTo = nodeSet.find(node => node.data.id == chartState.traceTwo.idB).data.label

        return [
            edgeOneFrom + ' → ' + edgeOneTo,
            edgeTwoFrom + ' → ' + edgeTwoTo
        ]
    }

    let nodeOne = nodeSet.find(node => node.data.id == chartState.traceOne.idA)
    let nodeTwo = nodeSet.find(node => node.data.id == chartState.traceTwo.idA)

    if (chartState.chartType == 'within') return [
            'Within ' + nodeOne.data.label,
            'Within ' + nodeTwo.data.label
        ]
    else if (chartState.chartType == 'import') return [
            'Into ' + nodeOne.data.label,
            'Into ' + nodeTwo.data.label
        ]
    else if (chartState.chartType == 'export') return [
            'Out of ' + nodeOne.data.label,
            'Out of ' + nodeTwo.data.label
        ]

}

// Fetch the data needed for the chart from the appropriate record table

function getChartData(map, chart, type, from, to) {

    let queryData = {
        map: map,  
        chart: chart.includes('edge') ? 'edge' : chart,
        type: type,
        fzone: portOfEntryDrilled ? foreignOriginNode.data('id') : null,
        from: from,
        to: to
    };

    fadeOutCharts();

    fetch('/get_chart_data', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(queryData)
    })
    .then(response => response.json())
    .then(data => {

        data.map(record => {
            record.commodity = record.commodity.trim();
            record.mode = record.mode.trim();
        })

        if (chart == 'import') addDataToCharts(data, chart, to, from)
        else if (chart == 'within') addDataToCharts(data, chart, from, null)
        else addDataToCharts(data, chart, from, to)
        
    })
    .catch(error => console.error('Error: ', error))

}
 
function initCharts() {
    if (activeMap == 'df') initDFCharts();
    else if (activeMap == 'id') initIDCharts();
    else if (activeMap == 'ip') initIPCharts();
    else if (activeMap == 'ed') initEDCharts();
    else initEPCharts();
}

function initDFCharts(){

    fadeOutCharts();

    fetch('/df_chart_init', {
        headers: {
          'Accept': 'application/json'
        },
      }).then(response => {
        return response.json();
      }).then(data => {

        chartState.chartType = null;
       
        data.map(record => {
            record.commodity = record.commodity.trim();
            record.mode = record.mode.trim();
        })

        addDataToCharts(data, 'init', '0')

      }).catch(error => {
        console.error('Error: ', error);
      })

}

function initIDCharts(){

    fadeOutCharts();

    fetch('/fi_chart_init', {
        headers: {
          'Accept': 'application/json'
        },
      }).then(response => {
        return response.json();
      }).then(data => {

        chartState.chartType = null;

        data.map(record => {
            record.commodity = record.commodity.trim();
            record.mode = record.mode.trim();
        })

        addDataToCharts(data, 'init', '0');

      }).catch(error => {
        console.error('Error: ', error);
      })

}

function initIPCharts(){

    fadeOutCharts();

    if (portOfEntryDrilled) {

        let queryData = {
            map: activeMap,  
            chart: 'edge',
            type: portOfEntryEdge.data('id').substring(0, 2),
            from: foreignOriginNode.data('id'),
            to: portOfEntryNode.data('id'),
            fzone: foreignOriginNode.data('id')
        };

        fetch('/get_chart_data', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(queryData)
        })
        .then(response => response.json())
        .then(data => {
            
            data.map(record => {
                record.commodity = record.commodity.trim();
                record.mode = record.mode.trim();
            })
            addDataToCharts(data, 'edgedrill', foreignOriginNode.data('id'), portOfEntryNode.data('id'), true)
            
        })
        .catch(error => console.error('Error: ', error))

    } else {

        fetch('/fi_chart_init', {
            headers: {
              'Accept': 'application/json'
            },
          }).then(response => {
            return response.json();
          }).then(data => {
    
            chartState.chartType = null;
    
            data.map(record => {
                record.commodity = record.commodity.trim();
                record.mode = record.mode.trim();
            })
    
            addDataToCharts(data, 'init', '0');
    
          }).catch(error => {
            console.error('Error: ', error);
          })

    }

}

function initEDCharts(){

    fadeOutCharts();

    fetch('/fe_chart_init', {
        headers: {
          'Accept': 'application/json'
        },
      }).then(response => {
        return response.json();
      }).then(data => {

        chartState.chartType = null;

        data.map(record => {
            record.commodity = record.commodity.trim();
            record.mode = record.mode.trim();
        })

        addDataToCharts(data, 'init', '0');

      }).catch(error => {
        console.error('Error: ', error);
      })

}

function initEPCharts(){

    fadeOutCharts();

    if (portOfEntryDrilled) {

        let queryData = {
            map: activeMap,  
            chart: 'edge',
            type: portOfEntryEdge.data('id').substring(0, 2),
            from: foreignOriginNode.data('id'),
            to: portOfEntryNode.data('id'),
            fzone: foreignOriginNode.data('id')
        };

        fetch('/get_chart_data', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(queryData)
        })
        .then(response => response.json())
        .then(data => {
            
            data.map(record => {
                record.commodity = record.commodity.trim();
                record.mode = record.mode.trim();
            })
            addDataToCharts(data, 'edgedrill', foreignOriginNode.data('id'), portOfEntryNode.data('id'), true)
            
        })
        .catch(error => console.error('Error: ', error))

    } else {

        fetch('/fe_chart_init', {
            headers: {
              'Accept': 'application/json'
            },
          }).then(response => {
            return response.json();
          }).then(data => {
    
            chartState.chartType = null;
    
            data.map(record => {
                record.commodity = record.commodity.trim();
                record.mode = record.mode.trim();
            })
    
            addDataToCharts(data, 'init', '0');
    
          }).catch(error => {
            console.error('Error: ', error);
          })

    }

}

// Group together data by the specified category, which is necessary for each individual chart

function groupDataByCategory(data, category){

    if (chartState.metric != 'usd_per_ton') {
        let temp = data.reduce((p, c) => {
            let name = c[category]
            if (!p.hasOwnProperty(name)) {
              p[name] = 0;
            }
            p[name] = p[name] + c[chartState.metric];
            return p;
          }, {});
    
        return {
            'x': Object.keys(temp).map(key => key.trim()),
            'y': Object.values(temp),
            };
    } else {

        let tons_temp = data.reduce((p, c) => {

            let name = c[category]
            
            if (!p.hasOwnProperty(name)) {
              p[name] = 0;
            }
            
            p[name] = p[name] + c['tons'];
            
            return p;

            }, {});

        let usd_temp = data.reduce((p, c) => {

            let name = c[category]

            if (!p.hasOwnProperty(name)) {
              p[name] = 0;
            }

            p[name] = p[name] + c['usd'];

            return p;

            }, {});
          
        let temp = {};

        Object.keys(tons_temp).forEach(label => temp[label] = usd_temp[label]/tons_temp[label])

        return {
            'x': Object.keys(temp).map(key => key.trim()),
            'y': Object.values(temp),
            };
    }
    
}

// Create charts using the data passed in for both traces, except for when a chart is responsible for a filter

function createCharts(traceOneData, traceTwoData) {

    // Determine whether or not this chart is being used to filter the data - if not, used the passed data - if so, use the base data associaed with the chart
    let commodityDataOne = chartState.filter != null && chartState.filter.chart == 'commodity' 
        ? groupDataByCategory(chartState.traceOne.data, 'commodity') 
        : groupDataByCategory(traceOneData, 'commodity');
    commodityDataOne.type = 'bar';
    commodityDataOne.marker = defaultPrimaryMarker;
    // commodityDataOne.marker = {};
    // commodityDataOne.marker.color = commodityDataOne.y.map(value => colorScale(valueMap(value)));

    let commodityLayout = Object.create(defaultLayout);
    commodityLayout.title = chartState.filter != null && chartState.filter.chart != 'commodity'
        ? `By Commodity<br><span style='font-size: 8pt'>Filtered for ${chartState.filter.string}</span>`
        : 'By Commodity';
    commodityLayout.showlegend = false
    commodityLayout.yaxis = {
        title: chartState.metric == 'tons' ? 'Tons' : (chartState.metric == 'usd') ? 'USD' : 'USD per Ton',
        tickprefix: chartState.metric.includes('usd') ? '$' : '',
        type: 'log'
    }

    if (traceTwoData != null) {     //If a second trace can be drawn, add it to the chart with a legend

        let chartLegendLabels = getChartLegendLabels();

        commodityDataOne.name = chartLegendLabels[0];

        let commodityDataTwo = chartState.filter != null && chartState.filter.chart == 'commodity' 
            ? groupDataByCategory(chartState.traceTwo.data, 'commodity') 
            : groupDataByCategory(traceTwoData, 'commodity');
        commodityDataTwo.name = chartLegendLabels[1];
        commodityDataTwo.type = 'bar';
        commodityDataTwo.marker = defaultSecondaryMarker;

        commodityLayout.showlegend = true;
        commodityLayout.legend = {
            x: 1.2,
            xanchor: 'right',
            y: 1.1,
            bgcolor: 'rgba(255,255,255,0.6)',
        };

        Plotly.newPlot(commodityChart, [commodityDataOne, commodityDataTwo], commodityLayout, defaultConfig)

    } else Plotly.newPlot(commodityChart, [commodityDataOne], commodityLayout, defaultConfig);

    
    let modeDataOne = chartState.filter != null && chartState.filter.chart == 'mode' 
        ? groupDataByCategory(chartState.traceOne.data, 'mode') 
        : groupDataByCategory(traceOneData, 'mode');
    modeDataOne.name = '';
    modeDataOne.type = 'bar';
    modeDataOne.marker = defaultPrimaryMarker

    let modeLayout = Object.create(defaultLayout);
    modeLayout.title = chartState.filter != null && chartState.filter.chart != 'mode'
        ? `By Transportation Mode<br><span style='font-size: 8pt'>Filtered for ${chartState.filter.string}</span>`
        : 'By Transportation Mode';
    modeLayout.yaxis = {
        title: chartState.metric == 'tons' ? 'Tons' : (chartState.metric == 'usd') ? 'USD' : 'USD per Ton',
        tickprefix: chartState.metric.includes('usd') ? '$' : '',
        type: 'log'
    }

    if (traceTwoData != null) {

        let modeDataTwo = chartState.filter != null && chartState.filter.chart == 'mode' 
            ? groupDataByCategory(chartState.traceTwo.data, 'mode') 
            : groupDataByCategory(traceTwoData, 'mode');
        modeDataTwo.name = '';
        modeDataTwo.type = 'bar';
        modeDataTwo.marker = defaultSecondaryMarker

        modeLayout.showlegend = true;
        modeLayout.legend = {
            x: 1.2,
            xanchor: 'right',
            y: 1,
            bgcolor: 'rgba(255,255,255,0.8)'

        }

        Plotly.newPlot(modeChart, [modeDataOne, modeDataTwo], modeLayout, defaultConfig);

    } else Plotly.newPlot(modeChart, [modeDataOne], modeLayout, defaultConfig);
    
    let yearDataOne = chartState.filter != null && chartState.filter.chart == 'year' 
        ? groupDataByCategory(chartState.traceOne.data, 'year') 
        : groupDataByCategory(traceOneData, 'year');
    yearDataOne.name = '';
    yearDataOne.type = 'scatter';
    yearDataOne.marker = defaultPrimaryMarker;
    yearDataOne.marker.size = 15;

    let yearLayout = defaultYearLayout;
    yearLayout.title = chartState.filter != null && chartState.filter.chart != 'year'
    ? `By Year<br><span style='font-size: 8pt'>Filtered for ${chartState.filter.string}</span>`
    : 'By Year';
    yearLayout.xaxis = {
        tickmode: 'array',
        tickvals: [2018, 2019, 2020, 2021, 2022],
        ticktext: ['2018', '2019', '2020', '2021', '2022'],
    };
    yearLayout.yaxis.title = chartState.metric == 'tons' ? 'Tons' : (chartState.metric == 'usd') ? 'USD' : 'USD per Ton';
    yearLayout.yaxis.tickprefix = chartState.metric.includes('usd') ? '$' : '';

    if (traceTwoData != null) {

        let yearDataTwo = chartState.filter != null && chartState.filter.chart == 'year' 
            ? groupDataByCategory(chartState.traceTwo.data, 'year') 
            : groupDataByCategory(traceTwoData, 'year');
        yearDataTwo.name = '';
        yearDataTwo.type = 'scatter';
        yearDataTwo.marker = defaultSecondaryMarker;
        yearDataTwo.marker.size = 15;    

        yearLayout.showlegend = true;
        yearLayout.legend = {
            "orientation": "h",
            x: 0.5,
            xanchor: 'center'
        };

        Plotly.newPlot(yearChart, [yearDataOne, yearDataTwo], yearLayout, defaultConfig);

    } else Plotly.newPlot(yearChart, [yearDataOne], yearLayout, defaultConfig);

    filterChartToggle();    //Update chart highlighting to reflect any filters
    setChartTitle();

}

function filterChartToggleFromMap(selectedLabel, category) {

    let chartLabel;

    if (category == 'a') {
        chartState.filter = null;
        createCharts(chartState.traceOne.data, chartState.traceTwo.data)
        return;
    }
    else if (category == 'c') chartLabel = 'commodity';
    else if (category == 'm') chartLabel = 'mode';
    else chartLabel = 'year';

    chartState.filter = {
        value: selectedLabel,
        chart: chartLabel,
        string: selectedLabel
    }

    filterChartData();

}

// If a filter is active on the charts, update the trace for the corresponding chart to reflect which subcategory is filtered by  

function filterChartToggle() {

    if(chartState.filter == null) return;

    let chart;
    
    if (chartState.filter.chart == 'commodity') chart = commodityChart;
    else if (chartState.filter.chart == 'mode') chart = modeChart;
    else chart = yearChart;

    let currentData = chart.data;
    let traces = currentData.length;
    
    let traceOneLength = currentData[0].x.length; 
    let traceOneOpacity = [];

    let traceOneLabel = currentData[0].x.indexOf(chartState.filter.value.toString());

    for (let i = 0; i < traceOneLength; i++) traceOneOpacity.push(0.3);

    if(traceOneLabel >= 0) traceOneOpacity[traceOneLabel] = 1;

    var traceOneUpdate = {

        'marker': {
            'color': 'rgb(255, 118, 33)',
            'opacity': traceOneOpacity,
            'line': {
                'color': 'black',
                'width': 1
            },
            'size': 10
        }

    };

    Plotly.restyle(chart, traceOneUpdate, [0]);

    if (traces == 2) {
        
        let traceTwoLength = currentData[1].x.length;
        let traceTwoOpacity = [];

        let traceTwoLabel = currentData[1].x.indexOf(chartState.filter.value.toString());

        for (let i = 0; i < traceTwoLength; i++) traceTwoOpacity.push(0.3);

        if(traceTwoLabel >= 0) traceTwoOpacity[traceTwoLabel] = 1;

        var traceTwoUpdate = {

            'marker': {
                'color': 'rgb(117, 117, 117)',
                'opacity': traceTwoOpacity,
                'line': {
                    'color': 'black',
                    'width': 1
                },
                'size': 10
            }
            
        };

        Plotly.restyle(chart, traceTwoUpdate, [1]);

    }

}

// If a filter is applied, filter the chart data by that subcategory and update the charts

function filterChartData() {

    let traceOneDataFiltered = chartState.traceOne.data;

    if(chartState.filter != null) traceOneDataFiltered = traceOneDataFiltered.filter(
            record => record[chartState.filter.chart] == chartState.filter.value
        );

    let traceTwoDataFiltered = chartState.traceTwo.data;

    if (traceTwoDataFiltered != null) {

        if(chartState.filter != null) traceTwoDataFiltered = traceTwoDataFiltered.filter(
            record => record[chartState.filter.chart] == chartState.filter.value
            );

    }

    createCharts(traceOneDataFiltered, traceTwoDataFiltered)

}

function addDataToCharts(data, chartType, sourceID, targetID){

    if (chartState.chartType != chartType) {

        chartState.chartType = chartType

        chartState.traceOne.data = data;
        chartState.traceOne.idA = sourceID;
        chartState.traceOne.idB = targetID;

        chartState.traceTwo.data = null;
        chartState.traceTwo.idA = null;
        chartState.traceTwo.idB = null;
        

    } else if (chartState.traceTwo.data == null){

        chartState.traceTwo.data = data;
        chartState.traceTwo.idA = sourceID;
        chartState.traceTwo.idB = targetID;

    } else {

        chartState.traceOne.data = chartState.traceTwo.data
        chartState.traceOne.idA = chartState.traceTwo.idA
        chartState.traceOne.idB = chartState.traceTwo.idB

        chartState.traceTwo.data = data;
        chartState.traceTwo.idA = sourceID;
        chartState.traceTwo.idB = targetID;

    }

    if (chartState.filter != null) filterChartData();
    else createCharts(chartState.traceOne.data, chartState.traceTwo.data);

    fadeInCharts();
}

function removeDataFromCharts(sourceID, targetID) {

    if (chartState.traceOne.idA == sourceID && chartState.traceOne.idB == targetID) {

        chartState.traceOne.data = chartState.traceTwo.data
        chartState.traceOne.idA = chartState.traceTwo.idA
        chartState.traceOne.idB = chartState.traceTwo.idB

    } 

    chartState.traceTwo.data = null;
    chartState.traceTwo.idA = null;
    chartState.traceTwo.idB = null;

    if (chartState.filter != null) filterChartData();
    else createCharts(chartState.traceOne.data, chartState.traceTwo.data);

}

function updateChartMetric(metric){

    chartState.metric = metric;
    chartState.metricPrefix = chartState.metric.includes('usd') ? '$' : '';

    createCharts(chartState.traceOne.data, chartState.traceTwo.data);

}

function setChartTitle() {

    let chartTitle = document.getElementById('chart-region');

    let firstPhrase = chartState.traceTwo.data == null ? 'All ' : 'Comparison of all '
    let secondPhrase = activeMap == 'df' ? 'Freight Movements:' : (activeMap.includes('i')  ? 'Freight Imports:' : 'Freight Exports:' )

    let mainTitle = `<p style="margin-top: 7.5px;"><b><span style="font-size: 16pt;">` + firstPhrase + secondPhrase + `</span>`;

    if (chartState.chartType == 'init') {

        if (activeMap == 'df') chartTitle.innerHTML = `${mainTitle}</b></br> Across the <b>USA</b></p>`
        else if (activeMap == 'ip' || activeMap == 'id') chartTitle.innerHTML = `${mainTitle}</b></br> Into the <b>USA</b></p>`
        else chartTitle.innerHTML = `${mainTitle}</b></br> Out of the <b>USA</b></p>`

    } else if (chartState.chartType == 'edgedrill') {

        if (activeMap == 'ip') chartTitle.innerHTML 
            = `${mainTitle}</b></br> From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></p>`
        else chartTitle.innerHTML 
        = `${mainTitle}</b></br> From the <b>USA</b>, To <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
    
    } else if (chartState.chartType == 'edge') {

        if (activeMap == 'df' || activeMap == 'id' || activeMap == 'ed') {
            if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                = `${mainTitle}</b></br> From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></p>`
            else chartTitle.innerHTML
            = `${mainTitle}</b></br>
                From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></br>
                From <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b>, To <b>${cy.getElementById(chartState.traceTwo.idB).data('label')}</b></p>`
        } else {
            if (activeMap == 'ip') {
                if (portOfEntryDrilled) {
                    if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                        = `${mainTitle}</b></br> From <b>${foreignOriginNode.data('label')}</b>, To <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
                    else chartTitle.innerHTML
                        = `${mainTitle}</b></br>
                            From <b>${foreignOriginNode.data('label')}</b>, To <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></br>
                            From <b>${foreignOriginNode.data('label')}</b>, To <b>${cy.getElementById(chartState.traceTwo.idB).data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
            
                } else {
                    if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                        = `${mainTitle}</b></br> From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></p>`
                    else chartTitle.innerHTML
                    = `${mainTitle}</b></br>
                        From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></br>
                        From <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b>, To the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceTwo.idB).data('label')}</b></p>`
                }
            } else {
                if (portOfEntryDrilled){
                    if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                        = `${mainTitle}</b></br> From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To <b>${foreignOriginNode.data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></p>`
                    else chartTitle.innerHTML
                        = `${mainTitle}</b></br>
                            From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To <b>${foreignOriginNode.data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></br>
                            From <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b>, To <b>${foreignOriginNode.data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></p>`
                } else {
                    if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                        = `${mainTitle}</b></br> From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b></p>`
                    else chartTitle.innerHTML
                        = `${mainTitle}</b></br>
                            From the <b>USA</b>, To <b>${cy.getElementById(chartState.traceOne.idB).data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></br>
                            From the <b>USA</b>, To <b>${cy.getElementById(chartState.traceTwo.idB).data('label')}</b>, Via <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b></p>`
                }
            }
        }

    } else if (chartState.chartType == 'within') {

        if (activeMap == 'df') {
            if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                = `${mainTitle}</b></br> Within <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
            else chartTitle.innerHTML
            = `${mainTitle}</b></br>
                Within <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></br>
                Within <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b></p>`
        } else {

            if (activeMap == 'ip') chartTitle.innerHTML 
                = `${mainTitle}</b></br> From <b>${foreignOriginNode.data('label')}</b>, To <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
            else chartTitle.innerHTML 
                = `${mainTitle}</b></br> From <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b>, To <b>${foreignOriginNode.data('label')}</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
    
        }
    } else if (chartState.chartType == 'import') {
        if (activeMap == 'df'|| activeMap == 'id' || activeMap == 'ed' || (activeMap == 'ep' && !portOfEntryDrilled)) {
            if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                = `${mainTitle}</b></br> Into <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
            else chartTitle.innerHTML
            = `${mainTitle}</b></br>
                Into <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></br>
                Into <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b></p>`
        } else if (activeMap == 'ip') {
            if(chartState.traceTwo.data == null) chartTitle.innerHTML 
                = `${mainTitle}</b></br>
                    Into the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
            else chartTitle.innerHTML 
                = `${mainTitle}</b></br> 
                    Into the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></br>
                    Into the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b></p>`
        } else {
            chartTitle.innerHTML 
                = `${mainTitle}</b></br> From the <b>USA (Excluding ${portOfEntryNode.data('label')})</b>, To <b>${foreignOriginNode.data('label')}</b>, Via <b>${portOfEntryNode.data('label')}</b></p>`
        }
    } else if (chartState.chartType == 'export') {
        if (activeMap == 'df'|| activeMap == 'id' || activeMap == 'ed'|| (activeMap == 'ip' && !portOfEntryDrilled)) {
            if (chartState.traceTwo.data == null) chartTitle.innerHTML 
                = `${mainTitle}</b></br> Out of <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
            else chartTitle.innerHTML
            = `${mainTitle}</b></br>
                Out of <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></br>
                Out of <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b></p>`
        } else if (activeMap == 'ep') {
            if(chartState.traceTwo.data == null) chartTitle.innerHTML 
                = `${mainTitle}</b></br>
                    From the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></p>`
            else chartTitle.innerHTML 
                = `${mainTitle}</b></br> 
                    From the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceOne.idA).data('label')}</b></br>
                    From the <b>USA</b>, Via <b>${cy.getElementById(chartState.traceTwo.idA).data('label')}</b></p>`
        } else chartTitle.innerHTML 
                = `${mainTitle}</b></br> From <b>${foreignOriginNode.data('label')}</b>, Into the <b>USA (Excluding ${portOfEntryNode.data('label')})</b>, Via <b>${portOfEntryNode.data('label')}</b></p>`         
    }

}