/**
 * Created by abhisekjana on 7/12/17.
 */

var infosys, tcs, wipro,ibm,acc, msft, google, amazon, oracle, apple, remaining_box = 10;
var data_out = [];
var data_soft = [];

function buildArray(){
    
    data_out[0] = [];
    data_out[1] = [];
    data_out[2] = [];
    data_out[3] = [];
    data_out[4] = [];
    
    
    data_out[0][0] = "INFOSYS";
    data_out[1][0] = "TCS";
    data_out[2][0] = "WIPRO";
    data_out[3][0] = "IBM";
    data_out[4][0] = "ACCENTURE";
    
    
    data_out[0][1] = [];
    data_out[1][1] = [];
    data_out[2][1] = [];
    data_out[3][1] = [];
    data_out[4][1] = [];
    
    
    data_out[0][1] = infosys;
    data_out[1][1] = tcs;
    data_out[2][1] = wipro;
    data_out[3][1] = ibm;
    data_out[4][1] = acc;
    
    
    data_soft[0] = [];
    data_soft[1] = [];
    data_soft[2] = [];
    data_soft[3] = [];
    data_soft[4] = [];
    
    data_soft[0][0] = "MICROSOFT";
    data_soft[1][0] = "GOOGLE";
    data_soft[2][0] = "AMAZON";
    data_soft[3][0] = "ORACLE";
    data_soft[4][0] = "APPLE";
    
    data_soft[0][1] = [];
    data_soft[1][1] = [];
    data_soft[2][1] = [];
    data_soft[3][1] = [];
    data_soft[4][1] = [];
    
    data_soft[0][1] = msft;
    data_soft[1][1] = google;
    data_soft[2][1] = amazon;
    data_soft[3][1] = oracle;
    data_soft[4][1] = apple;
    
}


