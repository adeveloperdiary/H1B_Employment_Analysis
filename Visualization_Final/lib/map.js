/**
 * Created by abhisekjana on 7/13/17.
 */

function drawMap(){
    
    var div_width=$("#div_main").width();
    
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    
    var svg = d3.select("#svg_main");
    svg.attr("width",div_width);
    
    $("#svg_main").attr('class','');
    
    svg.selectAll("g").remove();
    
    var margin = {top: 20, right: 20, bottom: 50, left: 60},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
    //Define map projection
    var projection = d3.geoAlbersUsa()
        .translate([width/2, height/2])
        .scale([1000]);
    
    //Define path generator
    var path = d3.geoPath()
        .projection(projection);
    
   //var color = d3.scaleSequential(d3["interpolateGreens"]);
    var color = d3.scaleSequential(d3["interpolateYlGnBu"]);
    
    /*var color = d3.scaleQuantize()
        .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
    //Colors taken from colorbrewer.js, included in the D3 download*/
    
    //Load in agriculture data
    d3.csv("data/state_data.csv", function(data) {
        
        //Set input domain for color scale
        color.domain([
            d3.min(data, function(d) { return d.value; }),
            d3.max(data, function(d) { return d.value; })
        ]);
        
        //Load in GeoJSON data
        d3.json("data/us-states.json", function(json) {
            
            //Merge the ag. data and GeoJSON
            //Loop through once for each ag. data value
            for (var i = 0; i < data.length; i++) {
                
                var dataState = data[i].state;				//Grab state name
                var dataValue = parseFloat(data[i].value);	//Grab data value, and convert from string to float
                
                //Find the corresponding state inside the GeoJSON
                for (var j = 0; j < json.features.length; j++) {
                    
                    var jsonState = json.features[j].properties.name;
                    
                    if (dataState == jsonState) {
                        
                        //Copy the data value into the JSON
                        json.features[j].properties.value = dataValue;
                        
                        //Stop looking through the JSON
                        break;
                        
                    }
                }
            }
            
            //Bind data and create one path per GeoJSON feature
            g.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke","#103a6e")
                .style("stroke-width","1px")
                .style("stroke-opacity",".3")
                .style("fill", "white")
                .on("mouseover", function(d,i) {
    
                    //$(this).attr("opacity",.5);
                    
                    $(this).attr("cursor","pointer");
    
                    //d3.select(this).style("fill","green");
    
    
                    var col=d3.select(this).style("fill");
                    col=d3.rgb(col).darker(.5).toString();
    
                    d3.select(this).style("fill",col);
                    
                    var val=accounting.formatNumber(((Math.pow(10,d.properties.value-1)-1)*98501.71629)+57668.69231);
                    
                    
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("<span style='font-weight: 400;line-height: 14px'><span style='font-size: 13px;line-height: 20px'>"+ d.properties.name.toUpperCase() +"</span><BR/><HR style='margin-top: 0;margin-bottom: 3px;border-top: dashed 1px;opacity: .5'/>Applications : "+val+"</span>")
                        .style("left", (d3.event.pageX+25) + "px")
                        .style("top", (d3.event.pageY-25) + "px")
                        .style("background",'#002134');
                })
                .on("mouseout", function(d,i) {
        
                    $(this).attr("opacity",1);
    
                    var col=d3.select(this).style("fill");
                    col=d3.rgb(col).brighter(.5).toString();
    
                    d3.select(this).style("fill",col);
                    
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .transition()
                .ease(d3.easeQuad)
                .duration(500)
                .style("fill", function(d) {
                    //Get data value
                    var value = d.properties.value;
                    
                    if (value) {
                        //If value exists…
                        return color(value);
                    } else {
                        //If value is undefined…
                        return "#ccc";
                    }
                })
                
                
            ;
            
            //Load in cities data
            d3.csv("data/us_city.csv", function(data) {
                
                var circle=g.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle");
                    
                circle.attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1];
                    })
                    .style("fill", "#ff1d34")
                    .style("opacity", 0.3)
                    .attr("r", 0)
                    .on("mouseover", function(d,i) {
                        
                        $(this).attr("cursor","pointer");
    
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<span style='font-weight: 400;line-height: 14px'><span style='font-size: 13px;line-height: 20px'>"+ d.place +"</span><BR/><HR style='margin-top: 0;margin-bottom: 3px;border-top: dashed 1px;opacity: .5'/>Applications : "+accounting.formatNumber(d.application)+"</span>")
                            .style("left", (d3.event.pageX+25) + "px")
                            .style("top", (d3.event.pageY-25) + "px")
                            .style("background",'#002134');
                        
                        
                    })
                    .on("mouseout", function(d,i) {
                        $(this).attr("opacity",1);
                        
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .transition()
                    .ease(d3.easeQuad)
                    .duration(1000)
                    .attr("r", function(d) {
                        return Math.sqrt(parseInt(d.application) * 0.01);
                    });
                    
                
            });
            
            
        });
        
    });
    
    var i=10;
    var legend = g.selectAll(".legend")
        .data(color.ticks(100).slice(1))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (150 + i * 3) + "," + (height+10) + ")"; });
    
    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", color);
    
    var legendText = g.selectAll(".legendText")
        .data(color.ticks(3).slice(1))
        .enter().append("g")
        .attr("class", "legendText")
        .attr("transform", function(d, i) { return "translate(" + (150) + "," + (height+10) + ")"; });
    
    legendText.append("text")
        .attr("x", width/2-50)
        .attr("y", 35)
        .style("fill","black")
        .text("260K");
    
    legendText.append("text")
        .attr("x", width/2-335)
        .attr("y", 35)
        .style("fill","black")
        .text("1K");
    
    legendText.append("text")
        .attr("x", width/2-190)
        .attr("y", 35)
        .style("fill","black")
        .text("60K")
        
        
    
    
}