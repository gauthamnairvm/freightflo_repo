const foreignNodeWH = 40;
const regionNodeWH = 30;
const stateNodeWH = 20;
const zoneNodeWH = 10;
const nodeBW = 2;
const edgeW = 4;
const edgeO = 0.8;
const edgeOI = 0;
const edgeAS = 1.2;
const zoom = 1;

let disableMapInteractions = false;

let cy = null;

let cliqueMode = false;

let nodeSet = [], nodeWeightSet = [], edgeSet = [];
let commoditySet = [], modeSet = [], years = [2018, 2019, 2020, 2021, 2022];

let selectedEdges = [];

let category = 'a';
let subcategory = 0;

let zoomLevel = null;
let drillDownMode = 'addup';
let metric = 'tons';
let edgeRange = [];
let visibleEdges = {
    'fu': true,
    'fr': true,
    'fs': true,
    'fz': true,
    'rr': true,
    'rs': true,
    'sr': true,
    'rz': true,
    'zr': true,
    'ss': true,
    'sz': true,
    'zs': true,
    'zz': true,
    'd': true,
};

let highlighted = {
    chartUpdate: false,
    mode: null,             // null, edge, import, export, within, visual
    elements: new Set()     // Can be nodes or edges depending on the mode
}

let topKFilter = {
    active: false,
    mode: 'top',
    k: 10
}

let colorScale, edgeSizeScale;

let format = d3.format(".3~s");

function setTopKSlider() {

    if (document.getElementById('topkslider-range').hasChildNodes()) d3.select('#topkslider-range').select('svg').remove();

    topkLabels = [1, 10, 20, 30, 40, 50];

    const topksliderRange = d3
        .sliderBottom()
        .min(0)
        .max(50)
        .width(750)
        .ticks(6)
        .tickFormat((d, i) => topkLabels[i])
        .default(10)
        .fill('#85bb65')
        .step(1);

    topksliderRange.on('onchange', val => {

        topKFilter.k = val == 0 ? 1 : val

        if (cliqueMode) return;

        createEdges();

    });

    const topkslider = d3
        .select('#topkslider-range')
        .append('svg')
        .attr('width', 1150)
        .attr('height', 100)
        .attr('display', 'block')
        .attr('margin', 'auto')
        .append('g')
        .attr('transform', 'translate(25, 7.5)')


    topkslider.call(topksliderRange)

}

function valueMap(value) {
    return Math.log10(parseInt(value + 1));
}

function setLegend(maxPower) {

    let legendPadding = (1100 / maxPower) - 15;

    if (document.getElementById('legend').hasChildNodes()) d3.select('#legend').select('g').remove();

    let legendLabels = []

    for (let i = 0; i <= maxPower; i++) {
        legendLabels.push('');
    }

    const legend = d3.legendColor()
        .scale(colorScale)
        .cells(maxPower + 1)
        .orient('horizontal')
        .ascending(true)
        .shapePadding(legendPadding)
        .labels(legendLabels)

    d3.select('#legend')
        .append('g')
        .attr('transform', 'translate(17.5, 7.5)')
        .call(legend)

}



// Create and format range slider for edge weights

function setSliderScale(maxPower, maxValue) {

    if (metric == 'usd') labels = ['$' + 0];
    else labels = [0];

    for (let i = 1; i <= maxPower; i++) {
        let power = Math.pow(10, i)
        if (metric == 'usd') labels.push('$' + format(power).replace('G', 'B'));
        else labels.push(format(power).replace('G', 'B'))
    }

    if (document.getElementById('slider-range').hasChildNodes()) d3.select('#slider-range').select('svg').remove();

    const sliderRange = d3
        .sliderBottom()
        .min(0)
        .max(maxPower)
        .width(1100)
        .ticks(maxPower + 1)
        .tickFormat((d, i) => labels[i])
        .default([0, Math.ceil(Math.log10(maxValue))])
        .fill('#85bb65');

    sliderRange.on('onchange', val => {

        edgeRange[0] = Math.pow(10, val[0]);
        edgeRange[1] = Math.pow(10, val[1]);

        if (cliqueMode) return;

        createEdges();

    });

    const slider = d3
        .select('#slider-range')
        .append('svg')
        .attr('width', 1150)
        .attr('height', 100)
        .attr('display', 'block')
        .attr('margin', 'auto')
        .append('g')
        .attr('transform', 'translate(25, 7.5)')


    slider.call(sliderRange)

}



// Determine range for edge weights and initialize color scale, range slider, and legend based on that range

function setScales() {

    let maxValue;

    if (metric.includes('diff')) maxValue = edgeSet.reduce((a, b) => Math.max(a, b.data[metric]), -Infinity)
    else {
        maxValue = Math.max(
            nodeSet.reduce((a, b) => Math.max(a, b.data.hasOwnProperty(metric) ? b.data[metric] : 0), -Infinity),
            edgeSet.reduce((a, b) => Math.max(a, b.data[metric]), -Infinity)
        );
    }

    edgeRange = [0, maxValue];

    let maxPower = Math.ceil(Math.log10(maxValue));

    colorScale = d3.scaleSequential([maxPower, 0], d3.interpolateTurbo);
    edgeSizeScale = d3.scaleSequential([0, maxPower], [2, 6]);

    setSliderScale(maxPower, maxValue);
    setLegend(maxPower);

}

async function initNodes() {

    await fetch('/get_map_nodes', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    }).then(response => {
        return response.json();
    }).then(data => {
        parseNodes(data);
    }).catch(error => {
        console.error('Error: ', error);
    })

}

async function initCategories() {

    await fetch('/get_categories', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    }).then(response => {
        return response.json();
    }).then(data => {
        parseCommodities(data.commodities);
        parseModes(data.modes)
    }).catch(error => {
        console.error('Error: ', error);
    })

}


// Update the color of a node (nodeSet will have updated weights through parseNodeWeights() being called on new map data)

function updateNodeWeights() {

    cy.nodes().map(node => {

        nodeId = parseInt(node.data('id'))

        updateNode = nodeSet.find(node => node.data.id == nodeId)

        node.data('tons', updateNode.tons)
        node.data('usd', updateNode.usd)
        node.data('usd_per_ton', updateNode.usd_per_ton)

    });

    cy.nodes().style({
        'background-color': function (ele) {
            if (ele.data(metric) == 0 || (highlighted.mode != null && highlighted.mode != 'visual' && highlighted.mode != 'within')) return 'grey';
            else return colorScale(valueMap(ele.data(metric)));
        }
    })

}

// Parse node weights from new map data and update in nodeSet

function parseNodeWeights(data) {

    nodeSet.forEach(node => {
        node.data['tons'] = 0
        node.data['usd'] = 0
        node.data['usd_per_ton'] = 0
    })

    data.forEach(record => {
        nodeSet.forEach(node => {
            if (record.id == node.data.id) {
                node.data['tons'] = record.tons
                node.data['usd'] = record.usd
                node.data['usd_per_ton'] = record.usd_per_ton
            }
        })
    })

}

// Parse nodes from map data (only invoked once on app start - only weights need to be updated when new data is loaded)

function parseNodes(data) {

    nodeSet = [];

    data.forEach(record => {

        let obj = {

            'data': {
                'id': record.id,
                'label': record.label,
                'type': record.type,
                'fzone_id': record.fzone_id,
                'fzone_desc': record.fzone_desc,
                'region_id': record.region_id,
                'region_desc': record.region_desc,
                'state_id': record.state_id,
                'state_desc': record.state_desc,
                'zone_id': record.zone_id,
                'zone_desc': record.zone_desc,
                'tons': 0,
                'usd': 0,
                'usd_per_ton': 0
            },

            'position': {
                'x': record.x,
                'y': record.y
            }

        }

        nodeSet.push(obj)

    });

}

