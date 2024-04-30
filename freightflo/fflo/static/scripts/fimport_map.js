const fimport_regionNodeWH = 30;
const fimport_stateNodeWH = 20;
const fimport_zoneNodeWH = 10;
const fimport_edgeW = 3;
const fimport_edgeO = 0.6;
const fimport_edgeOI = 0;

let fimport_edgeRange = [];
let fimport_cy;
var fimport_restoreQueue = [];
let fimport_highlighted;
let fimport_visibleEdges = {
  'rr': true,
  'rs': true,
  'rz': true,
  'ss': true,
  'sz': true,
  'zz': true,
}

let fimport_color;

function fimport_setColorScale(value){

  let maxValue = 0
  fimport_regionRegionEdges.forEach(edge => {
    if(edge.data[value] > maxValue) maxValue = edge.data[value];
  })

  let minValue = Number.MAX_VALUE;
  fimport_stateZoneEdges.forEach(edge => {
    if(edge.data[value] < minValue) minValue = edge.data[value];
  })

  fimport_edgeRange = [minValue, maxValue];

  fimport_color = d3.scaleSequential([Math.log(maxValue), 0], d3.interpolateWarm)

  let maxPower = Math.ceil(Math.log10(maxValue));

  labels = [0]

  for(let i = 1; i <= maxPower; i++){
    let format = d3.format("~s")
    let power = Math.pow(10, i)
    labels.push(format(power).replace('G', 'B'))
  }

  const sliderRange = d3
    .sliderBottom()
    .min(0)
    .max(Math.ceil(Math.log10(maxValue)))
    .width(1200)
    .ticks(Math.ceil(Math.log10(maxValue)) + 1)
    .tickFormat((d, i) => labels[i])
    .default([0, Math.ceil(Math.log10(maxValue))])
    .fill('#85bb65');

    sliderRange.on('onchange', val =>  {

      fimport_edgeRange[0] = Math.pow(10, val[0]);
      fimport_edgeRange[1] = Math.pow(10, val[1]);

      fimport_runEdgeFilter();

    });

  const slider = d3
    .select('#fimport_slider-range')
    .append('svg')
    .attr('width', 1260)
    .attr('height', 100)
    .attr('display', 'block')
    .attr('margin', 'auto')
    .append('g')
    .attr('transform', 'translate(30, 50)')


  slider.call(sliderRange)

}

let fimport_zoomLevel = 1;

let fimport_regionNodes = [], 
    fimport_stateNodes = [], 
    fimport_zoneNodes = [], 
    fimport_regionRegionEdges = [], 
    fimport_regionStateEdges = [], 
    fimport_stateStateEdges = [], 
    fimport_regionZoneEdges = [], 
    fimport_stateZoneEdges = [], 
    fimport_zoneZoneEdges = [];

function fimport_parseRegionNodes(data){
  data.forEach(elmnt => {
    let obj = {
      'data': {
        'id': elmnt.region_id,
        'type': 'r',
        'region_desc': elmnt.region_desc,
        'tons': elmnt.tons,
        'usd': elmnt.usd
      },
      'position': {
        'x': elmnt.x,
        'y': elmnt.y,
      }
    }
    fimport_regionNodes.push(obj)
  });
}

function fimport_parseStateNodes(data){
  data.forEach(elmnt => {
    let obj = {
      'data': {
        'id': elmnt.state_id,
        'type': 's',
        'state_desc': elmnt.state_desc,
        'region_id': elmnt.region_id,
        'region_desc': elmnt.region_desc,
        'tons': elmnt.tons,
        'usd': elmnt.usd
      },
      'position': {
        'x': elmnt.x,
        'y': elmnt.y,
      }
    }
    fimport_stateNodes.push(obj)
  });
}

