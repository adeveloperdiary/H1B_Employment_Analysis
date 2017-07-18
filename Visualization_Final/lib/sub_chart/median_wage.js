/**
 * Created by abhisekjana on 7/12/17.
 */

var INFOSYS_MEDIAN=[67101,67620.8,66747,63918,67808,69971];
var TCS_MEDIAN=[58490,59363,60798,61318,61984,63461];
var WIPRO_MEDIAN=[68682,65770,66685,68078,68245,69867];
var IBM_MEDIAN=[65042,65270,69618,69056,70179,69908.5];
var ACCENTURE_MEDIAN=[68848,67101,68099,71323,71386,74006];

var MICROSOFT_MEDIAN=[82701,84302,86278,87547,97219,101088];
var GOOGLE_MEDIAN=[91395,97718,100984,98675,99423,103145];
var AMAZON_MEDIAN=[82701,84302,86278,87547,88275,91166];
var ORACLE_MEDIAN=[82800,89939,94828,97229,98904,102065.5];
var APPLE_MEDIAN=[103709,103709,109138,111634,115253,120349];


var out_array=[INFOSYS_MEDIAN,TCS_MEDIAN,WIPRO_MEDIAN,IBM_MEDIAN,ACCENTURE_MEDIAN];
var soft_array=[MICROSOFT_MEDIAN,GOOGLE_MEDIAN,AMAZON_MEDIAN,ORACLE_MEDIAN,APPLE_MEDIAN];


function convertDatatoObject(y_data){
    
    var x_data=[2011,2012,2013,2014,2015,2016];
    var data=[];
    
    for(var i=0;i<6;++i){
        
        var d={
            "median":y_data[i],
            "year":x_data[i]
        };
        
        data[i]=d;
    }
    return data;
    
}

function showMedianTrend(y_data,name,color){
        
    var data=convertDatatoObject(y_data);
    
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
// The number of datapoints
    
    var div_width=$("#div_sub").width();
    
    var svg = d3.select("#svg_sub");
    svg.attr("width",div_width);
    svg.selectAll("g").remove();
    
    var margin = {top: 20, right: 20, bottom: 50, left: 70},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var xScale = d3.scaleBand()
        .domain( data.map(function(d) { console.log(d); return d.year } ) )
        .rangeRound([0, width])
        .padding(0.7, 0.3);
    
    var min=55000;
    var max=125000;
    /*if(Math.min.apply(null,y_data)<70000){
        min=55000;
        max=75000;
    }else{
        min=80000;
        max=125000;
    }*/
    
// 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([min,max]) // input
        .range([height, 0]); // output

    //console.log(yScale(66747));
    
// 7. d3's line generator
    var line = d3.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.median); });
    
    
// 3. Call the x axis in a group tag
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width/2-50+25)
        .attr("y", 30)
        .attr("dy", "0.32em")
        .attr("fill","#535353")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text("Year");

// 4. Call the y axis in a group tag
    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(5))
        .append("text")
        .attr("x", -100)
        .attr("y", -55)
        .attr("dy", "0.32em")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .attr("fill","#535353")
        .text("Wage($)"); // Create an axis component with d3.axisLeft
    
    g.append("g")
        .attr("class", "grid")
        .style("opacity",1.0)
        .call(d3.axisLeft(yScale)
            .ticks(5)
            .tickSize(-width)
            .tickFormat("")
        );
    

// 9. Append the path, bind the data, and call the line generator
    var path=g.append("path")
        .data([data]) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .style("stroke",color)
        .style("stroke-width","2px")
        .attr("d", line);

// 12. Appends a circle for each datapoint
    g.selectAll(".dot")
        .data(data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.year) })
        .attr("cy", function(d) { return yScale(d.median) })
        .attr("r", 5)
        .style("fill",color)
        .style("stroke","white")
        .style("stroke-width","3px")
        .on("mouseover", function(d,i) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<span style='font-weight: 400;line-height: 14px'><span style='font-size: 13px;line-height: 20px'>"+ accounting.formatMoney(d.median,'$',0) +"</span><BR/></span>")
                .style("left", (d3.event.pageX) - 30 + "px")
                .style("top", (d3.event.pageY)-40 + "px")
                .style("background",color);
            $(this).attr("cursor","pointer");
        })
        .on("mouseout", function(d,i) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            
        });
    
    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill","#535353")
        .text(name);
}
