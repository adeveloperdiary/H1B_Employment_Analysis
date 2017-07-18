var color=["#53D5AD", "#58BFE6", "#7a6fca", "#ca6f96", "#e58c72", "#e5c072"];

var infosys, tcs, wipro,ibm,acc, msft, google, amazon, oracle, apple, remaining = 10;



$( document ).ready(function(){
    
    
    
    
    
    
    //var scale=true;
    //drawSoftEmployer(scale,$("#div2").width());
    
    //drawOutEmployer($("#div1").width());
    
    $("#toggleScale").click(function(){
        scale=!scale;
        drawSoftEmployer(scale,$("#div2").width());
    });
    
    
    $( window ).resize(function() {
        drawSoftEmployer(scale,$("#div2").width());
        drawOutEmployer($("#div1").width());
        drawBoxPlot();
    });
    
    //drawBoxPlots();
    
});


function drawOutEmployer(div_width){
    
    //High Applicant Employers
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    d3.csv("data/out.csv", function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
    }, function(error, data) {
        if (error) throw error;
    
        var svg = d3.select("#haoe");
        svg.attr("width",div_width);
    
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
    
       var t=d3.transition().duration(1000);
        
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
            .attr("x", -200)
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
    
        g.append("g")
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
            .enter().append("rect")
            
            
            .attr("height",0)
            .transition()
            .duration(4000)
            .delay(1000)
            .attr("x", function (d) {
                return x1(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("width", x1.bandwidth())
            .attr("fill", function (d) {
                return z(d.key);
            });
            /*.on("mouseover", function(d,i) {
            
                
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
            });*/
    
        
    })
};

function drawSoftEmployer(scale,div_width){
    
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    d3.csv("data/soft.csv", function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
    }, function(error, data) {
        if (error) throw error;
    
        var svg = d3.select("#hase");
        
        svg.attr("width",div_width);
        
        var margin = {top: 20, right: 20, bottom: 50, left: 60},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;
    
        svg.selectAll("g").remove();
    
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
        
        
        if(scale) {
            y.domain([0, 33245]).nice();
        }else {
            y.domain([0, d3.max(data, function (d) {
                return d3.max(keys, function (key) {
                    return d[key];
                });
            })]).nice();
        }
        
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-width)
                .tickFormat("")
            );
        
        g.append("g")
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
            .enter().append("rect")
            .attr("x", function (d) {
                return x1(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x1.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", function (d) {
                return z(d.key);
            }).on("mouseover", function(d,i) {
        
        
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                
                
                d3.rgb(color[i]).darker();
                
                div.html("<span style='font-weight: 400;line-height: 14px'><span style='font-size: 13px;line-height: 20px'>"+ d.name +"</span><BR/><HR style='margin-top: 0;margin-bottom: 3px;border-top: dashed 1px;opacity: .5'/>Year : "+d.key+"<BR/>Applications : "+d.value+"</span>")
                    .style("left", (d3.event.pageX+25) + "px")
                    .style("top", (d3.event.pageY-25) + "px")
                    .style("background",'#002134');
        
                
                
        
                $(this).attr("fill",d3.rgb(color[i]).darker(1).toString());
                $(this).attr("cursor","pointer");
                //$(this).attr("opacity",.8);
            })
            .on("mouseout", function(d,i) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                $(this).attr("fill",color[i]);
                $(this).attr("opacity",1);
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
            .attr("x", -200)
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
    })
}

function drawBoxPlot(){
    var trace1 = {
        y: infosys,
        type: 'box',
        name: 'INFOSYS',
        marker:{
            color: 'rgb(31, 119, 180)'
        }
    };
    
    var trace2 = {
        y: tcs,
        type: 'box',
        name: 'TCS',
        marker:{
            color: 'rgb(31, 119, 180)'
        }
    };
    
    var trace3 = {
        y: wipro,
        type: 'box',
        name: 'WIPRO',
        marker:{
            color: 'rgb(31, 119, 180)'
        }
    };
    
    var trace4 = {
        y: ibm,
        type: 'box',
        name: 'IBM',
        marker:{
            color: 'rgb(31, 119, 180)'
        }
    };
    
    var trace5 = {
        y: acc,
        type: 'box',
        name: 'ACCENTURE',
        marker:{
            color: 'rgb(31, 119, 180)'
        }
    };
    
    var trace11 = {
        y: msft,
        type: 'box',
        name: 'MICROSOFT',
        marker:{
            color: 'rgb(214, 39, 40)'
        }
    };
    
    var trace21 = {
        y: google,
        type: 'box',
        name: 'GOOGLE',
        marker:{
            color: 'rgb(214, 39, 40)'
        }
    };
    
    var trace31 = {
        y: amazon,
        type: 'box',
        name: 'AMAZON',
        marker:{
            color: 'rgb(214, 39, 40)'
        }
    };
    
    var trace41 = {
        y: oracle,
        type: 'box',
        name: 'ORACLE',
        marker:{
            color: 'rgb(214, 39, 40)'
        }
    };
    
    var trace51 = {
        y: apple,
        type: 'box',
        name: 'APPLE',
        marker:{
            color: 'rgb(214, 39, 40)'
        }
    };
    
    var data = [trace1,trace2,trace3,trace4,trace5,trace11,trace21,trace31,trace41,trace51];
    
    var layout = {
        showlegend: false,
        legend: {
            x: 1,
            y: 1
        },
        autosize: true,
        margin: {
            l: 70,
            r: 20,
            b: 80,
            t: 70   ,
            pad: 0
        },
        
        xaxis: {
            title: "<b>Company Name</b>",
            titlefont: {
                size: 12,
                color: '#000',
                family: "sans-serif"
            }
        },
        yaxis: {
            title: '<b>Wage Distribution($)</b>',
            titlefont: {
                size: 12,
                color: '#000',
                family: "sans-serif"
            },
            range:[20000,160000]
        },
        shapes: [
            {
                type: 'line',
                x0: 4.5,
                y0: 101088,
                x1: 9.5,
                y1: 101088,
                line: {
                    color: '#FF0021',
                    width: 2,
                    dash:'dot'
                },
                opacity: 1.0
            },
            {
                type: 'line',
                x0: -.5,
                y0: 68869,
                x1: 4.5,
                y1: 68869,
                line: {
                    color: '#002eff',
                    width: 2,
                    dash:'dot'
                },
                opacity: 1.0
            }
        ],
        
        
        annotations: [
            {
                x: 8.5,
                y: 101088,
                xref: 'x',
                yref: 'y',
                text: 'Median Wage (Product Companies) - $101,088',
                showarrow: true,
                arrowhead: 3,
                arrowwidth: 1,
                ax: 0,
                ay: -150,
                font: {
                    size: 13,
                    color: '#5c5c5c'
                },
                arrowcolor: '#FF0021'
            },{
                x: 3.5,
                y: 68869,
                xref: 'x',
                yref: 'y',
                text: 'Median Wage (Outsourcing Companies) - $68,869',
                showarrow: true,
                arrowhead: 3,
                arrowwidth: 1,
                ax: 0,
                ay: -215,
                font: {
                    size: 13,
                    color: '#5c5c5c'
                },
                arrowcolor: '#0c4cbf'
            },
            {
                x: 1.5,
                y: 25000,
                xref: 'x',
                yref: 'y',
                text: 'Outsourcing Companies',
                showarrow: true,
                arrowhead: 3,
                arrowwidth: 1,
                ax: 1,
                ay: 77,
                font: {
                    size: 14,
                    color: '#FFFFFF'
                },
                arrowcolor: '#FFFFFF',
                bgcolor: '#1776B6'
                
                
            }
            ,
            {
                x: 6.8,
                y: 25000,
                xref: 'x',
                yref: 'y',
                text: 'Product Companies',
                showarrow: true,
                arrowhead: 3,
                arrowwidth: 1,
                ax: 7,
                ay: 77,
                font: {
                    size: 14,
                    color: '#FFFFFF'
                },
                arrowcolor: '#FFFFFF',
                bgcolor: '#D8231F'
        
        
            }
        ]
    };
    
    Plotly.newPlot('myDiv3', data, layout,{displayModeBar: false});
}


function drawBoxPlots(){
    
    d3.csv("data/wage_infosys.csv", function(error, data) {
        infosys = $.map(data, function(value, index) {
            return value.Wage;
        });
    
        if (!--remaining) drawBoxPlot();
        
    });
    
    d3.csv("data/wage_tcs.csv", function(error, data) {
        tcs = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_wipro.csv", function(error, data) {
        wipro = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_ibm.csv", function(error, data) {
        ibm = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_acc.csv", function(error, data) {
        acc = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_msft_2016.csv", function(error, data) {
        msft = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_google_2016.csv", function(error, data) {
        google = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_amazon_2016.csv", function(error, data) {
        amazon = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_oracle_2016.csv", function(error, data) {
        oracle = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
    
    d3.csv("data/wage_apple_2016.csv", function(error, data) {
        apple = $.map(data, function(value, index) {
            return value.Wage;
        });
        if (!--remaining) drawBoxPlot();
    });
};

