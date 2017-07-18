var out, soft, remaining=2;
var color=["#53D5AD", "#58BFE6", "#7a6fca", "#ca6f96", "#e58c72", "#e5c072"];
function loadCompanyData() {
    d3.csv("data/out.csv", function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i)
            d[columns[i]] = +d[columns[i]];
        return d;
    },function(error,data){
        out=data;
        drawAppTrend(data);
    });
    
    d3.csv("data/soft.csv", function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i)
            d[columns[i]] = +d[columns[i]];
        return d;
    },function(error,data){
        soft=data;
    });
}

function drawAppTrend(data){
    
    var div_width=$("#div_main").width();
    
    //High Applicant Employers
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
    
    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);
    
    var x1 = d3.scaleBand()
        .padding(0.05);
    
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    
    var z = d3.scaleOrdinal()
        .range(["#53D5AD", "#58BFE6", "#7a6fca", "#ca6f96", "#e58c72", "#e5c072"]);
    
    var keys = data.columns.slice(1);
    
    
    x0.domain(data.map(function (d) {
        return d.Company;
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function (d) {
        return d3.max(keys, function (key) {
            return d[key];
        });
    })]).nice();
    
    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat("")
        );
    
    var rect=g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d) {
            return "translate(" + x0(d.Company) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
            return keys.map(function (key) {
                return {key: key, value: d[key],name:d.Company};
            });
        })
        .enter().append("rect");
        
    rect.attr("x", function (d) {
            return x1(d.key);
        })
        .attr("width", x1.bandwidth())
        .attr("fill", function (d) {
            return z(d.key);
        }).on("mouseover", function(d,i) {
            
            
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<span style='font-weight: 400;line-height: 14px'><span style='font-size: 13px;line-height: 20px'>"+ d.name +"</span><BR/><HR style='margin-top: 0;margin-bottom: 3px;border-top: dashed 1px;opacity: .5'/>Year : "+d.key+"<BR/>Applications : "+d.value+"</span>")
                .style("left", (d3.event.pageX+25) + "px")
                .style("top", (d3.event.pageY-25) + "px")
                .style("background",'#002134');
            
            
            $(this).attr("fill",d3.rgb(color[i]).darker(1).toString());
            $(this).attr("cursor","pointer");
        })
        .on("mouseout", function(d,i) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            $(this).attr("fill",color[i]);
            $(this).attr("opacity",1);
        })
        .attr("y", height)
        .attr("height", 0);
    
    rect.transition()
        .ease(d3.easeQuad)
        .duration(1000)
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        });
    
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
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
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null,'s'))
        .append("text")
        .attr("x", -300)
        .attr("y", y(y.ticks().pop()) - 40)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .text("Number of H1B Applications");
    
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });
    
    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);
    
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });
    
};