// Parse edges whenever new map data is loaded

function parseEdges(data) {

    edgeSet = [];

    data.forEach(record => {

        let obj = { 'data': record };

        edgeSet.push(obj);

    })

}

// Parse commodities on app start

function parseCommodities(data) {

    commoditySet = [];

    data.forEach(record => commoditySet.push(record))

    commoditySet = commoditySet.sort((a, b) => {
        if (a.desc < b.desc) return -1;
        else if (a.desc == b.desc) return 0;
        else return 1;
    })

}

// Parse transportation modes on app start

function parseModes(data) {

    modeSet = [];

    data.forEach(record => modeSet.push(record))

    modeSet = modeSet.sort((a, b) => {
        if (a.desc < b.desc) return -1;
        else if (a.desc == b.desc) return 0;
        else return 1;
    })

}

// Determines drill down behavior in 'add-up' mode

function nodeDrillDownAddUp(node) {

    if (highlighted.mode != null && highlighted.elements.has(parseInt(node.data('id')))) {   // If the node is currently highlighted, do not drill
        alert('Cannot perform drill-down on a highlighted node.')
        return;
    }

    if (cliqueMode) {
        alert('Cannot perform drill-down in clique mode.')
        return;    
    }

    if (highlighted.mode == 'edge') {       // If the node is adjacent to a highlighted edge, do not drill

        let nodeInEdgeHighlight = false

        highlighted.elements.forEach(edge => {
            if (edge.data('source') == node.data('id') || edge.data('target') == node.data('id')) nodeInEdgeHighlight = true;
        })

        if (nodeInEdgeHighlight) {
            alert('Cannot perform drill-down on a node adjacent to a highlighted edge.')
            return;
        }
    }

    if (portOfEntryDrilled && portOfEntryNode.data('id') == parseInt(node.data('id'))) {  // If the node is selected as a port-of-entry, do not drill
        alert('Cannot perform drill-down on a toggled port-of-entry/exit.')
        return;
    }

    if (node.data('type') == 'f' || node.data('type') == 'z') return;   // Cannot drill on foreign nodes or zone nodes

    node.remove();  // Remove selected node

    let nodeId = parseInt(node.data('id'));
    let nodesToAdd;

    // Depending on type of node, determine which child nodes to render
    if (node.data('type') == 'u') nodesToAdd = nodeSet.filter(node => node.data.type == 'r');
    else if (node.data('type') == 'r') nodesToAdd = nodeSet.filter(node => node.data.type == 's' && node.data.region_id == nodeId);
    else if (node.data('type') == 's') nodesToAdd = nodeSet.filter(node => node.data.type == 'z' && node.data.state_id == nodeId);
    else return;

    cy.add(nodesToAdd);

    updateNodeOpacity();    // Reflect any changes in opacity due to highlighting
    createEdges();          // Create all possible edges with updated nodes
    cy.emit('zoom');        // Zoom to adjust size of nodes/edges

}

// Determines drill down behavior in 'minimum' mode

function nodeDrillDownMinimum(node) {

    if (cliqueMode) {
        alert('Cannot perform drill-down in clique mode.')
        return;    
    }

    if (highlighted.mode != null && highlighted.elements.has(node)) {   // If the node is currently highlighted, do not drill
        alert('Cannot perform drill-down on a highlighted node.')
        return;
    }

    if (highlighted.mode == 'edge') {       // If the node is adjacent to a highlighted edge, do not drill

        let nodeInEdgeHighlight = false

        highlighted.elements.forEach(edge => {
            if (edge.data('source') == node.data('id') || edge.data('target') == node.data('id')) nodeInEdgeHighlight = true;
        })

        if (nodeInEdgeHighlight) {
            alert('Cannot perform drill-down on a node adjacent to a highlighted edge.')
            return;
        }
    }

    if (portOfEntryDrilled && portOfEntryNode.data('id') == parseInt(node.data('id'))) {  // If the node is selected as a port-of-entry, do not drill
        alert('Cannot perform drill-down on a toggled port-of-entry/exit.')
        return;
    }

    if (node.data('type') == 'f' || node.data('type') == 'z') return;   // Cannot drill on foreign nodes or zone nodes

    let nodeId = parseInt(node.data('id'));
    let nodesToRemove = [], nodesToAdd;

    if (node.data('type') == 'u') {

        nodesToAdd = nodeSet.filter(node => node.data.type == 'r');

    } else if (node.data('type') == 'r') {

        nodesToRemove = cy.nodes().filter(node => node.data('type') == 's' || node.data('type') == 'z');

        nodesToAdd = nodeSet.filter(node => node.data.type == 's' && node.data.region_id == nodeId);

        if (nodesToRemove.length != 0) {
            regionToAdd = parseInt(nodesToRemove[0].data('region_id'));
            nodesToAdd.push(nodeSet.find(node => node.data.id == regionToAdd));
        }

    } else if (node.data('type') == 's') {

        nodesToRemove = cy.nodes().filter(node => node.data('type') == 'z');

        nodesToAdd = nodeSet.filter(node => node.data.type == 'z' && node.data.state_id == nodeId);

        if (nodesToRemove.length != 0) {
            stateToAdd = parseInt(nodesToRemove[0].data('state_id'));
            nodesToAdd.push(nodeSet.find(node => node.data.id == stateToAdd));
        }

    } else return;

    nodesToRemove.push(node);

    nodesToRemove.forEach(node => node.remove());

    cy.add(nodesToAdd);

    updateNodeOpacity();
    createEdges();
    cy.emit('zoom');

}

function nodeDrillUp(node) {

    if (cliqueMode) {
        alert('Cannot perform drill-up in clique mode.')
        return;    
    }

    if (highlighted.mode != null && highlighted.mode != 'edge') {

        let letDrill = true;

        if (node.data('type') == 's') {
            highlighted.elements.forEach(nodeID => {
                highlightedNode = nodeSet.find(node => node.data.id == nodeID);
                if (highlightedNode.data.region_id == parseInt(node.data('region_id'))) letDrill = false;
            })
        } else if (node.data('type') == 'z') {
            highlighted.elements.forEach(nodeID => {
                highlightedNode = nodeSet.find(node => node.data.id == nodeID);
                if (highlightedNode.data.state_id == parseInt(node.data('state_id'))) letDrill = false;
            })
        }
        
        if (!letDrill) return;

    }

    if (highlighted.mode == 'edge') {

        let letDrill = true;

        if (node.data('type') == 's') {
            highlighted.elements.forEach(edge => {
                let source = nodeSet.find(node => node.data.id == parseInt(edge.data('source')));
                let target = nodeSet.find(node => node.data.id == parseInt(edge.data('target')));
                if (source.data.region_id == parseInt(node.data('region_id')) || target.data.region_id == parseInt(node.data('region_id'))) letDrill = false;
            })
        } else if (node.data('type') == 'z') {
            highlighted.elements.forEach(edge => {
                let source = nodeSet.find(node => node.data.id == parseInt(edge.data('source')));
                let target = nodeSet.find(node => node.data.id == parseInt(edge.data('target')));
                if (source.data.state_id == parseInt(node.data('state_id')) || target.data.state_id == parseInt(node.data('state_id'))) letDrill = false;
            })
        }
        
        if (!letDrill) return;

    }

    if (portOfEntryDrilled && portOfEntryNode.data('id') == parseInt(node.data('id'))) return;

    if (node.data('type') == 'f' || node.data('type') == 'u' || (activeMap == 'df' && node.data('type') == 'r')) return;

    let nodesToRemove, nodeToAdd;

    switch (node.data('type')) {

        case 'r':

            nodesToRemove = cy.nodes().filter(node => node.data('type') != 'f');
            nodeToAdd = nodeSet.find(node => node.data.type == 'u');

            break;

        case 's':

            let nodeRegionId = node.data('region_id')

            nodesToRemove = cy.nodes().filter(node => node.data('region_id') == nodeRegionId);
            nodeToAdd = nodeSet.find(node => node.data.id == nodeRegionId);

            break;

        case 'z':

            let nodeStateId = node.data('state_id')

            nodesToRemove = cy.nodes().filter(node => node.data('state_id') == nodeStateId);
            nodeToAdd = nodeSet.find(n => n.data.id == nodeStateId);

            break;

    }

    if (portOfEntryNode != null && nodesToRemove.contains(portOfEntryNode)) return;

    nodesToRemove.remove();

    cy.add(nodeToAdd);

    updateNodeOpacity();
    createEdges();

}

