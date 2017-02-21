'use strict'          
            fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
                .then(function(response) { 
// Convert to JSON
	           return response.json();
               }).then(function(j) {//j is the returned JavaScript object                
                const data = j.monthlyVariance
                console.log(data[0].year)
                console.log( data[ data.length - 1].year)
                const w = 1200;
                const h = 600;
                const padding = 120;
                const svg = d3.select("#container")
                              .append("svg")
                              .attr("width",w)
                              .attr("height",h)
                
//Graph Texts
                 svg.append('text').html('Monthly Global Land-Surface Temperature')
                     .style("font-size","28px").style("font-weight","600") 
                     .attr('text-anchor','middle').attr('x',w/2).attr('y',40);
                
                 svg.append('text').html("1753 - 2015")
                     .style("font-size","20px").style("font-weight","500") 
                     .attr('text-anchor','middle').attr('x',w/2).attr('y',65);
                
                 svg.append('text').html("Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.")
                     .style("font-size","13px").style("font-weight","300") 
                     .attr('text-anchor','middle').attr('x',w/2).attr('y',82);   
                
                 svg.append('text').html("Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07")
                     .style("font-size","13px").style("font-weight","300") 
                     .attr('text-anchor','middle').attr('x',w/2).attr('y',96);                                            
                
                svg.append("text")
                    .attr("transform","rotate(-90)").attr("y",padding/2).attr("x",-h/2)
                    .style("text-anchor", "middle")
                    .text("Months");
//                
                svg.append("text")
                      .attr( "x" , w/2).attr("y", h - padding + 50)
                      .style("text-anchor","end")
                      .text("Years");                               
//Scales           
                  const startingDate = new Date ( data[0].year, data[0].month - 1);
                  const endingDate   = new Date (  data[ data.length - 1].year, data[ data.length - 1].month - 1 );
                  
                  console.log(startingDate);
                  console.log(endingDate); 
                  console.log(new Date(2000,0));
                  console.log(new Date(2000,11));    
                  const xScale = d3.scaleTime()
                                   .domain( [startingDate, endingDate])
                                   .range([padding, w - padding])
                
                  const yScale = d3.scaleTime()
                                 .domain([new Date(2009,11,15), new Date (2010,11,16) ])
                                 .range([h - padding, padding])                
                
//Rectangles
                const recHeight        = (h-2*padding)/12;
                const recWidth         = (w-2*padding)/ (data[ data.length - 1].year - data[0].year);
                const colors           = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf",
                                          "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
                const labels           = [0,2.7,3.9,5,6.1,7.2,8.3,9.4,10.5,11.6,12.7];
                svg.selectAll("rect")
                   .data( data)
                   .enter()
                   .append("rect")
                   .attr("x" , (d, i) => { 
                    if (d.year < 1754){ console.log("Year: " + d.year + " Month: " + d.month  + " Variance: " + d.variance )};
                    return  xScale(   new Date ( d.year , d.month -1 )    )} )  
                   .attr("y" , (d, i) => yScale( new Date (2010, d.month-1,15 ))   )
                   .attr("width", recWidth).attr('height', recHeight)
                   .attr("fill", (d,i)=>{
                    let temperature = j.baseTemperature + d.variance;
                    if      ( temperature <= 0  ){ return colors[0] }
                    else if ( temperature <= 2.7 ){ return colors[1] }
                    else if ( temperature <= 3.9 ){ return colors[2] }
                    else if ( temperature <= 5.0 ){ return colors[3] }                    
                    else if ( temperature <= 6.1 ){ return colors[4] }
                    else if ( temperature <= 7.2 ){ return colors[5] }
                    else if ( temperature <= 8.3 ){ return colors[6] }
                    else if ( temperature <= 9.4 ){ return colors[7] }
                    else if ( temperature <= 10.5 ){ return colors[8] }
                    else if ( temperature <= 11.6 ){ return colors[9] }
                    else if ( temperature >= 12.6 ){ return colors[10] }
                } )
                   .on('mouseover', (d)=> {
                      tooltip.style('opacity','1');
//Formatting the time object with D3 for the tooltip           
                      var yearMonth         = new Date(d.year,d.month-1);
                      let formatDate        = d3.timeFormat("%Y-%b");
                      var yearMonth         = formatDate ( yearMonth);  
                      let temperature       = (j.baseTemperature + d.variance).toFixed([3]) + ' °C' ;
                      let variance          = d.variance.toFixed([3]) + ' °C' ;
//                    let reason      = element.Doping;
                      let toolTipPosX = xScale(new Date( d.year , d.month -1 )) + 20; 
                      let toolTipPosY = yScale( new Date (2010, d.month-1,15 )) - 100;
                      tooltip.attr('x', toolTipPosX  ).attr('y', toolTipPosY )  ;
//Year : Month
                      gCont.append('text').attr('id','yearMonth').text(yearMonth).attr('x',toolTipPosX +  toolWidth/2  ).attr('y', toolTipPosY + 20 ).attr('text-anchor','middle').attr("fill","white").style('font-size','20px').style('font-weight','600');                    
//temp in Celcius
                      gCont.append('text').attr('id','temperature').text(temperature).attr('x',toolTipPosX + toolWidth/2  ).attr('y', toolTipPosY + 40).attr('text-anchor','middle').attr("fill","white").style('font-size','16px').style('font-weight','600'); 
//Variance 
                      gCont.append('text').attr('id','variance').text(variance).attr('x',toolTipPosX +  toolWidth/2  ).attr('y', toolTipPosY + 58).attr('text-anchor','middle').attr("fill","white").style('font-size','16px');
                    } )
                    .on('mouseout', ()=>{ 
                      tooltip.style('opacity','0');
                      document.getElementById('yearMonth').remove();
                      document.getElementById('temperature').remove();
                      document.getElementById('variance').remove();                  
                    })                           
//Tooltip        
               const gCont = svg.append('g').attr('transform', "translate(0,0)")
               const toolWidth = 100; 
               const tooltip =  gCont.append("rect")					
                                   .attr('fill','black').attr('width', toolWidth).attr('height',70).style('opacity', '0');
                                
//Axes
                 const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")).ticks(13);
                 svg.append("g").attr("transform", "translate("+padding +"," + (0) + ")").call(yAxis);
                
                 const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).ticks(20);
                 svg.append("g").attr("transform",  "translate(0," + (h - padding) + ")").call(xAxis);       

//Legend with color pallete and text
                
                colors.forEach(function(elem,index){
                    svg.append("rect").attr("x",w/2 + 50 + 30*index ) //30--->width
                        .attr("y", h-padding/2 ).attr("width", 30 ).attr("height", 20).attr("fill", elem )
                })
                
                labels.forEach(function(elem,index){
                    svg.append('text').text(elem).attr('x',w/2 + 65 + 30*index ).attr('y', h-padding/2 +33)
                        .style('font-size','13px').style('text-anchor', 'middle')
                })  
});
            