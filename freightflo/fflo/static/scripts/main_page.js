const tabColor = '#ff7621'
const tabSelectedColor = '#9e4915';

var pageOpen = 'home';

var expanded = false;

async function openPage(pageName, elmnt) {

    if (pageOpen == pageName) return;

    let subpages, tabs;

    subpages = document.getElementsByClassName("subpage");
    for (let i = 0; i < subpages.length; i++) {
        subpages[i].style.display = "none";
    }

    tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.backgroundColor = tabColor;
    }

    if (pageName != 'home' && pageName != 'references') document.getElementById('freight').style.display = "block";
    else document.getElementById(pageName).style.display = "block";

    switch (pageName) {
        case 'domestic':
            activeMap = 'df';
            document.getElementById('show-ports').style.display = 'none';
            document.getElementById('hide-ports').style.display = 'none';
            document.getElementById('show-cliques').style.display = 'block';
            document.getElementById('hide-cliques').style.display = 'none';
            clearPortSelection();
            highlighted.mode = null;     
            await renderDFMap();
            initCharts();
            break;
        case 'fimport':
            disableCliqueMode();
            activeMap = 'id';
            document.getElementById('show-ports').style.display = 'block';
            document.getElementById('hide-ports').style.display = 'none';
            document.getElementById('show-cliques').style.display = 'none';
            document.getElementById('hide-cliques').style.display = 'none';
            clearPortSelection();
            highlighted.mode = null;
            renderFIMap();
            initCharts();
            break;
        case 'fexport':
            disableCliqueMode();
            activeMap = 'ed';
            document.getElementById('show-ports').style.display = 'block';
            document.getElementById('hide-ports').style.display = 'none';
            document.getElementById('show-cliques').style.display = 'none';
            document.getElementById('hide-cliques').style.display = 'none';
            clearPortSelection();
            highlighted.mode = null;
            renderFEMap();
            initCharts();
            break;
    }

    elmnt.style.backgroundColor = tabSelectedColor;

    pageOpen = pageName;

}


function showCharts() {
    document.getElementById('charts').style.display = 'block';
    document.getElementById('show-charts').style.display = 'none';
    document.getElementById('hide-charts').style.display = 'block';
    cy.resize()
    chartsHidden = false;
}

function hideCharts() {
    document.getElementById('charts').style.display = 'none';
    document.getElementById('show-charts').style.display = 'block';
    document.getElementById('hide-charts').style.display = 'none';
    cy.resize()
    chartsHidden = true;
}

function disableCliqueMode(){
    cliqueMode = false;
    const filtersToKeepActive = ['subcategory-select', 'edge-weight-select', 'show-states', 'show-zones', 'hide-cliques'];
    document.getElementById('top-k-toggle').disabled = false;
    document.getElementById('top-k').disabled = false;
    document.getElementById('bottom-k').disabled = false;
    document.getElementById('from').disabled = false;
    document.getElementById('to').disabled = false;
    const allFilterElements = document.querySelectorAll('.filter-select, .filter-select button');
    allFilterElements.forEach(filter => {
        if (!filtersToKeepActive.includes(filter.id)) {
            filter.disabled = false;
        }
    });
    //document.getElementById('clique-mode').classList.toggle('active');
    document.getElementById('edge-weight-select').innerHTML = `<option value="tons" selected>Tons</option>
        <option value="usd">USD</option>
        <option value="usd_per_ton">USD per Ton</option>`
    }

async function toggleCliqueMode(disable){

    if (!disable) {
        document.getElementById('show-cliques').style.display = 'block';
        document.getElementById('hide-cliques').style.display = 'none';
        cliqueMode = false;
        document.getElementById('edge-weight-select').innerHTML = `<option value="tons" selected>Tons</option>
        <option value="usd">USD</option>
        <option value="usd_per_ton">USD per Ton</option>`
    } else {
        document.getElementById('show-cliques').style.display = 'none';
        document.getElementById('hide-cliques').style.display = 'block';
        cliqueMode = true;
        document.getElementById('edge-weight-select').innerHTML = `<option value="tons" selected>Tons</option>
        <option value="usd">USD</option>`
        document.getElementById('subcategory-select').value = document.getElementById('subcategory-select').value === 'a' ? 'c8': document.getElementById('subcategory-select').value;
    }

    const shouldDisable = disable
    let subCat = document.getElementById('subcategory-select').value === 'a' ? 'c8': document.getElementById('subcategory-select').value;
    let metric = document.getElementById('edge-weight-select').value;
    let node_type = document.getElementById('show-states').checked? 'ss': document.getElementById('show-zones').checked? 'zz':'ss';
    const filtersToKeepActive = ['subcategory-select', 'edge-weight-select', 'show-states', 'show-zones', 'hide-cliques'];

    let request = {
    'category': subCat,
    'metric': metric,
    'node_type': node_type
    }

    document.getElementById('top-k-toggle').disabled = shouldDisable;
    document.getElementById('top-k').disabled = shouldDisable;
    document.getElementById('bottom-k').disabled = shouldDisable;
    document.getElementById('from').disabled = shouldDisable;
    document.getElementById('to').disabled = shouldDisable;

    const allFilterElements = document.querySelectorAll('.filter-select, .filter-select button');
    allFilterElements.forEach(filter => {
        if (filtersToKeepActive.includes(filter.id)) {
            filter.disabled = false;
        } else {
            filter.disabled = shouldDisable;
        }
    });

    if(!shouldDisable){
        dataType = 'df';
        activeMap = 'df';
        document.getElementById('show-ports').style.display = 'none';
        document.getElementById('hide-ports').style.display = 'none';
        clearPortSelection();
        highlighted.mode = null;     
        await renderDFMap();
        initCharts();
    }
    else{
        dataType = 'df';
        activeMap = 'df';
        document.getElementById('show-ports').style.display = 'none';
        document.getElementById('hide-ports').style.display = 'none';
        clearPortSelection();
        highlighted.mode = null;
        await renderDFCliqueMap(request);
    }

}
