function edgeBreakdownDF(edge) {

    if (disableMapInteractions && !chartsHidden) {
        alert("Map ineractions have been disabled until charts finish rendering.\n\nIf chart updates are undesired, perform the previous action while holding ALT to prevent these updates from occurring.")
        return;
    }

    if (cliqueMode) {
        alert("Cannot perform highlight when displaying cliques.")
        return;
    }

    if (edge == portOfEntryEdge) {
        edgeDrillFI(edge);
        return;
    }
    
    let source = cy.getElementById(parseInt(edge.data('source')))
    let target = cy.getElementById(parseInt(edge.data('target')))

    // Set highlighting mode to "edge" if not already
    if (highlighted.mode != 'edge'){

        highlighted.mode = 'edge';
        highlighted.elements = new Set();
        highlighted.elements.add(edge);

    } else if (highlighted.elements.has(edge)) {

        highlighted.elements.delete(edge);

        if (highlighted.elements.size == 0) {

            highlighted.mode = null
            resetSearch();
            createEdges();
            if (!chartsHidden) initCharts();    

        } else if (!chartsHidden) removeDataFromCharts(source.data('id'), target.data('id'));  

        updateNodeOpacity();
        updateEdgeOpacity();

        return;
        
    } else {

        highlighted.elements.add(edge)

        if (highlighted.elements.size > 2) {

            edgeToDelete = highlighted.elements.entries().next().value[0]
            highlighted.elements.delete(edgeToDelete) 

            let deleteSource = cy.getElementById(parseInt(edgeToDelete.data('source')))
            let deleteTarget = cy.getElementById(parseInt(edgeToDelete.data('target')))

            if (!chartsHidden) removeDataFromCharts(deleteSource.data('id'), deleteTarget.data('id'))

        }
        
    }

    if (!chartsHidden) getChartData(activeMap, 'edge', edge.data('id').substring(0, 2), parseInt(source.data('id')), parseInt(target.data('id')))

    updateEdgeOpacity();
    updateNodeOpacity();

}



function updateNodeOpacity() {

    if (highlighted.mode == null) cy.nodes().style('opacity', 1);

    else if (highlighted.mode == 'edge') {

        cy.nodes().style('opacity', 0.2)

        highlighted.elements.forEach(edge => {
            let source = cy.getElementById(edge.data('source'))
            let target = cy.getElementById(edge.data('target'))

            source.style('opacity', 1)
            target.style('opacity', 1)

        })

    }else if (highlighted.mode == 'visual' && highlighted.elements.size == 1){

        cy.nodes().style('opacity', 0.2)
        highlighted.elements.forEach(node => {
           cy.getElementById(node).style('opacity', 1)
        })
        
    } else {
    
        cy.nodes().style('opacity', 0.2)
        highlighted.elements.forEach(node => cy.getElementById(node).style('opacity', 1))
    
    }

}

function updateEdgeOpacity() {

    if (highlighted.mode != 'edge') cy.edges().style('opacity', 1)
    else {
        cy.edges().style({
            'z-index': 1,
            'opacity': 0.1
        })
        highlighted.elements.forEach(edge => edge.style({
            'z-index': 2,
            'opacity': 1
        }))
    }

}

// Update node color based on metric change

function updateNodeColorDF() {

    cy.nodes().style({
        'background-color': function (ele) { return colorScale(valueMap(ele.data(metric))) }
    })

}

