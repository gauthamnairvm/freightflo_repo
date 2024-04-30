const FIForeignNodeWH = 40;
const FIRegionNodeWH = 30;
const FIStateNodeWH = 20;
const FIZoneNodeWH = 10;
const FINodeBW = 2;
const FIEdgeW = 4;
const FIEdgeO = 0.6;
const FIEdgeOI = 0;
const FIEdgeAS = 1.5; 
const FIZoom = 1;

let foreignOriginNode = null;
let portOfEntryNode = null; 
let portOfEntryEdge = null;
let portOfEntryDrilled = false;


async function edgeDrillFI (edge) {

    if (disableMapInteractions && !chartsHidden) {
        alert("Map ineractions have been disabled until charts finish rendering.\n\nIf chart updates are undesired, perform the previous action while holding ALT to prevent these updates from occurring.")
        return;
    }

    if (portOfEntryDrilled) {

        if (edge.data('id') == portOfEntryEdge.data('id')) {
            clearPortSelection()
            if (!chartsHidden) await initCharts();
        }
        else return;
  
    } else initPortSelection(edge)

    await getMapData();
    
    createEdges();
    updateNodeWeights();
    updateNodeOpacity();
    updateEdgeOpacity();

}

async function initPortSelection(edge) {

    highlighted.mode = null;
    resetSearch();

    portOfEntryDrilled = true;

    if (activeMap == 'ip') {
        foreignOriginNode = cy.getElementById(edge.data('source'))
        portOfEntryNode = cy.getElementById(edge.data('target'));
    } else {
        foreignOriginNode = cy.getElementById(edge.data('target'))
        portOfEntryNode = cy.getElementById(edge.data('source'));
    }
    
    portOfEntryEdge = edge

    if (!chartsHidden) {
        if (activeMap == 'ip') await getChartData(activeMap, 'edgedrill', portOfEntryEdge.data('id').substring(0, 2), parseInt(foreignOriginNode.data('id')), parseInt(portOfEntryNode.data('id')));
        else await getChartData(activeMap, 'edgedrill', portOfEntryEdge.data('id').substring(0, 2), parseInt(portOfEntryNode.data('id')), parseInt(foreignOriginNode.data('id')));
    }
}

