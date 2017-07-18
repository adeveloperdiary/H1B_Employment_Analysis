/**
 * Created by abhisekjana on 7/12/17.
 */

var data_wage = [];

var names=['sse','sc','pm','tl','se','sd','c','pt','csa','sa','ba','ta','cp','pa','ap'];

var names_full=['Sr SOFTWARE ENGINEER','Sr CONSULTANT','PROJECT MANAGER','TECHNOLOGY LEAD','SOFTWARE ENGINEER','SOFTWARE DEVELOPER','CONSULTANT','PHYSICAL THERAPIST','COMPUTER SYSTEMS ANALYST','SYSTEMS ANALYST','BUSINESS ANALYST','TECHNOLOGY ANALYST','COMPUTER PROGRAMMER','PROGRAMMER ANALYST','ASSISTANT PROFESSOR'];


function loadWageData(){
    
    names.forEach(function(name,i){
    
        data_wage[i] = [];
        data_wage[i][0] = names_full[i];
    
        d3.csv("data/wage/wage_"+name+".csv", function(error, data) {
            data_wage[i][1] = $.map(data, function(value, index) {
                return Math.floor(value.wage);
            });
            
        });
        
        
    });
    
    /*d3.csv("data/wage/wage_pa.csv", function(error, data) {
        pa = $.map(data, function(value, index) {
            return Math.floor(value.wage);
        });
        if (!--remaining_wage) buildWageArray();
    });
    
    d3.csv("data/wage_se.csv", function(error, data) {
        se = $.map(data, function(value, index) {
            return Math.floor(value.wage);
        });
        if (!--remaining_wage) buildWageArray();
    });
    
    d3.csv("data/wage_cp.csv", function(error, data) {
        cp = $.map(data, function(value, index) {
            return Math.floor(value.wage);
        });
        if (!--remaining_wage) buildWageArray();
    });
    
    d3.csv("data/wage_sa.csv", function(error, data) {
        sa = $.map(data, function(value, index) {
            return Math.floor(value.wage);
        });
        if (!--remaining_wage) buildWageArray();
    });
    
    d3.csv("data/wage_sd.csv", function(error, data) {
        sd = $.map(data, function(value, index) {
            return Math.floor(value.wage);
        });
        if (!--remaining_wage) buildWageArray();
    });
    
    d3.csv("data/wage_ba.csv", function(error, data) {
        ba = $.map(data, function(value, index) {
            return Math.floor(value.wage);
        });
        if (!--remaining_wage) buildWageArray();
    });*/

}


function drawWageBoxPlot() {
    var class_name='box_m';
    var data=data_wage;
    
    var div_width=$("#div_main").width();
    
    var margin = {top: 20, right: 20, bottom: 200, left: 60};
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
    
    min=20000;
    max=170000;
    
    var chart = d3.box()
        .whiskers(iqr(1.5))
        .height(height)
        .domain([min, max])
        .showLabels(true)
        .className(class_name)
        .modified(true)
        .color('#7A6FCA')
        ;
    
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
        .attr("x", -230)
        .attr("y",-40)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .text("Wage Distribution($)");
    
    // draw x axis
    
    g.append("text")
        .attr("x", width/2-50)
        .attr("y", 510)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text("Job Title");
    
    var x_axis=g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height+40) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-50)");
    
    
    
    g.append("g")
        .attr("class", "grid")
        .style("opacity",0.2)
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat("")
        );
    
    
    // draw the boxplots
    g.selectAll("."+class_name)
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
        .call(chart.width(x.bandwidth()));
}