// Function to populate dropdown menu with node names
function populateDFDropdownMenu() {

    //clear options
    document.getElementById('from').innerHTML = '';
    document.getElementById('to').innerHTML = '';

    //add default option
    let oed1 = document.createElement('option');
    oed1.value = "All Regions"
    oed1.textContent = "All Regions"
    document.getElementById('from').appendChild(oed1);
    let oed2 = document.createElement('option');
    oed2.value = "All Regions"
    oed2.textContent = "All Regions"
    document.getElementById('to').appendChild(oed2);

    document.getElementById('from').innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    document.getElementById('from').innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>Regions</option>`

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
        document.getElementById('from').appendChild(optionElement);
    });

    regionNodes.forEach(region => {
        let optionElement = document.createElement('option');
        optionElement.value = region;
        optionElement.textContent = region;
        document.getElementById('to').appendChild(optionElement);
    });

    document.getElementById('from').innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    document.getElementById('from').innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>States</option>`

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
        document.getElementById('from').appendChild(optionElement);
    });

    stateNodes.forEach(label => {
        let optionElement = document.createElement('option');
        optionElement.value = label;
        optionElement.textContent = label;
        document.getElementById('to').appendChild(optionElement);
    });

    document.getElementById('from').innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    document.getElementById('from').innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>Zones</option>`

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
        document.getElementById('from').appendChild(optionElement);
    });

    zoneNodes.forEach(label => {
        let optionElement = document.createElement('option');
        optionElement.value = label;
        optionElement.textContent = label;
        document.getElementById('to').appendChild(optionElement);
    });

  }

// Render the domestic freight map

async function renderDFMap() {
    
    resetCategoryFilters();

    // Fetch data used for nodes and edges

    await getMapData();

  // Set scales based on data collected (using tons as default metric)

    setScales();
    setTopKSlider();

    const background = new Image();
    background.src = "http://localhost:8000/static/imgs/us_map.svg";

  // Create instance of map/graph starting at the regional level

    if (cy != null) cy.destroy();

    cy = cytoscape({

        container: document.getElementById('map'), 

        elements: nodeSet.filter(node => node.data.type == 'r'),

        layout: {
            name: 'preset'
        },

        style: [
            {
                selector: 'node',
                style: {
                    'border-width': nodeBW,
                    'background-color': function (ele) { 
                            if (ele.data(metric) == 0) return 'grey';
                            else return colorScale(valueMap(ele.data(metric))); 
                        }
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
                    'width': function (ele) { return edgeSizeScale(valueMap(ele.data(metric))) },
                    'line-color': function (ele) { return colorScale(valueMap(ele.data(metric))) },
                    'curve-style': 'bezier',
                    'target-arrow-color': function (ele) { return colorScale(valueMap(ele.data(metric))) },
                    'target-arrow-shape': 'triangle',
                    'target-arrow-fill': 'filled'
                }
            }
        ],

        autoungrabify: true,
        minZoom: 1,
        maxZoom: 128,
        wheelSensitivity: 0.5

    });

    createEdges();

    const bottomLayer = cy.cyCanvas({
        zIndex: -1
    });

    const canvas = bottomLayer.getCanvas();
    const ctx = canvas.getContext("2d");

  // Rescale map background

    cy.on("render cyCanvas.resize", evt => {
        bottomLayer.resetTransform(ctx);
        bottomLayer.clear(ctx);
        bottomLayer.setTransform(ctx);

        ctx.save();

        ctx.drawImage(background, 10, 15, 1080, 670);

        ctx.save();
    });

    cy.reset()

    // Event handler: Edge left-click (chart update)

    cy.on('tap', 'edge', function (evt) {

        edgeBreakdownDF(evt.target);
        cy.emit('zoom');

    });

    // Event handler: Node left-click (Drill down/highlight)

    cy.on('tap', 'node', evt => {

        if (evt.originalEvent.ctrlKey === true && evt.originalEvent.shiftKey === true) highlightNode(evt.target, 'within', !evt.originalEvent.altKey && !chartsHidden);
        else if (evt.originalEvent.ctrlKey === true) highlightNode(evt.target, 'import', !evt.originalEvent.altKey && !chartsHidden);
        else if (evt.originalEvent.shiftKey === true) highlightNode(evt.target, 'export', !evt.originalEvent.altKey && !chartsHidden);
        else if (evt.originalEvent.altKey === true) highlightNode(evt.target, 'visual', false);
        else if (drillDownMode == 'addup') nodeDrillDownAddUp(evt.target);
        else nodeDrillDownMinimum(evt.target);

    });

    // Event handler: Node right-click (Drill up)

    cy.on('cxttap', 'node', evt => {

        nodeDrillUp(evt.target);

    });

  // Event handler: Zoom (Resize nodes/edges)

    cy.on('zoom', evt => {

        zoomLevel = cy.zoom();

        cy.nodes().forEach(node => {

            switch (node.data('type')) {
                case 'r':
                    node.style({
                        'width': regionNodeWH / cy.zoom(),
                        'height': regionNodeWH / cy.zoom(),
                        'border-width': nodeBW / cy.zoom()
                    })
                break;
                case 's':
                    node.style({
                        'width': stateNodeWH / cy.zoom(),
                        'height': stateNodeWH / cy.zoom(),
                        'border-width': nodeBW / cy.zoom()
                    })
                break;
                case 'z':
                    node.style({
                        'width': zoneNodeWH / cy.zoom(),
                        'height': zoneNodeWH / cy.zoom(),
                        'border-width': nodeBW / cy.zoom()
                    })
                break;
            }

        });

        cy.edges().style({
            'width': function (edge) { return edgeSizeScale(valueMap(edge.data(metric))) / cy.zoom() },
            'arrow-scale': 1 / (Math.log2(cy.zoom()) + 1)
        })
        

    })

  // Event handler: Node mouseover (Show tooltip)

  cy.on('mouseover', 'node', evt => {

    setNodeTooltip(evt);

    // let node = evt.target;
    // let tooltip = document.getElementById('map-tooltip');
    // let tooltipcontent = document.getElementById('tooltip-content')
    // let nodeType = node.data('type');

    // let message, header;

    // let level = nodeType == 'r' ? 'Region' : (nodeType == 's' ? 'State' : 'Zone');
    
    // message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
    
    // <table>
    //     <tr>
    //         <th>Tons</th>
    //         <th>USD</th>
    //         <th>USD per Ton</th>
    //     </tr>
    //     <tr>
    //         <td>${format(node.data('tons')).replace('G', 'B')}</td>
    //         <td>$${format(node.data('usd')).replace('G', 'B')}</td>
    //         <td>$${format(node.data('usd_per_ton')).replace('G', 'B')}</td>
    //     </tr>
    // </table>
    // <span style='font-size: 12px; font-weight: bold;'> Total Freight Movements Within </span>`

    // tooltip.style.display = 'block';
    // tooltip.style.top = (evt.originalEvent.pageY + 25) + 'px';
    // tooltip.style.left = (evt.originalEvent.pageX + 25) + 'px';
    // tooltipcontent.innerHTML = `<p style='text-align: center;'>` + message + `</p>`

  })

  // Event handler: Node mouseout (Hide tooltip)

    cy.on('mouseout', 'node', evt => {
    
        document.getElementById('map-tooltip').style.display = 'none'

    })

  // Event handler: Edge mouseover (Show tooltip)

    cy.on('mouseover', 'edge', evt => {

        setEdgeTooltip(evt)

    })

  // Event handler: Edge mouseout (Hide tooltip)

    cy.on('mouseout', 'edge', evt => {
    
        document.getElementById('map-tooltip').style.display = 'none'

    })
    populateDFDropdownMenu();
}

async function renderDFCliqueMap(request){
    await get_clique_edges(request);
    await forceCliqueDrillDown(request);
    cy.style()
        .selector('edge')
        .style({
            'curve-style': 'bezier',
            'target-arrow-shape': 'none',
            'source-arrow-shape': 'none' 
        })
        .update();

    var perfectClique = parseInt(edgeSet[0].data.id.includes('ss')? 45: 190);
    cy.add(edgeSet);
    clique_density = parseInt(edgeSet[0].data.clique_density);
    cy.edges().forEach(edge => {
        edge.style({
            'line-color': clique_density == perfectClique? 'green': 'red'
        });
    });
    cy.nodes().style('background-color', 'grey')
}