function fimport_parseZoneNodes(data){
  data.forEach(elmnt => {
    let obj = {
      'data': {
        'id': elmnt.zone_id,
        'type': 'z',
        'zone_desc': elmnt.zone_desc,
        'state_id': elmnt.state_id,
        'state_desc': elmnt.state_desc,
        'region_id': elmnt.region_id,
        'region_desc': elmnt.region_desc,
        'tons': elmnt.tons,
        'usd': elmnt.usd
      },
      'position': {
        'x': elmnt.x,
        'y': elmnt.y,
      }
    }
    fimport_zoneNodes.push(obj)
  });
}

function fimport_parseEdges(container, data){
  data.forEach(elmnt => {
    let obj = {'data': elmnt};
    container.push(obj);
  })
}

async function fimport_renderMap(){

    const background = new Image();
    background.src = "../static/imgs/Blank_US_map_2.PNG";

    await fetch('/interdf_map', {
      headers: {
        'Accept': 'application/json'
      },
    }).then(response => {
      return response.json();
    }).then(data => {
      fimport_parseRegionNodes(data.region_nodes)
      fimport_parseStateNodes(data.state_nodes)
      fimport_parseZoneNodes(data.zone_nodes)
      fimport_parseEdges(fimport_regionRegionEdges, data.region_region_edges)
      fimport_parseEdges(fimport_regionStateEdges, data.region_state_edges)
      fimport_parseEdges(fimport_stateStateEdges, data.state_state_edges)
      fimport_parseEdges(fimport_regionZoneEdges, data.region_zone_edges)
      fimport_parseEdges(fimport_stateZoneEdges, data.state_zone_edges)
      fimport_parseEdges(fimport_zoneZoneEdges, data.zone_zone_edges)
    }).catch(error => {
      console.error('Error: ', error);
    })

    fimport_setColorScale('tons');

    fimport_cy = cytoscape({

      container: document.getElementById('fimportmapcontainer'),  

      elements: fimport_regionNodes,

      layout: {

        name: 'preset'

      },

      style: [
        {
          selector: 'node',
          style: {
            'border-width': 1,
            'background-color': function(ele){ return fimport_color(Math.log(parseInt(ele.data('tons')) + 1))}
          }
        },
        {
          selector: 'node[type = "r"]',
          style: {
            'height': fimport_regionNodeWH/fimport_zoomLevel,
            'width': fimport_regionNodeWH/fimport_zoomLevel,
          }
        },
        {
          selector: 'node[type = "s"]',
          style: {
            'height': fimport_stateNodeWH/fimport_zoomLevel,
            'width': fimport_stateNodeWH/fimport_zoomLevel,
          }
        },
        {
          selector: 'node[type = "z"]',
          style: {
            'height': fimport_zoneNodeWH/fimport_zoomLevel,
            'width': fimport_zoneNodeWH/fimport_zoomLevel,
          }
        },
        {
          selector: 'edge',
          style: {
            'opacity': fimport_edgeO,
            'width': fimport_edgeW/fimport_zoomLevel,
            'line-color': function(ele){ 
              return fimport_color(Math.log(parseInt(ele.data('tons')) + 1))
            }
          }
        }
      ],

      autoungrabify: true,
      minZoom: 1,
      maxZoom: 128,
      wheelSensitivity: 0.5

    });

    fimport_cy.add(fimport_regionRegionEdges);

    fimport_cy.reset();

    const bottomLayer = fimport_cy.cyCanvas({
      zIndex: -1
    });

    const canvas = bottomLayer.getCanvas();
    const ctx = canvas.getContext("2d");

    fimport_cy.on("render cyCanvas.resize", evt => {
      bottomLayer.resetTransform(ctx);
      bottomLayer.clear(ctx);
      bottomLayer.setTransform(ctx);

      ctx.save();
      // Draw a background
      ctx.drawImage(background, 10, 15, 1080, 670);

      ctx.save();
    });

    fimport_cy.on('tap', 'edge', function(evt){ 

      let edge = evt.target;
      let source = fimport_cy.getElementById(edge.data('source')); 
      let target = fimport_cy.getElementById(edge.data('target'));
      let edgeType = source.data('type') + target.data('type');

      let queryData;

      switch(edgeType){
        case 'rr':
          queryData = {
            type: 'rr',
            source: edge.data('source'),
            target: edge.data('target'),
          }
          break;
        case 'rs':
          queryData = queryData = {
            type: 'rs',
            source: edge.data('source'),
            target: edge.data('target'),
          };
          break;
        case 'sr':
          queryData = queryData = {
            type: 'rs',
            target: edge.data('source'),
            source: edge.data('target'),
          };
          break;
        case 'ss':
          queryData = queryData = {
            type: 'ss',
            source: edge.data('source'),
            target: edge.data('target'),
          };
          break;
        case 'rz':
          queryData = queryData = {
            type: 'rz',
            source: edge.data('source'),
            target: edge.data('target'),
          };
        case 'zr':
          queryData = queryData = {
            type: 'rz',
            target: edge.data('target'),
            source: edge.data('source'),
          };
          break;
        case 'sz':
          queryData = queryData = {
            type: 'sz',
            source: edge.data('source'),
            target: edge.data('target'),
          };
          break;
        case 'zs':
          queryData = queryData = {
            type: 'sz',
            target: edge.data('source'),
            source: edge.data('target'),
          };
          break;
        case 'zz':
          queryData = queryData = {
            type: 'zz',
            target: edge.data('source'),
            source: edge.data('target'),
          };
          break;
      }


      fetch('/interdf_records', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(queryData),

      }).then(response => {
        return response.json();
      }).then(data => {

        chartData = data;

        let st = data.filter(ele => fimport_splitDataByOrigin(ele, source.data('id')))
        let ts = data.filter(ele => fimport_splitDataByOrigin(ele, target.data('id')))

        var chartAData = fimport_groupDataByCategory(st, 'commodity', 'tons')
        fimport_createChart(document.getElementById('fimport_chartA'), chartAData)

        var chartBData = fimport_groupDataByCategory(ts, 'commodity', 'tons')
        fimport_createChart(document.getElementById('fimport_chartB'), chartBData)

        var chartCData = fimport_groupDataByCategory(st, 'mode', 'tons')
        fimport_createChart(document.getElementById('fimport_chartC'), chartCData)

        var chartDData = fimport_groupDataByCategory(ts, 'mode', 'tons')
        fimport_createChart(document.getElementById('fimport_chartD'), chartDData)

        var chartEData = fimport_groupDataByCategory(st, 'year', 'tons')
        fimport_createChart(document.getElementById('fimport_chartE'), chartEData)

        var chartFData = fimport_groupDataByCategory(ts, 'year', 'tons')
        fimport_createChart(document.getElementById('fimport_chartF'), chartFData)

        fimport_openChart('commodity')

      }).catch(error => {
        console.error('Error: ', error);
      })

    }); 

    fimport_cy.on('cxttap', 'edge', evt => {

      let edge = evt.target;
      let source = fimport_cy.getElementById(edge.data('source')); 
      let target = fimport_cy.getElementById(edge.data('target'));

    });

    function fimport_nodeDrillDown(node) {

      if(node == fimport_highlighted) fimport_highlighted = null;

      let nodeId = node.data('id');

      switch(node.data('type')){

        case 'r':

          // Check for any expanded nodes (and remove if so)

          var stateZoneNodes = fimport_cy.filter((element, i) => {
            return (element.data('type') === 's' || element.data('type') === 'z')
          });

          if(stateZoneNodes.contains(fimport_highlighted)) fimport_highlighted = null;

          if(stateZoneNodes.nonempty()){
            stateZoneNodes.remove();
            restoreRegion = fimport_restoreQueue.shift();
            restoreRegion.elements.restore();
            fimport_restoreQueue = [];
          }

          // Delete edges associated with this node and this node itself
          var removedEdges = fimport_cy.filter((element, i) => {
            return (element.isEdge() && (element.data('source') == nodeId || element.data('target') == nodeId)) || (element.data('id') == nodeId);
          }).remove();

          var removeContext = {
            level: 'r',
            elements: removedEdges
          }

          fimport_restoreQueue.push(removeContext);

          // Create state nodes within this region

          var stateNodesFiltered = fimport_stateNodes.filter(obj =>{
            return obj.data.region_id == node.data('id');
          });

          var stateIdsFiltered = stateNodesFiltered.map(obj => obj.data.id);

          fimport_cy.add(stateNodesFiltered);

          // Create edges between states created and other regions + states themselves 

          fimport_cy.add(fimport_regionStateEdges.filter(obj => {
            return stateIdsFiltered.includes(obj.data.source) ||  stateIdsFiltered.includes(obj.data.target);
          }))

          fimport_cy.add(fimport_stateStateEdges.filter(obj => {
            return stateIdsFiltered.includes(obj.data.source) &&  stateIdsFiltered.includes(obj.data.target);
          }))

          break;


        case 's':

          // Check for zone level nodes (and remove if so)

          var zoneNodesActive = fimport_cy.filter((element, i) => {
            return (element.data('type') === 'z')
          });

          if(zoneNodesActive.contains(fimport_highlighted)) fimport_highlighted = null;

          if(zoneNodesActive.nonempty()){
            zoneNodesActive.remove();
            restoreState = fimport_restoreQueue.pop();
            restoreState.elements.restore();
          }

          // Delete this node

          var removedEdges = fimport_cy.filter((element, i) => {
            return (element.isEdge() && (element.data('source') == nodeId || element.data('target') == nodeId)) || (element.data('id') == nodeId);
          }).remove();

          var removeContext = {
            level: 's',
            elements: removedEdges
          }

          fimport_restoreQueue.push(removeContext);

          // Create zone nodes within this state

          var zoneNodesFiltered = fimport_zoneNodes.filter(obj =>{
            return obj.data.state_id == nodeId;
          });

          const zoneIdsFiltered = zoneNodesFiltered.map(obj => obj.data.id); 

          fimport_cy.add(zoneNodesFiltered);

          // Create edges between states created and other regions + states themselves 

          fimport_cy.add(fimport_regionZoneEdges.filter(obj => {
            return zoneIdsFiltered.includes(obj.data.source) ||  zoneIdsFiltered.includes(obj.data.target);
          }));

          fimport_cy.add(fimport_stateZoneEdges.filter(obj => {
            return zoneIdsFiltered.includes(obj.data.source) ||  zoneIdsFiltered.includes(obj.data.target);
          }));

          fimport_cy.add(fimport_zoneZoneEdges.filter(obj => {
            return zoneIdsFiltered.includes(obj.data.source) &&  zoneIdsFiltered.includes(obj.data.target);
          }));

          break;
      }

      fimport_updateNodeColor();
      fimport_runEdgeFilter();
      fimport_cy.emit('zoom');

    }

    function fimport_nodeDrillUp(node) {

      switch(node.data('type')){

        case 's':

          let collapseableA = fimport_cy.filter((element, i) => {
            return (element.data('type') === 's' || element.data('type') === 'z')
          });

          if(collapseableA.includes(fimport_highlighted)) fimport_highlighted = null;

          collapseableA.remove();

          restoreRegion = fimport_restoreQueue.shift();
          restoreRegion.elements.restore();
          fimport_restoreQueue = [];

          break;

        case 'z':

          let collapseableB = fimport_cy.filter((element, i) => {
            return (element.data('type') === 'z')
          });

          if(collapseableB.includes(fimport_highlighted)) fimport_highlighted = null;

          collapseableB.remove();

          restoreRegion = fimport_restoreQueue.pop();
          restoreRegion.elements.restore();

          break;

      }

      fimport_updateNodeColor();
      fimport_runEdgeFilter();
      fimport_cy.emit('zoom');


    }

    function fimport_nodeHighlight(node) {

      if(fimport_highlighted == node) fimport_highlighted = null;
      else fimport_highlighted = node;

      fimport_runEdgeFilter()

      return;

    }

    fimport_cy.on('tap', 'node', evt => { 

      if(evt.originalEvent.ctrlKey === true) fimport_nodeHighlight(evt.target);
      else fimport_nodeDrillDown(evt.target);

    }); 

    fimport_cy.on('cxttap', 'node', evt => {

        fimport_nodeDrillUp(evt.target)

    });

    fimport_cy.on('mouseover', 'edge', evt => {

    });

    // fimport_cy.on('mouseout', 'node', evt => {
    //   var node = evt.target;
    //   node.style({
    //     'label': '',
    //     'text-background-opacity': 1,
    //     'text-background-color': 'red',
    //     'text-background-shape': 'round-rectangle',

    //   })
    // })

    fimport_cy.on('zoom', evt => {
      fimport_zoomLevel = fimport_cy.zoom();

      fimport_cy.nodes().forEach(node => {

          switch(node.data('type')){
            case 'r':
              node.style({
                'width': fimport_regionNodeWH/fimport_cy.zoom(),
                'height': fimport_regionNodeWH/fimport_cy.zoom(),
                'border-width': 1/fimport_cy.zoom()
              })
              break;
            case 's':
              node.style({
                'width': fimport_stateNodeWH/fimport_cy.zoom(),
                'height': fimport_stateNodeWH/fimport_cy.zoom(),
                'border-width': 1/fimport_cy.zoom()
              })
              break;
            case 'z':
              node.style({
                'width': fimport_zoneNodeWH/fimport_cy.zoom(),
                'height': fimport_zoneNodeWH/fimport_cy.zoom(),
                'border-width': 1/fimport_cy.zoom()
              })
              break;
          }

      });
      fimport_cy.edges().forEach(edge => {
        edge.style({
          'width': fimport_edgeW/fimport_cy.zoom()
        })
      })
    })

  }

  function fimport_edgeTypeSelection(id){

    if(!document.getElementById(id).checked){
      fimport_visibleEdges[id] = false;
    } else {
      fimport_visibleEdges[id] = true
    }

    fimport_runEdgeFilter();

  }

  function fimport_getEdgeType(edge){
    let source = fimport_cy.getElementById(edge.data('source')); 
    let target = fimport_cy.getElementById(edge.data('target'));
    return source.data('type') < target.data('type') ? source.data('type') + target.data('type') : target.data('type') + source.data('type');
  }

  function fimport_runEdgeFilter(){

    if(fimport_highlighted == null){
      fimport_cy.edges().forEach(edge => {
        if(!fimport_visibleEdges[fimport_getEdgeType(edge)]) edge.style('display', 'none')
        else edge.style('display', 'element')
      })
    } else {
      fimport_cy.edges().forEach(edge => {
        if(fimport_highlighted.connectedEdges().includes(edge) && fimport_visibleEdges[fimport_getEdgeType(edge)]) edge.style('display', 'element')
        else edge.style('display', 'none')
      })
    }

    let value = document.getElementById('fimport_edgeweightselect').value;
    if(value.includes('diff')){
      fimport_cy.edges().style({
        'curve-style': 'bezier',
        'target-arrow-color': 'black',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'target-arrow-width': 'match-line'
      })
    } else {
      fimport_cy.edges().style({
        'target-arrow-shape': 'none',
      })
    }

    fimport_cy.edges().filter(ele => (parseInt(ele.data(value)) < fimport_edgeRange[0] || parseInt(ele.data(value)) > fimport_edgeRange[1])).style('display', 'none')

  }

  function fimport_updateEdgeWeights() {
    d3.select('#fimport_slider-range').select('svg').remove();
    let value = document.getElementById('fimport_edgeweightselect').value;
    fimport_setColorScale(value)
    fimport_cy.edges().style({
        'line-color': function(ele) {
            return fimport_color(Math.log(parseInt(ele.data(value)) + 1))
        }
    })
    if (value.includes('diff')) {
        fimport_cy.edges().style({
            'curve-style': 'bezier',
            'target-arrow-color': 'black',
            'target-arrow-shape': 'triangle',
            'target-arrow-fill': 'filled',
            'target-arrow-width': 'match-line'
        })
    } else {
        fimport_cy.edges().style({
            'target-arrow-shape': 'none',
        })
    }

    fimport_updateNodeColor();

}

  function fimport_updateNodeColor(){

    fimport_cy.nodes().forEach(node => {
      if(fimport_highlighted == null) node.style({'background-color': fimport_color(Math.log(parseInt(node.data('tons')) + 1))})
      else{
        if(fimport_highlighted === node) node.style({'background-color': 'rgb(255, 214, 71)'})
        else node.style({'background-color': fimport_color(Math.log(parseInt(node.data('tons')) + 1))})
      }
    });

  }

  function fimport_splitDataByOrigin(element, id){
    if(element.id == id) return true;
    else return false;
  }

  function fimport_groupDataByCategory(data, category, metric){

    let grouped = data.reduce((acc, ele) => {
      if(!acc[ele[category]]){
        acc[ele[category]] = {
          'category': ele[category],
          'metric': parseInt(ele[metric])
        }
      } else {
        acc[ele[category]].metric += parseInt(ele[metric])
      }
      return acc;
    }, {})

    let returnData = Object.keys(grouped).map(key => grouped[key])

    returnData = returnData.sort((a, b) => {
      if (a.metric < b.metric) {
        return 1;
      }
      if (a.metric > b.metric) {
        return -1;
      }
      return 0;
    });

    return returnData;

  }

  function fimport_createChart(parent, data){

    // Check for any existing charts and remove them

    if(parent.childNodes.length > 0){
      parent.innerHTML = '';
    }

    // Setup base SVG for D3
    let width = parent.offsetWidth;
    let height = parent.offsetHeight;

    let svg = d3.select(parent).append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', 'white')

    // Set up scale
    let yScale = d3.scaleBand()
    .domain(data.map(ele => ele.category))
    .range([0, height])
    .padding(0.1)

    let xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.metric)])
    .range([0, width])

    // Draw bars
    svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', d => yScale(d.category))
    .attr('height', yScale.bandwidth())
    .attr('x', 0)
    .attr('width', d => xScale(d.metric))
    .attr('fill', '#85bb65')

    // Draw labels
    svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.metric) + 5)
    .attr('y', d => yScale(d.category) + 15)
    .attr('dy', '0.35em')
    .attr('fill', 'black')
    .text(d => d.metric)
    .style('font-size', '12px')

    // Draw category labels
    svg.selectAll('.category')
    .data(data)
    .enter()
    .append('text')
    .attr('x', 10)
    .attr('y', d => yScale(d.category) + 15)
    .attr('dy', '0.35em')
    .attr('fill', 'black')
    .text(d => d.category)
    .style('font-size', '12px')

  }

  function fimport_openChart(category){

    document.getElementById('fimport_chartA').style.display = 'none';
    document.getElementById('fimport_chartB').style.display = 'none';
    document.getElementById('fimport_chartC').style.display = 'none';
    document.getElementById('fimport_chartD').style.display = 'none';
    document.getElementById('fimport_chartE').style.display = 'none';
    document.getElementById('fimport_chartF').style.display = 'none';

    document.getElementById('fimport_chart' + category.toUpperCase()).style.display = 'block';

  }

  function fimport_showCheckboxes() {
    var checkboxes = document.getElementById("fimport_checkboxes");
    if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
    } else {
      checkboxes.style.display = "none";
      expanded = false;
    }
  }