async function updateDrillDown() {

    // drillDownMode = document.getElementById('drill-down-select').value;

    clearPortSelection();
    highlighted.mode = null;
    resetSearch();

    await getMapData();

    cy.nodes().remove();

    if (activeMap == 'df') {
        cy.add(nodeSet.filter(node => node.data.type == 'r'))
        createEdges();
    } else {
        cy.add(nodeSet.filter(node => node.data.type == 'u' || node.data.type == 'f'))
        createEdges();
    }

    await initCharts();

}

function updateEdgeWeights() {

    metric = document.getElementById('edge-weight-select').value;
    d3.select('#slider-range').select('svg').remove();

    setScales();

    if(cliqueMode){
        let subCat = subcategorySelect.value == 'a' ? 'c1': subcategorySelect.value;
        let node_type = document.getElementById('show-states').checked? 'ss': document.getElementById('show-zones').checked? 'zz':'ss';
        let request = {
            'category': subCat,
            'metric': metric,
            'node_type': node_type
            }
        renderDFCliqueMap(request);
    } else {
        createEdges();
    }

    let label = document.getElementById('map-label')

    switch (metric) {
        case 'tons':
            label.innerHTML = "Map Overview: Freight Movements by Tonnage"
            break;
        case 'usd':
            label.innerHTML = "Map Overview: Freight Movements by USD"
            break;
        case 'usd_per_ton':
            label.innerHTML = "Map Overview: Freight Movements by USD per Ton"
            break;
    }

    updateNodeWeights();
    updateChartMetric(metric);

}

function setNodeOpacity() {

    cy.nodes().style('opacity', 0.2)

    highlighted.elements.forEach(node => {
        cy.getElementById(node).style('opacity', 1)
    })

}

function resetNodeOpacity() {
    cy.nodes().style('opacity', 1)
}


function edgeTypeSelection(id) {

    if (!document.getElementById(id).checked) {
        visibleEdges[id] = false;
    } else {
        visibleEdges[id] = true
    }

    createEdges();

}

function createEdges() {

    cy.edges().remove();    // Remove existing edges

    if (highlighted.mode == 'within') {     // If in "within" highlighting mode, only add back a port edge if possible

        if (portOfEntryDrilled) {
            cy.add(portOfEntryEdge)
            portOfEntryEdge.style({
                'line-style': 'dashed',
                'line-color': 'black',
                'target-arrow-color': 'black'
            })
        }
        return;

    }

    let activeNodeIds = [];     // Determine which nodes to draw edges between

    if (highlighted.elements.size > 1 && highlighted.mode == 'visual') highlighted.elements.forEach(node => activeNodeIds.push(node))
    else activeNodeIds = cy.nodes().map(node => parseInt(node.data('id')))

    let edgesToAdd;

    if (highlighted.mode == 'visual') {  // "Visual" highlighting - If one is highlighted show all edges adjacent, otherwise show between all highlighted

        if (highlighted.elements.size == 1) {

            let highlightedNode = parseInt(highlighted.elements.values().next().value);

            edgesToAdd = edgeSet.filter(edge => {

                let source = parseInt(edge.data.source)
                let target = parseInt(edge.data.target)

                return edge.data[metric] >= edgeRange[0]             // Edge metric within range slider
                    && edge.data[metric] <= edgeRange[1]
                    && ((highlightedNode == source && activeNodeIds.includes(target))
                        || (highlightedNode == target && activeNodeIds.includes(source)));

            })

        } else {

            edgesToAdd = edgeSet.filter(edge => {

                let source = parseInt(edge.data.source)
                let target = parseInt(edge.data.target)

                return edge.data[metric] >= edgeRange[0]
                    && edge.data[metric] <= edgeRange[1]
                    && activeNodeIds.includes(source)
                    && activeNodeIds.includes(target);

            })

        }

    } else if (highlighted.mode == 'import') {   // "Import" highlighting - Only show incoming edges to highlighted nodes 

        let highlightedNodes = [];

        highlighted.elements.forEach(node => highlightedNodes.push(node))

        edgesToAdd = edgeSet.filter(edge => {

            let source = parseInt(edge.data.source)
            let target = parseInt(edge.data.target)

            return edge.data[metric] >= edgeRange[0]
                && edge.data[metric] <= edgeRange[1]
                && activeNodeIds.includes(source)
                && highlightedNodes.includes(target);

        })

    } else if (highlighted.mode == 'export') {   // "Export" highlighting - Only show outgoing edges from highlighted nodes

        let highlightedNodes = [];

        highlighted.elements.forEach(node => highlightedNodes.push(node))

        edgesToAdd = edgeSet.filter(edge => {

            let source = parseInt(edge.data.source)
            let target = parseInt(edge.data.target)

            return edge.data[metric] >= edgeRange[0]
                && edge.data[metric] <= edgeRange[1]
                && activeNodeIds.includes(target)
                && highlightedNodes.includes(source);

        })

    } else {    // No highlighting mode

        edgesToAdd = edgeSet.filter(edge => {

            let source = parseInt(edge.data.source)
            let target = parseInt(edge.data.target)

            return edge.data[metric] >= edgeRange[0]
                && edge.data[metric] <= edgeRange[1]
                && activeNodeIds.includes(source)
                && activeNodeIds.includes(target);

        })

    }


    if (topKFilter.active && edgesToAdd.length > topKFilter.k) {    // If "top k" is active, select top k from possible edges to display 

        if (topKFilter.mode == 'top') edgesToAdd = edgesToAdd.sort((a, b) => b.data[metric] - a.data[metric]).slice(0, topKFilter.k);
        else edgesToAdd = edgesToAdd.sort((a, b) => a.data[metric] - b.data[metric]).slice(0, topKFilter.k);

    }

    cy.add(edgesToAdd);

    if (portOfEntryDrilled) {    // Port edge will not be in edge set, so if one needs to be shown this is performed

        cy.add(portOfEntryEdge)

        portOfEntryEdge.style({
            'line-style': 'dashed',
            'line-color': 'black',
            'target-arrow-color': 'black'
        })

    }

    resetEdgeHighlight();   // If edges were highlighted prior, ensure a corresponding edge still exists in the graph
    updateEdgeOpacity();    // Adjust edge opacities if edges are highlighted
    cy.emit('zoom')

}

async function forceRegionDrillDown() {

    // Clear any port selections or highlighting 

    clearPortSelection();
    highlighted.mode = null;
    resetSearch();

    await getMapData();
    await initCharts();

    // Default to add-up drill-down mode

    drillDownMode = 'addup'
    // document.getElementById('drill-down-select').value = 'addup'

    // Remove nodes and draw region nodes

    cy.nodes().remove()

    if (activeMap == 'df') cy.add(nodeSet.filter(node => node.data.type == 'r'))
    else cy.add(nodeSet.filter(node => node.data.type == 'r' || node.data.type == 'f'))

    createEdges();
    updateNodeOpacity();

}

