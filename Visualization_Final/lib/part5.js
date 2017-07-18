/**
 * Created by abhisekjana on 7/13/17.
 */

var jobData;

function loadJobData(){
    d3.csv("data/job_type_all.csv",function(error,data){
        jobData=data;
    });
}

function drawJobTitle(){
    
    var data=jobData;
    
    var div_width=$("#div_main").width();
    
    //High Applicant Employers
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    var svg = d3.select("#svg_main");
    svg.attr("width",div_width);
    
    $("#svg_main").attr('class','');
    
    svg.selectAll("g").remove();
    
    var margin = {top: 20, right: 20, bottom: 50, left: 200},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.2);
    
    var x = d3.scaleLinear()
        .range([0, width]);
    
    data.forEach(function(d) {
        d.count = +d.count;
    });
    
    x.domain([0, d3.max(data, function(d){ return d.count; })]);
    y.domain(data.map(function(d) { return d.title; }));
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);
    
    g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines(x)
            .tickSize(-height)
            .tickFormat("")
        );
    
    // append the rectangles for the bar chart
    var bar=g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar");
   
    
    
        //.attr("x", function(d) { return x(d.sales); })
    bar.attr("width",0)
        .attr("y", function(d) { return y(d.title); })
        .attr("x", 5)
        .attr("height", y.bandwidth())
        .style("fill","#e6a2c1")
        .style("opacity",.7)
        .style("stroke-width",2)
        .style("stroke","#c8668c")
        .style("stroke-opacity",1.0)
        .on("mouseover", function(d,i) {
        
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<span style='font-weight: 400;line-height: 14px'><span style='font-size: 13px;line-height: 20px'>"+ d.title +"</span><BR/><HR style='margin-top: 0;margin-bottom: 3px;border-top: dashed 1px;opacity: .5'/>Applications : "+accounting.formatNumber(d.count)+"</span>")
                .style("left", (d3.event.pageX+25) + "px")
                .style("top", (d3.event.pageY-25) + "px")
                .style("background",'#b14d77');
    
            d3.select(this).style("fill","#e677b0");
            
            $(this).attr("cursor","pointer");
        })
        .on("mouseout", function(d,i) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
    
            d3.select(this).style("fill","#e6a2c1");
            //$(this).attr("opacity",1);
        })
        .transition()
        .ease(d3.easeQuad)
        .duration(1000)
        .attr("width", function(d) {return x(d.count); } )
        ;
    
    // add the x Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10))
        .append("text")
        .attr("x", width/2-100)
        .attr("y", 35)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text("Number of H1B Applications");
    
    // add the y Axis
    g.append("g")
        .call(d3.axisLeft(y))
        .attr("opacity",1.0)
        .append("text")
        .attr("x", -200)
        .attr("y",-190)
        .attr("dy", "1em")
        .attr("dx", "1em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .text("Job Title");
    
}

function make_x_gridlines(x) {
    return d3.axisBottom(x)
        .ticks(10)
}