function loadBoxPlotData(){
    d3.csv("data/wage_infosys.csv", function(error, data) {
        infosys = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_tcs.csv", function(error, data) {
        tcs = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_wipro.csv", function(error, data) {
        wipro = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
        
    });
    
    d3.csv("data/wage_ibm.csv", function(error, data) {
        ibm = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_acc.csv", function(error, data) {
        acc = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_msft_2016.csv", function(error, data) {
        msft = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_google_2016.csv", function(error, data) {
        google = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_amazon_2016.csv", function(error, data) {
        amazon = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_oracle_2016.csv", function(error, data) {
        oracle = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
    
    d3.csv("data/wage_apple_2016.csv", function(error, data) {
        apple = $.map(data, function(value, index) {
            return Math.floor(value.Wage);
        });
        if (!--remaining_box) buildArray();
    });
}


function drawBoxPlot(data,color,class_name,median,compare,compare_color) {
    
    var labels = true; // show the text labels beside individual boxplots?
    
    var div_width=$("#div_main").width();
    
    var margin = {top: 20, right: 20, bottom: 90, left: 60};
    var width = div_width - margin.left - margin.right;
    var height = 540 - margin.top - margin.bottom;
    
    var min = Infinity,
        max = -Infinity;
    
    /*var max_arr=[];
    var min_arr=[];
    
    for(var i=0;i < 5 ; ++i){
        
        max_arr.push(Math.max.apply(null, data[i][1]));
        min_arr.push(Math.min.apply(null, data[i][1]));
    }
    
    max=Math.max.apply(null,max_arr);
    min=Math.min.apply(null,min_arr);*/
    
    min=18000;
    max=165000;
    
    var chart = d3.box()
        .whiskers(iqr(1.5))
        .height(height)
        .domain([min, max])
        .showLabels(labels)
        .color(color)
        .className(class_name);
  
    var svg = d3.select("#svg_main");
    svg.selectAll("g").remove();
    svg.selectAll("defs").remove();
    
    var g=svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", class_name)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // the x-axis
    var x = d3.scaleBand()
        .domain( data.map(function(d) { console.log(d); return d[0] } ) )
        .rangeRound([0, width])
        .padding(0.7, 0.3);
        //.rangeRoundBands([0 , width], 0.7, 0.3);
    
    /*var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");*/
    
    // the y-axis
    var y = d3.scaleLinear()
        .domain([min, max])
        .range([height + margin.top, 0 + margin.top]);
 
    // add a title
    /*g.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 + (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        //.style("text-decoration", "underline")
        .text("Revenue 2012");*/
    
    
    var defs = svg.append("defs");
    var filter = defs.append("filter")
        .attr("id", "textBackground")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 1)
        .attr("height", 1);
    filter
        .append("feFlood")
        .attr("flood-color", color)
        .attr("result","txtBackground");
    
    var filterMerge = filter.append("feMerge");
    filterMerge.append("feMergeNode")
        .attr("in", "txtBackground");
    filterMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
    
    
    
    // draw y axis
    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null,'s'))
        .append("text")
        .attr("x", -300)
        .attr("y",-40)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .text("Wage Distribution($)");
 
    // draw x axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height+40) + ")")
        .call(d3.axisBottom(x))
        /*.selectAll("text")
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform", "rotate(-10)")*/
        .append("text")
        .attr("x", width/2-50)
        .attr("y", 35)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text("Company Name");
 
    g.append("g")
        .attr("class", "grid")
        .style("opacity",0.2)
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat("")
        );
    
    var annotation=g.append("g").attr('class','annotation');
    
    if(compare!=null && compare >0){
        annotation.append("line")
            .attr('class',"median_compare")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(compare))
            .attr("y2", y(compare))
            .style("stroke", d3.rgb(compare_color).brighter(1).toString())
            .style("stroke-width", "2px")
            .style("stroke-dasharray", "5.5")
            .attr("opacity",.5);
    
        annotation.append("text")
            .attr('class',"median_text_old")
            .attr("x", width-70)
            .text("( Outsourcing")
            .attr("y", y(compare)+25)
            .attr("opacity",.8);
        
        annotation.append("text")
            .attr('class',"median_text_old")
            .attr("x", width-70)
            .text("Company )")
            .attr("y", y(compare)+40)
            .attr("opacity",.8);
        
        annotation.append("text")
            .attr('class',"median_text_old")
            .attr("x", width-70)
            .text("Median Salary")
            .attr("y", y(compare)-5)
            .attr("opacity",.8);
    
        annotation.append("text")
            .attr('class',"median_text_old")
            .attr("x", width-45)
            .style("font-weight",'bold')
            .text(accounting.formatMoney(compare,'$',0))
            .attr("y", y(compare)+13)
            .attr("opacity",.8);
    }
    
    annotation.append("line")
        .attr('class',"median_l")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(11000))
        .attr("y2", y(11000))
        .style("stroke", d3.rgb(color).brighter(1).toString())
        .style("stroke-width", "2px")
        .style("stroke-dasharray", "5.5")
        .attr("opacity",0)
        .transition()
        .ease(d3.easeQuad)
        .delay(1000)
        .duration(1000)
        .attr("y1", y(median))
        .attr("y2", y(median))
        .attr("opacity",.8);
    
    annotation.append("text")
        .attr('class',"median_text")
        .attr("x", width-70)
        .attr("y", y(11000))
        .text("Median Salary")
        .attr("opacity",0)
        .transition()
        .ease(d3.easeQuad)
        .delay(1000)
        .duration(1000)
        .attr("y", y(median)-5)
        .attr("opacity",.8);
    
    annotation.append("text")
        .attr('class',"median_text")
        .attr("x", width-45)
        .attr("y", y(11000))
        .style("font-weight",'bold')
        .text(accounting.formatMoney(median,'$',0))
        .attr("opacity",0)
        .transition()
        .ease(d3.easeQuad)
        .delay(1000)
        .duration(1000)
        .attr("y", y(median)+13)
        .attr("opacity",.8);
    
    // draw the boxplots
    g.selectAll("."+class_name)
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
        .call(chart.width(x.bandwidth()));
}

function iqr(k) {
    return function(d, i) {
        var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
    };
}