async function forceStateDrillDown() {

    clearPortSelection();
    highlighted.mode = null;
    resetSearch();

    if(cliqueMode){
        let subCat = subcategorySelect.value == 'a' ? 'c1': subcategorySelect.value;
        let metric = document.getElementById('edge-weight-select').value;
        let node_type = 'ss';
        let request = {
            'category': subCat,
            'metric': metric,
            'node_type': node_type
            }
        await renderDFCliqueMap(request);
        }else{

    await getMapData();
    await initCharts();

    drillDownMode = 'addup'
    // document.getElementById('drill-down-select').value = 'addup'

    cy.nodes().remove()

    if (activeMap == 'df') cy.add(nodeSet.filter(node => node.data.type == 's'))
    else cy.add(nodeSet.filter(node => node.data.type == 's' || node.data.type == 'f'))

    createEdges();
    updateNodeOpacity();
        }

}

async function forceZoneDrillDown() {

    clearPortSelection();
    highlighted.mode = null;
    resetSearch();

    if(cliqueMode){
        let subCat = subcategorySelect.value == 'a' ? 'c1': subcategorySelect.value;
        let metric = document.getElementById('edge-weight-select').value;
        let node_type = 'zz';
        let request = {
            'category': subCat,
            'metric': metric,
            'node_type': node_type
            }
        await renderDFCliqueMap(request);
        }else{

    await getMapData();
    await initCharts();

    drillDownMode = 'addup'
    // document.getElementById('drill-down-select').value = 'addup'

    cy.nodes().remove()

    if (activeMap == 'df') cy.add(nodeSet.filter(node => node.data.type == 'z'))
    else cy.add(nodeSet.filter(node => node.data.type == 'z' || node.data.type == 'f'))

    createEdges();
    updateNodeOpacity();
        }

}

initNodes();
initCategories();

async function portOfEntryToggle() {

    // If port mode is toggled, switch the map type to reflect this change

    if (document.getElementById('port-of-entry').checked) activeMap = activeMap == 'id' ? 'ip' : 'ep';
    else {
        activeMap = activeMap == 'ip' ? 'id' : 'ed';
        clearPortSelection();
    }

    highlighted.mode = null;
    resetSearch();

    await getMapData();
    setScales();
    createEdges();
    updateNodeWeights();
    updateNodeOpacity();
    updateEdgeOpacity();

}