// Function to populate dropdown menu with node names
function populateFIDropdownMenu() {

  //clear options
  document.getElementById('from').innerHTML = '';
  document.getElementById('to').innerHTML = '';

  //add default option
  let oed1 = document.createElement('option');
  oed1.value = "All Regions"
  oed1.textContent = "All Regions"
  document.getElementById('from').appendChild(oed1);
  let oed2 = document.createElement('option');
  oed2.value = "USA"
  oed2.textContent = "USA"
  document.getElementById('to').appendChild(oed2);
  let oed3 = document.createElement('option');
  oed3.value = "All Regions"
  oed3.textContent = "All Regions"
  document.getElementById('to').appendChild(oed3);

  // for each node
  nodeSet.forEach(node => {
    if (node.data.type == 'f'){
        let optionElement = document.createElement('option');
        optionElement.value = node.data.label;
        optionElement.textContent = node.data.label;
        document.getElementById('from').appendChild(optionElement);
    }
});

    document.getElementById('to').innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    document.getElementById('to').innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>Regions</option>`

    let regionNodes = []

    nodeSet.filter(node => node.data.type == 'r').forEach(node => regionNodes.push(node.data.label))

    regionNodes = regionNodes.sort((a, b) => {
        if (a < b) return -1;
        else if (a == b) return 0;
        else return 1;
    });

    regionNodes.forEach(region => {
        let optionElement = document.createElement('option');
        optionElement.value = region;
        optionElement.textContent = region;
        document.getElementById('to').appendChild(optionElement);
    });

    document.getElementById('to').innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    document.getElementById('to').innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>States</option>`

    let stateNodes = []

    nodeSet.filter(node => node.data.type == 's').forEach(node => stateNodes.push(node.data.label))

    stateNodes = stateNodes.sort((a, b) => {
        if (a < b) return -1;
        else if (a == b) return 0;
        else return 1;
    });

    stateNodes.forEach(label => {
        let optionElement = document.createElement('option');
        optionElement.value = label;
        optionElement.textContent = label;
        document.getElementById('to').appendChild(optionElement);
    });

    document.getElementById('to').innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    document.getElementById('to').innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>Zones</option>`

    let zoneNodes = []

    nodeSet.filter(node => node.data.type == 'z').forEach(node => zoneNodes.push(node.data.label))

    zoneNodes = zoneNodes.sort((a, b) => {
        if (a < b) return -1;
        else if (a == b) return 0;
        else return 1;
    });

    zoneNodes.forEach(label => {
        let optionElement = document.createElement('option');
        optionElement.value = label;
        optionElement.textContent = label;
        document.getElementById('to').appendChild(optionElement);
    });

}

async function renderFIMap() {

    resetCategoryFilters();

    await getMapData();

    setScales();
    setTopKSlider();
    
    if (cy != null) cy.destroy();


    cy = cytoscape({
    
        container: document.getElementById('map'), 
    
        elements: nodeSet.filter(node => node.data.type == 'f' || node.data.type == 'u'),
    
        layout: {
          name: 'preset'
        },
    
        style: [
          {
            selector: 'node',
            style: {
              'border-width': 1,
              'background-color': 'grey'
            }
          },
          {
            selector: 'node[type = "f"]',
            style: {
              'height': FIForeignNodeWH,
              'width': FIForeignNodeWH,
              'label': (node) => {return node.data('label')},
              'text-valign': (node) => node.position('y') < 0 ? 'top' : 'bottom',
              'text-margin-y': (node) => node.position('y') < 0 ? -5 : 5
            }
          },
          {
            selector: 'node[type = "u"]',
            style: {
              'height': FIForeignNodeWH,
              'width': FIForeignNodeWH
            }
          },
          {
            selector: 'node[type = "r"]',
            style: {
              'height': regionNodeWH,
              'width': regionNodeWH,
            }
          },
          {
            selector: 'node[type = "s"]',
            style: {
              'height': stateNodeWH,
              'width': stateNodeWH,
            }
          },
          {
            selector: 'node[type = "z"]',
            style: {
              'height': zoneNodeWH,
              'width': zoneNodeWH,
            }
          },
          {
            selector: 'edge',
            style: {
                'opacity': edgeO,
                'width': function (ele) {return edgeSizeScale(valueMap(ele.data(metric)))},
                'line-color': function (ele) { return colorScale(valueMap(ele.data(metric))) },
                'target-arrow-color': function (ele) { return colorScale(valueMap(ele.data(metric))) },
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled',
                'target-arrow-width': 'match-line',
                'curve-style': 'bezier'
            }
          }
        ],
    
        autoungrabify: true,
        minZoom: 0.8,
        maxZoom: 128,
        wheelSensitivity: 0.5
    
      });

    cy.reset();
    cy.zoom(0.8);
    cy.pan({x: 132.5, y: 82.5})

    const background = new Image();
    background.src = "http://localhost:8000/static/imgs/us_map.svg";

    const bottomLayer = cy.cyCanvas({
        zIndex: -1
    });
    
    const canvas = bottomLayer.getCanvas();
    const ctx = canvas.getContext("2d");

    cy.on("render cyCanvas.resize", evt => {
        bottomLayer.resetTransform(ctx);
        bottomLayer.clear(ctx);
        bottomLayer.setTransform(ctx);
    
        ctx.save();
    
        ctx.drawImage(background, 10, 15, 1080, 670);
    
        ctx.save();

    });

    createEdges();

    cy.on('tap', 'node', evt => {

        if (evt.originalEvent.ctrlKey === true && evt.originalEvent.shiftKey === true) highlightNode(evt.target, 'within', !evt.originalEvent.altKey && !chartsHidden);
        else if (evt.originalEvent.ctrlKey === true) highlightNode(evt.target, 'import', !evt.originalEvent.altKey && !chartsHidden);
        else if (evt.originalEvent.shiftKey === true) highlightNode(evt.target, 'export', !evt.originalEvent.altKey && !chartsHidden);
        else if (evt.originalEvent.altKey === true) highlightNode(evt.target, 'visual', false);
        else if (drillDownMode == 'addup') nodeDrillDownAddUp(evt.target);
        else nodeDrillDownMinimum(evt.target);
    
      });

      cy.on('cxttap', 'node', evt => {

        nodeDrillUp(evt.target)
    
      });

      cy.on('zoom', evt => {

        zoomLevel = cy.zoom() < 1 ? 1 : cy.zoom();
    
        cy.nodes().forEach(node => {
    
          switch (node.data('type')) {
            case 'f':
            case 'u':
                node.style({
                    'width': foreignNodeWH / zoomLevel,
                    'height': foreignNodeWH / zoomLevel,
                    'border-width': nodeBW / zoomLevel
                  })
                  break;
            case 'r':
              node.style({
                'width': regionNodeWH / zoomLevel,
                'height': regionNodeWH / zoomLevel,
                'border-width': nodeBW / zoomLevel
              })
              break;
            case 's':
              node.style({
                'width': stateNodeWH / zoomLevel,
                'height': stateNodeWH / zoomLevel,
                'border-width': nodeBW / zoomLevel
              })
              break;
            case 'z':
              node.style({
                'width': zoneNodeWH / zoomLevel,
                'height': zoneNodeWH / zoomLevel,
                'border-width': nodeBW / zoomLevel
              })
              break;
          }
    
        });
    
        cy.edges().forEach(edge => {
          edge.style({
            'width': edgeSizeScale(valueMap(edge.data(metric))) / zoomLevel,
            'arrow-scale': edgeAS / zoomLevel
          })
        })
    
      })

    cy.on('tap', 'edge', evt => {

        if (evt.originalEvent.altKey && activeMap == 'ip') edgeDrillFI(evt.target)
        else edgeBreakdownDF(evt.target);

    })

    cy.on('mouseover', 'node', evt => {

        setNodeTooltip(evt);
    
    })

    cy.on('mouseout', 'node', evt => {

        document.getElementById('map-tooltip').style.display = 'none'

    })

    cy.on('mouseover', 'edge', evt => {

        setEdgeTooltip(evt)

    })

  // Event handler: Edge mouseout (Hide tooltip)

    cy.on('mouseout', 'edge', evt => {
    
        document.getElementById('map-tooltip').style.display = 'none'

    })

    populateFIDropdownMenu();
    
}