async function getMapData() {

    request = {
        'map': activeMap,
        'category': category,
        'subcategory': subcategory,
        'fzone': portOfEntryDrilled ? foreignOriginNode.data('id') : -1,
        'port': portOfEntryDrilled ? portOfEntryNode.data('id') : -1
    }

    await fetch('/get_map_data', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(response => {
        return response.json();
    }).then(data => {
        parseNodeWeights(data.node_weights);
        parseEdges(data.edges);
    }).catch(error => {
        console.error('Error: ', error);
    })

}

async function filterMapByCategory() {

    subcategorySelect = document.getElementById('subcategory-select')

    if(cliqueMode){
        let subCat = subcategorySelect.value == 'a' ? 'c1': subcategorySelect.value;
        let metric = document.getElementById('edge-weight-select').value;
        let node_type = document.getElementById('show-states').checked? 'ss': document.getElementById('show-zones').checked? 'zz':'ss';
        let request = {
            'category': subCat,
            'metric': metric,
            'node_type': node_type
            }
        await renderDFCliqueMap(request);
    }else{

    category = subcategorySelect.value.substring(0, 1);
    subcategory = parseInt(subcategorySelect.value.substring(1));

    if (category == 'a') subcategory = 0;

    await getMapData();     // Invoking this function implies a new edge set must be loaded

    if (portOfEntryDrilled && edgeSet.filter(edge => edge.data.source == parseInt(portOfEntryNode.data('id'))).length == 0) {
        // If the port selected under this filter does not provide freight movements, clear the selection and refresh the map
        clearPortSelection();
        await getMapData();
        await initCharts();
    }

    // If a highlighted node ceases to have data, clear the highlight and loc filter
    if (highlighted.mode != null && !validNodeHighlight()) {
        highlighted.mode = null;
        resetSearch();
        await initCharts();
    }
    // If there is no port selected, the edge scales must be updated 
    if (!portOfEntryDrilled) setScales();

    createEdges();

    // If there are no edges to transfer an edge highlight to, clear the highlight and loc filter
    if (!validEdgeHighlight()) {
        highlighted.mode = null;
        resetSearch();
        await initCharts();
    }
    // Update the node weights from the new map data, and update the appearence of edge depending on highlighting
    updateNodeWeights();
    updateNodeOpacity();
    updateEdgeOpacity();

    // If the category is 'a', do not filter the charts - otherwise, filter by the selection
    if (category == 'a') filterChartToggleFromMap(null, 'a');
    else filterChartToggleFromMap(subcategorySelect.options[subcategorySelect.selectedIndex].text, category)
    }

}

function resetCategoryFilters() {

    subcategorySelect = document.getElementById('subcategory-select')
    subcategorySelect.innerHTML = '';

    category = 'a';
    subcategory = 0;

    chartState.filter = null;

    subcategorySelect.innerHTML += `<option value=a>No Filter</option>`
    subcategorySelect.innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    subcategorySelect.innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>Commodities</option>`
    commoditySet.forEach(commodity => {
        subcategorySelect.innerHTML += `<option value=${'c' + commodity.id}>${commodity.desc}</option>`
    });
    subcategorySelect.innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    subcategorySelect.innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>Modes</option>`
    modeSet.forEach(mode => {
        subcategorySelect.innerHTML += `<option value=${'m' + mode.id}>${mode.desc}</option>`
    });
    subcategorySelect.innerHTML += `<option value=0 style="font-size: 6pt; font-weight: bold;" disabled></option>`
    subcategorySelect.innerHTML += `<option value=0 style="font-size: 12pt; text-align: center; font-weight: bold;" disabled>Years</option>`
    years.forEach(year => {
        subcategorySelect.innerHTML += `<option value=${'y' + year}>${year}</option>`
    });

    subcategorySelect.value = 'a';

}

function updateNodeColor() {
    cy.nodes().style({
        'background-color': function (ele) {
            if (ele.data(metric) == 0 || (highlighted.mode != null && highlighted.mode != 'visual' && highlighted.mode != 'within')) return 'grey';
            else return colorScale(valueMap(ele.data(metric)));
        }
    })
}

function resetEdgeHighlight() {

    if (highlighted.mode != 'edge') return;

    let originalSize = highlighted.elements.size;

    let edgesToAdd = []

    highlighted.elements.forEach(edge => {

        let source = parseInt(cy.getElementById(parseInt(edge.data('source'))).data('id'))
        let target = parseInt(cy.getElementById(parseInt(edge.data('target'))).data('id'))

        edgesToAdd.push(cy.edges().find(activeEdge => parseInt(activeEdge.data('source')) == source && parseInt(activeEdge.data('target')) == target))
    })

    highlighted.elements.clear()

    edgesToAdd.forEach(edge => {
        if (edge != undefined) highlighted.elements.add(edge)
    });

    if (highlighted.elements.size != originalSize) {
        highlighted.mode = null;
        resetSearch();
        initCharts(activeMap);
    }
}



async function clearPortSelection() {

    foreignOriginNode = null;
    portOfEntryEdge = null;
    portOfEntryNode = null;
    portOfEntryDrilled = false;

    highlighted.mode = null;
    resetSearch();

}

function validEdgeHighlight() {

    let validHighlight = true;

    if (highlighted.mode == 'edge') {

        let originalSize = highlighted.elements.size;

        let edgesToAdd = []

        highlighted.elements.forEach(edge => {

            let source = parseInt(cy.getElementById(parseInt(edge.data('source'))).data('id'))
            let target = parseInt(cy.getElementById(parseInt(edge.data('target'))).data('id'))

            edgesToAdd.push(cy.edges().find(activeEdge => parseInt(activeEdge.data('source')) == source && parseInt(activeEdge.data('target')) == target))
        })

        highlighted.elements.clear()

        edgesToAdd.forEach(edge => {
            if (edge != undefined) highlighted.elements.add(edge)
        });

        if (highlighted.elements.size != originalSize) validHighlight = false;

    }

    return validHighlight;

}

function validNodeHighlight() {

    let validHighlight = true;

    if (highlighted.mode == 'import') {

        highlighted.elements.forEach(node => {

            if (edgeSet.filter(edge => edge.data.target == node).length == 0 && validHighlight) {
                highlighted.mode = null;
                resetSearch();
                initCharts(activeMap);
                validHighlight = false;
            }
        })

    } else if (highlighted.mode == 'export') {

        highlighted.elements.forEach(node => {
            if (edgeSet.filter(edge => edge.data.source == node).length == 0 && validHighlight) {
                highlighted.mode = null;
                resetSearch();
                initCharts(activeMap);
                validHighlight = false;
            }
        })

    } else if (highlighted.mode == 'within') {

        highlighted.elements.forEach(node => {

            if (nodeWeightSet.find(nodeInSet => nodeInSet.data.id == node) == undefined) {
                highlighted.mode = null;
                resetSearch();
                initCharts(activeMap);
                validHighlight = false;
            }

        })
    }

    return validHighlight;

}

function highlightNode(node, mode, updateCharts) {

    if (disableMapInteractions) {
        alert("Map ineractions have been disabled until charts finish rendering.\n\nIf chart updates are undesired, perform the previous action while holding ALT to prevent these updates from occurring.")
        return;
    }

    if (cliqueMode) {   // If the node is currently highlighted, do not drill
        alert('Cannot perform highlighting when displaying cliques.')
        return;
    }

    if (mode == 'within' && node.data('tons') == 0) return;     // Attempt to highlight node without freight movements within 
    if (mode == 'export' && edgeSet.filter(edge => edge.data.source == parseInt(node.data('id'))).length == 0) return;  // Attempt to highlight node without outgoing edges
    if (mode == 'import' && edgeSet.filter(edge => edge.data.target == parseInt(node.data('id'))).length == 0) return;  // Attempt to highlight node without incoming edges
    if (mode == 'export' && portOfEntryDrilled && activeMap == 'ep') return;  // Attempt to highlight imports to node while drilled on imports map
    if (mode == 'import' && portOfEntryDrilled && activeMap == 'ip') return;  // Attempt to highlight imports to node while drilled on imports map 

    let nodeID = parseInt(node.data('id'));

    if (highlighted.mode != mode || highlighted.chartUpdate != updateCharts) {   // Highlighting mode does not match

        if (highlighted.chartUpdate != updateCharts && !updateCharts && highlighted.mode != null) initCharts();    // Reset charts if going from highlighting + chart update to only highlighting

        highlighted.chartUpdate = updateCharts;
        highlighted.mode = mode;
        highlighted.elements = new Set();
        highlighted.elements.add(nodeID);

    } else if (highlighted.elements.has(nodeID)) {    // Node is already highlighed 

        highlighted.elements.delete(nodeID);

        if (highlighted.elements.size == 0) {

            highlighted.mode = null
            resetSearch();
            if (updateCharts) initCharts();    // If charts are to be updated, reset the charts when no longer highlighting

        } else if (mode != 'visual' && updateCharts) removeDataFromCharts(node.data('id'), null);  // Remove trace when highlighted node is deselected but another is still highlighted

        createEdges();
        updateNodeOpacity();
        updateNodeColor();

        return;

    } else {

        highlighted.elements.add(nodeID)

        if (highlighted.elements.size > 2 && mode != 'visual') {    // If more than two nodes are highlighted, pick the oldest and remove it from the selection

            nodeToDelete = highlighted.elements.entries().next().value[0]
            highlighted.elements.delete(nodeToDelete)
            if (mode != 'visual' && updateCharts) removeDataFromCharts(nodeToDelete, null)

        }

    }

    if (mode == 'within' && updateCharts) getChartData(activeMap, mode, node.data('type'), node.data('id'), node.data('id'));
    else if (mode == 'import' && updateCharts) getChartData(activeMap, mode, node.data('type'), null, node.data('id'));
    else if (mode == 'export' && updateCharts) getChartData(activeMap, mode, node.data('type'), node.data('id'), null);

    createEdges();
    updateNodeOpacity();
    updateNodeColor();

}

function toggleTopKFilter() {

    if (document.getElementById('top-k-toggle').checked) {

        var radios = document.getElementsByName('top-bottom');
        for (var i = 0, r = radios, l = r.length; i < l; i++) {
            r[i].disabled = false;
        }

        document.getElementById('top-k-label').style.color = "rgba(0, 0, 0, 1)";
        document.getElementById('bottom-k-label').style.color = "rgba(0, 0, 0, 1)";
        document.getElementById('topkslider-container').style.opacity = "1";

        topKFilter.active = true

        createEdges();

    } else {

        var radios = document.getElementsByName('top-bottom');
        for (var i = 0, r = radios, l = r.length; i < l; i++) {
            r[i].disabled = true;
        }

        document.getElementById('top-k-label').style.color = "rgba(0, 0, 0, 0.5)";
        document.getElementById('bottom-k-label').style.color = "rgba(0, 0, 0, 0.5)";
        document.getElementById('topkslider-container').style.opacity = "0.5";

        topKFilter.active = false;

        createEdges();

    }

}

function toggleTopKFilterMode() {

    if (document.getElementById('top-k').checked) {

        topKFilter.mode = 'top';
        createEdges();

    } else {

        topKFilter.mode = 'bottom';
        createEdges();

    }

}

async function showPorts() {

    document.getElementById('show-ports').style.display = 'none';
    document.getElementById('hide-ports').style.display = 'block';

    activeMap = activeMap == 'id' ? 'ip' : 'ep';

    highlighted.mode = null;
    resetSearch();

    await getMapData();
    setScales();
    createEdges();
    updateNodeWeights();
    updateNodeOpacity();
    updateEdgeOpacity();

    await initCharts();

}

async function hidePorts() {

    document.getElementById('show-ports').style.display = 'block';
    document.getElementById('hide-ports').style.display = 'none';

    activeMap = activeMap == 'ip' ? 'id' : 'ed';
    clearPortSelection();

    highlighted.mode = null;
    resetSearch();

    await getMapData();
    setScales();
    createEdges();
    updateNodeWeights();
    updateNodeOpacity();
    updateEdgeOpacity();

    await initCharts();

}

function setNodeTooltip(evt) {

    let node = evt.target

    let tooltip = document.getElementById('map-tooltip');
    let tooltipcontent = document.getElementById('tooltip-content')

    let subcategoryString = subcategory != 0 ? subcategorySelect.options[subcategorySelect.selectedIndex].text : '';

    let filter = '';

    if (category == 'c') filter = 'of ' + subcategoryString
    else if (category == 'm') filter = 'by ' + subcategoryString
    else if (category == 'y') filter = 'during ' + subcategoryString

    let level = node.data('type') == 'r' ? 'Region' : (node.data('type') == 's' ? 'State' : (node.data('type') == 'f') ? 'Foreign Zone' : 'Zone');

    let message;

    if (activeMap == 'df') {

        if (highlighted.mode == 'import') {

            let sumTons = 0, sumUSD = 0;
            edgeSet.forEach(edge => {
                if (edge.data.id.substring(0, 1) == 'z' && edge.data.target == parseInt(node.data('id'))) {
                    sumTons += edge.data.tons
                    sumUSD += edge.data.usd
                }
            })
            let usdPerTon = sumUSD / sumTons;
            message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
                        <table>
                            <tr>
                                <th>Tons</th>
                                <th>USD</th>
                                <th>USD per Ton</th>
                            </tr>
                            <tr>
                                <td>${format(sumTons).replace('G', 'B')}</td>
                                <td>$${format(sumUSD).replace('G', 'B')}</td>
                                <td>$${format(usdPerTon).replace('G', 'B')}</td>
                            </tr>
                        </table><br>
                        <span style='font-size: 12px; font-weight: bold;'> Total Imports ${filter}</span>`
        } else if (highlighted.mode == 'export') {

            let sumTons = 0, sumUSD = 0;

            edgeSet.forEach(edge => {

                if (edge.data.id.substring(1, 2) == 'z' && edge.data.source == parseInt(node.data('id'))) {
                    sumTons += edge.data.tons
                    sumUSD += edge.data.usd
                }
            })

            let usdPerTon = sumUSD / sumTons;
            message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
                        <table>
                            <tr>
                                <th>Tons</th>
                                <th>USD</th>
                                <th>USD per Ton</th>
                            </tr>
                            <tr>
                                <td>${format(sumTons).replace('G', 'B')}</td>
                                <td>$${format(sumUSD).replace('G', 'B')}</td>
                                <td>$${format(usdPerTon).replace('G', 'B')}</td>
                            </tr>
                        </table><br>
                        <span style='font-size: 12px; font-weight: bold;'> Total Exports ${filter}</span>`

        } else {
            message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
                        <table>
                            <tr>
                                <th>Tons</th>
                                <th>USD</th>
                                <th>USD per Ton</th>
                            </tr>
                            <tr>
                                <td>${format(node.data('tons')).replace('G', 'B')}</td>
                                <td>$${format(node.data('usd')).replace('G', 'B')}</td>
                                <td>$${format(node.data('usd_per_ton')).replace('G', 'B')}</td>
                            </tr>
                        </table>
                        <span style='font-size: 12px; font-weight: bold;'> Total Freight Movements ${filter} Within </span>`
        }

    } else if (activeMap == 'id') {

        let sumTons = 0, sumUSD = 0;

        let submessage = '';

        if (node.data('type') == 'f') {
            edgeSet.forEach(edge => {
                if (edge.data.id.substring(1, 2) == 'z' && edge.data.source == parseInt(node.data('id'))) {
                    sumTons += edge.data.tons
                    sumUSD += edge.data.usd
                }
            })

            submessage = 'Exports';

        } else {
            edgeSet.forEach(edge => {
                if (edge.data.id.substring(0, 1) == 'f' && edge.data.target == parseInt(node.data('id'))) {
                    sumTons += edge.data.tons
                    sumUSD += edge.data.usd
                }
            })

            submessage = 'Imports';

        }

        let usdPerTon = sumUSD / sumTons;

        message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
                    <table>
                        <tr>
                            <th>Tons</th>
                            <th>USD</th>
                            <th>USD per Ton</th>
                        </tr>
                        <tr>
                            <td>${format(sumTons).replace('G', 'B')}</td>
                            <td>$${format(sumUSD).replace('G', 'B')}</td>
                            <td>$${format(usdPerTon).replace('G', 'B')}</td>
                        </tr>
                    </table>
                    <span style='font-size: 12px; font-weight: bold;'> Total ${submessage} ${filter}</span>`

    } else if (activeMap == 'ed') {

        let sumTons = 0, sumUSD = 0;

        let submessage = '';

        if (node.data('type') == 'f') {
            edgeSet.forEach(edge => {
                if (edge.data.id.substring(1, 2) == 'z' && edge.data.target == parseInt(node.data('id'))) {
                    sumTons += edge.data.tons
                    sumUSD += edge.data.usd
                }
            })

            submessage = 'Imports';

        } else {
            edgeSet.forEach(edge => {
                if (edge.data.id.substring(0, 1) == 'f' && edge.data.source == parseInt(node.data('id'))) {
                    sumTons += edge.data.tons
                    sumUSD += edge.data.usd
                }
            })

            submessage = 'Exports';

        }

        let usdPerTon = sumUSD / sumTons;

        message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
                    <table>
                        <tr>
                            <th>Tons</th>
                            <th>USD</th>
                            <th>USD per Ton</th>
                        </tr>
                        <tr>
                            <td>${format(sumTons).replace('G', 'B')}</td>
                            <td>$${format(sumUSD).replace('G', 'B')}</td>
                            <td>$${format(usdPerTon).replace('G', 'B')}</td>
                        </tr>
                    </table>
                    <span style='font-size: 12px; font-weight: bold;'> Total ${submessage} ${filter}</span>`

    } else if (activeMap == 'ip') {

        let sumTons = 0, sumUSD = 0;

        let submessageOne = '';
        let submessageTwo = '';

        if (portOfEntryDrilled) {

            if (portOfEntryNode == node) {

                sumTons = node.data('tons')
                sumUSD = node.data('usd')

                submessageOne = 'Imports'
                submessageTwo = 'Arriving and Staying here'

            } else if (node.data('type') == 'f') {

                if (node != foreignOriginNode) return;

                sumTons = portOfEntryEdge.data('tons')
                sumUSD = portOfEntryEdge.data('usd')

                submessageOne = 'Exports';
                submessageTwo = 'to ' + portOfEntryNode.data('label')

            } else {

                edge = edgeSet.find(edge => edge.data.target == node.data('id') && edge.data.source == portOfEntryNode.data('id'))

                if (edge != undefined) {
                    sumTons = edge.data.tons
                    sumUSD = edge.data.usd
                } else {
                    sumTons = 0;
                    sumUSD = 0;
                }


                submessageOne = 'Imports';
                submessageTwo = 'Arriving to Here via ' + portOfEntryNode.data('label')

            }

        } else {

            if (node.data('type') == 'f') {
                edgeSet.forEach(edge => {
                    if (edge.data.id.substring(1, 2) == 'z' && edge.data.source == parseInt(node.data('id'))) {
                        sumTons += edge.data.tons
                        sumUSD += edge.data.usd
                    }
                })

                submessageOne = 'Exports';

            } else {
                edgeSet.forEach(edge => {
                    if (edge.data.id.substring(0, 1) == 'f' && edge.data.target == parseInt(node.data('id'))) {
                        sumTons += edge.data.tons
                        sumUSD += edge.data.usd
                    }
                })

                submessageOne = 'Imports';
                submessageTwo = 'Arriving Here'

            }

        }

        let usdPerTon = sumUSD / sumTons;

        message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
                    <table>
                        <tr>
                            <th>Tons</th>
                            <th>USD</th>
                            <th>USD per Ton</th>
                        </tr>
                        <tr>
                            <td>${format(sumTons).replace('G', 'B')}</td>
                            <td>$${format(sumUSD).replace('G', 'B')}</td>
                            <td>$${format(usdPerTon).replace('G', 'B')}</td>
                        </tr>
                    </table>
                    <span style='font-size: 12px; font-weight: bold;'> Total ${submessageOne} ${filter} ${submessageTwo}</span>`

    } else if (activeMap == 'ep') {

        let sumTons = 0, sumUSD = 0;

        let submessageOne = '';
        let submessageTwo = '';

        if (portOfEntryDrilled) {

            if (portOfEntryNode == node) {

                sumTons = node.data('tons')
                sumUSD = node.data('usd')

                submessageOne = 'Exports'
                submessageTwo = 'Departing and Originating from Here'

            } else if (node.data('type') == 'f') {

                if (node != foreignOriginNode) return;

                sumTons = portOfEntryEdge.data('tons')
                sumUSD = portOfEntryEdge.data('usd')

                submessageOne = 'Imports';
                submessageTwo = 'from ' + portOfEntryNode.data('label')

            } else {

                edge = edgeSet.find(edge => edge.data.source == node.data('id') && edge.data.target == portOfEntryNode.data('id'))

                if (edge != undefined) {
                    sumTons = edge.data.tons
                    sumUSD = edge.data.usd
                } else {
                    sumTons = 0;
                    sumUSD = 0;
                }


                submessageOne = 'Exports';
                submessageTwo = 'Departing from Here via ' + portOfEntryNode.data('label')

            }

        } else {

            if (node.data('type') == 'f') {
                edgeSet.forEach(edge => {
                    if (edge.data.id.substring(1, 2) == 'z' && edge.data.target == parseInt(node.data('id'))) {
                        sumTons += edge.data.tons
                        sumUSD += edge.data.usd
                    }
                })

                submessageOne = 'Imports';

            } else {
                edgeSet.forEach(edge => {
                    if (edge.data.id.substring(0, 1) == 'f' && edge.data.source == parseInt(node.data('id'))) {
                        sumTons += edge.data.tons
                        sumUSD += edge.data.usd
                    }
                })

                submessageOne = 'Exports';
                submessageTwo = 'Departing Here'

            }

        }

        let usdPerTon = sumUSD / sumTons;
        if (usdPerTon == NaN) usdPerTon = 0;


        message = `<span style='font-size: 24px; font-weight: bold;'>${node.data('label')} </span><span style='font-size: 20px; font-style: italic;'>(${level})</span><br>
                   <table>
                       <tr>
                           <th>Tons</th>
                           <th>USD</th>
                           <th>USD per Ton</th>
                       </tr>
                       <tr>
                           <td>${format(sumTons).replace('G', 'B')}</td>
                           <td>$${format(sumUSD).replace('G', 'B')}</td>
                           <td>$${format(usdPerTon).replace('G', 'B')}</td>
                       </tr>
                   </table>
                   <span style='font-size: 12px; font-weight: bold;'> Total ${submessageOne} ${filter} ${submessageTwo}</span>`

    }

    tooltip.style.display = 'block';
    tooltip.style.top = (evt.originalEvent.pageY + 25) + 'px';
    tooltip.style.left = (evt.originalEvent.pageX + 25) + 'px';
    tooltipcontent.innerHTML = `<p style='text-align: center;'>` + message + `</p>`

}

function setEdgeTooltip(evt) {

    let edge = evt.target;
    let source = cy.getElementById(evt.target.data('source'))
    let target = cy.getElementById(evt.target.data('target'))
    let tooltip = document.getElementById('map-tooltip');
    let tooltipcontent = document.getElementById('tooltip-content')

    let subcategoryString = subcategory != 0 ? subcategorySelect.options[subcategorySelect.selectedIndex].text : '';

    let filter = '';

    if (category == 'c') filter = 'of ' + subcategoryString
    else if (category == 'm') filter = 'by ' + subcategoryString
    else if (category == 'y') filter = 'during ' + subcategoryString

    let message, header;

    if (portOfEntryDrilled && activeMap == 'ip') {
        header = source.data('label') + " &rarr; " + target.data('label');
        message = `<span style='font-size: 24px; font-weight: bold;'>${header}</span><br>
        
        <table>
            <tr>
                <th>Tons</th>
                <th>USD</th>
                <th>USD per Ton</th>
            </tr>
            <tr>
                <td>${format(edge.data('tons')).replace('G', 'B')}</td>
                <td>$${format(edge.data('usd')).replace('G', 'B')}</td>
                <td>$${format(edge.data('usd_per_ton')).replace('G', 'B')}</td>
            </tr>
        </table>
        <span style='font-size: 12px; font-weight: bold;'> Total Freight Movements ${filter} from ${foreignOriginNode.data('label')}</span>
        `
    } else if (portOfEntryDrilled && activeMap == 'ep') {
        header = source.data('label') + " &rarr; " + target.data('label');
        message = `<span style='font-size: 24px; font-weight: bold;'>${header}</span><br>
        
        <table>
            <tr>
                <th>Tons</th>
                <th>USD</th>
                <th>USD per Ton</th>
            </tr>
            <tr>
                <td>${format(edge.data('tons')).replace('G', 'B')}</td>
                <td>$${format(edge.data('usd')).replace('G', 'B')}</td>
                <td>$${format(edge.data('usd_per_ton')).replace('G', 'B')}</td>
            </tr>
        </table>
        <span style='font-size: 12px; font-weight: bold;'> Total Freight Movements ${filter} to ${foreignOriginNode.data('label')}</span>
        `
    } else {

        header = source.data('label') + " &rarr; " + target.data('label');
        message = `<span style='font-size: 24px; font-weight: bold;'>${header}</span><br>
        
        <table>
            <tr>
                <th>Tons</th>
                <th>USD</th>
                <th>USD per Ton</th>
            </tr>
            <tr>
                <td>${format(edge.data('tons')).replace('G', 'B')}</td>
                <td>$${format(edge.data('usd')).replace('G', 'B')}</td>
                <td>$${format(edge.data('usd_per_ton')).replace('G', 'B')}</td>
            </tr>
        </table>
        <span style='font-size: 12px; font-weight: bold;'> Total Freight Movements ${filter}</span>
        `
    }

    tooltip.style.display = 'block';
    tooltip.style.top = (evt.originalEvent.pageY + 25) + 'px';
    tooltip.style.left = (evt.originalEvent.pageX + 25) + 'px';
    tooltipcontent.innerHTML = `<p style='text-align: center;'>` + message + `</p>`;

}

// Filter nodes from search
async function searchMap() {

    // Selected values
    fromNodeLabel = document.getElementById('from').value;
    toNodeLabel = document.getElementById('to').value;
    // let activeNodeIds, addedNodeIds, edgesToAdd, edgesToHighlight

    // Check which page is active for node loading
    let defaultNodes = 'f';
    if (activeMap == 'df') {
        defaultNodes = 'r';
    }

    // Reset map
    highlighted.mode = null

    cy.nodes().remove();

    if (fromNodeLabel == "All Regions" && toNodeLabel == "All Regions") { // both dropdowns set to All Regions, filter to regions
        
        cy.add(nodeSet.filter(node => (node.data.type == defaultNodes || node.data.type == 'r')));

        activeNodeIds = cy.nodes().map(node => parseInt(node.data('id')));

        createEdges();

        initCharts();

    } else if (fromNodeLabel == "All Regions") { // first dropdown set to All Regions, filter between regions and second node

        nodesToAdd = [];

        toNode = nodeSet.filter(node => (node.data.label == toNodeLabel))[0];
        toNodeType = toNode.data.type;

        if (toNodeType == 'r') {
            nodesToAdd = nodeSet.filter(node => node.data.type == 'r');
        } else if (toNodeType == 's') {
            nodesToAdd = nodeSet.filter(node => (node.data.type == 'r' && node.data.region_id != toNode.data.region_id) 
                || (node.data.type == 's' && node.data.region_id == toNode.data.region_id))
            
        } else {
            nodesToAdd = nodeSet.filter(node => (node.data.type == 'r' && node.data.region_id != toNode.data.region_id) 
                || (node.data.type == 's' && node.data.region_id == toNode.data.region_id && node.data.state_id != toNode.data.state_id)
                || (node.data.type == 'z' && node.data.state_id == toNode.data.state_id))
        }

        if (activeMap != 'df') nodeSet.filter(node => node.data.type == 'f').forEach(node => nodesToAdd.push(node))

        cy.add(nodesToAdd)

        createEdges();

        addedNode = cy.nodes().filter(node => {
                return node.data('id') == toNode.data.id
            });

        highlightNode(addedNode, 'import', !chartsHidden)

    } else if (toNodeLabel == "All Regions") {// second dropdown set to all locations, filter between regions and first node
        
        nodesToAdd = [];

        fromNode = nodeSet.filter(node => (node.data.label == fromNodeLabel))[0];
        fromNodeType = fromNode.data.type;

        if (fromNodeType == 'r') {
            nodesToAdd = nodeSet.filter(node => node.data.type == 'r');
        } else if (fromNodeType == 's') {
            nodesToAdd = nodeSet.filter(node => (node.data.type == 'r' && node.data.region_id != fromNode.data.region_id) 
                || (node.data.type == 's' && node.data.region_id == fromNode.data.region_id))
            
        } else {
            nodesToAdd = nodeSet.filter(node => (node.data.type == 'r' && node.data.region_id != fromNode.data.region_id) 
                || (node.data.type == 's' && node.data.region_id == fromNode.data.region_id && node.data.state_id != fromNode.data.state_id)
                || (node.data.type == 'z' && node.data.state_id == fromNode.data.state_id))
        }

        if (activeMap != 'df') nodeSet.filter(node => node.data.type == 'f').forEach(node => nodesToAdd.push(node))

        cy.add(nodesToAdd)

        createEdges();

        addedNode = cy.nodes().filter(node => {
                return node.data('id') == fromNode.data.id
            });

        highlightNode(addedNode, 'export', !chartsHidden)


    } else {// both dropdowns set to specific location, filter between those two nodes

        cy.add(nodeSet.filter(node => (node.data.type == defaultNodes)));
        fromNode = nodeSet.filter(node => (node.data.label == fromNodeLabel))[0];
        toNode = nodeSet.filter(node => (node.data.label == toNodeLabel))[0];

        // drilldown within map
        // fromNode
        if (activeMap == 'df'){
            if (fromNode.data.type == 'z' || fromNode.data.type == 's'){
                parentNode1 = cy.nodes().filter(node => {return node.data('id') == fromNode.data.region_id});
                nodeDrillDownAddUp(parentNode1[0]);
                if (fromNode.data.type == 'z'){
                    parentNode2 = cy.nodes().filter(node => {return node.data('id') == fromNode.data.state_id});
                    nodeDrillDownAddUp(parentNode2[0]);
                }
            }
        } else {
            if (activeMap == 'ed' || activeMap == 'ep') cy.add(nodeSet.filter(node => (node.data.label == 'USA')));
            if (fromNode.data.type == 'z' || fromNode.data.type == 's' || fromNode.data.type == 'r'){
                parentNode0 = cy.nodes().filter(node => {return node.data('label') == 'USA'});
                nodeDrillDownAddUp(parentNode0[0]);
                if (fromNode.data.type == 'z' || fromNode.data.type == 's'){
                    parentNode1 = cy.nodes().filter(node => {return node.data('id') == fromNode.data.region_id});
                    nodeDrillDownAddUp(parentNode1[0]);
                    if (fromNode.data.type == 'z'){
                        parentNode2 = cy.nodes().filter(node => {return node.data('id') == fromNode.data.state_id});
                        nodeDrillDownAddUp(parentNode2[0]);
                    }
                }
            }
        }
        // toNode
        if (activeMap == 'df'){
            if (toNode.data.type == 'z' || toNode.data.type == 's'){
                parentNode1 = cy.nodes().filter(node => {return node.data('id') == toNode.data.region_id});
                if (parentNode1.length > 0) nodeDrillDownAddUp(parentNode1[0]);
                if (toNode.data.type == 'z'){
                    parentNode2 = cy.nodes().filter(node => {return node.data('id') == toNode.data.state_id});
                    if (parentNode2.length > 0) nodeDrillDownAddUp(parentNode2[0]);
                }
            }
        } else {
            if (activeMap == 'id' || activeMap == 'ip') cy.add(nodeSet.filter(node => (node.data.label == 'USA')));
            if (toNode.data.type == 'z' || toNode.data.type == 's' || toNode.data.type == 'r'){
                parentNode0 = cy.nodes().filter(node => {return node.data('label') == 'USA'});
                if (parentNode0.length > 0) nodeDrillDownAddUp(parentNode0[0]);
                if (toNode.data.type == 'z' || toNode.data.type == 's'){
                    parentNode1 = cy.nodes().filter(node => {return node.data('id') == toNode.data.region_id});
                    if (parentNode1.length > 0) nodeDrillDownAddUp(parentNode1[0]);
                    if (toNode.data.type == 'z'){
                        parentNode2 = cy.nodes().filter(node => {return node.data('id') == toNode.data.state_id});
                        if (parentNode2.length > 0) nodeDrillDownAddUp(parentNode2[0]);
                    }
                }
            }
        }

        addedNodeIds1 = nodeSet.filter(node => (node.data.label == fromNodeLabel)).map(node => parseInt(node.data.id));
        
        addedNodeIds2 = nodeSet.filter(node => (node.data.label == toNodeLabel)).map(node => parseInt(node.data.id));

        // load all edges
        createEdges();

        // select the edge to be highlighted
        edgesToHighlight = cy.edges().filter(edge => {
            let source = parseInt(edge.data('source'))
            let target = parseInt(edge.data('target'))
            return (addedNodeIds1.includes(source) && addedNodeIds2.includes(target))
        })
        
        // highlight based on type of edge
        if (edgesToHighlight.length === 0){
            alert('No relevant edge found!\nTry resetting the Commodity/Mode/Year Filter, resetting the edge filters, or comparing other locations.')
            resetSearch();
        } else {
            edgesToHighlight.forEach(edge => {
                edgeBreakdownDF(edge);
            });
        }

        
    }

}

function resetSearch(){
    document.getElementById('from').value = "All Regions";
    document.getElementById('to').value = "All Regions";
}

function parseCliqueEdges(data) {
    edgeSet = [];

    data.forEach(record => {
        let obj = {
            "category": record.entity_type,
            "fzone": null,
            "id": record.node_type.concat(record.id).concat(record.entity_type),
            "map": "df",
            "source": record.source,
            "subcategory": record.entity_code,
            "target": record.target,
            "tons": record.metric_type == ('tons')? record.tons: null,
            "usd":  record.metric_type=='usd'? record.usd: null,
            "usd_per_ton" : null,
            "clique_density": record.edge_count}
        let obj2 = {
            "data": obj
        }
        edgeSet.push(obj2);
    
    })

}

async function forceCliqueDrillDown(request){
    cy.nodes().remove();

    let node_level = edgeSet[0].data.id.startsWith('ss')? 's':'z';
    let tmpactiveNodes;
    tmpactiveNodes = new Set();
    edgeSet.forEach(edge => {
        tmpactiveNodes.add(parseInt(edge.data.source));
        tmpactiveNodes.add(parseInt(edge.data.target));
        });
    if(activeMap == 'df') cy.add(nodeSet.filter(node => {
        let node_id = parseInt(node.data.id);

        return tmpactiveNodes.has(node_id) && node.data.type == node_level}))
}

async function get_clique_edges(request) {
    await fetch('/clique_edges', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(response => {
        return response.json();
    }).then(edgeData => {
        parseCliqueEdges(edgeData);
    }).catch(error => {
        console.error('Error: ', error);
    })
}