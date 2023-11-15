import * as d3 from 'd3'


export default class LineGraph {
    constructor(height, width, times, svgRef) {
        this.h = height;
        this.w = width;
        this.times = times;
        this.svgRef = svgRef;
    }
    setTimes(times) {
        this.times = times
    }
    initializeGraph() {
        this.margin = { top: 20, right: 30, bottom: 40, left: 50 };
        this.times.forEach(d => {
            d.name = new Date(d.name)
        })
        const minValue = d3.min(this.times, d => d.value)
        const maxValue = d3.extent(this.times, d => d.value);
        const minDate = d3.min(this.times, d => d.name);
        const maxDate = d3.max(this.times, d => d.name);  
        this.xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0,this.w]);
        this.yScale = d3.scaleLinear()
        .domain([minValue-500, maxValue+500])
        .range([this.h,0]);
        this.lineGenerator = d3.line()
        .x(d => this.xScale(d.name))
        .y(d => this.yScale(d.value))
        .curve(d3.curveCardinal);
        this.xAxis = d3.axisBottom(this.xScale)
        .tickFormat(d3.timeFormat("%b %d, %H:%M"))
        .ticks(5);
    
        this.yAxis = d3.axisLeft(this.yScale)
        .ticks(10);
        this.svg = d3.select(this.svgRef.current)
        .attr('width', this.w)
        .attr('height', this.h)
        .style('background', '#d3d3d3')
        .style('margin-top','50')
        .style('margin-left', '40')
        .style('overflow', 'visible');
    }
    drawChart() {
        this.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${this.h})`)
        .transition()
        .ease(d3.easeLinear)
        .call(this.xAxis);
        this.svg.append('g')
        .attr('class', 'y-axis')
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .call(this.yAxis);
        this.svg.append('path')
        .attr('class', 'line-path')
        .datum(this.times)
        .attr('d', d => this.lineGenerator(d))
        .attr('fill', 'none')
        .attr('stroke', 'black');
        return this.svgRef
        // // X-axis label
        // svg.append("text")
        // .attr("transform", `translate(${w / 2}, ${h + 50})`) // Adjust position as needed
        // .style("text-anchor", "middle")
        // .text("Date");
        // // Y-axis label
        // svg.append("text")
        // .attr("transform", "rotate(-90)")
        // .attr("y", 0 - margin.left - 10)
        // .attr("x", 0 - (h / 2))
        // .attr("dy", "1em")
        // .style("text-anchor", "middle")
        // .text("BTC Price");
        // svg.selectAll("circle")
        // .data(this.times)
        // .enter()
        // .append("circle")
        // .attr("cx", d => xScale(d.x))
        // .attr("cy", d => yScale(d.y))
        // .attr("r", 5) // Radius of the circle
        // // Horizontal grid lines
    
        
    // }
        
    }
    updateAgain() {
        const dateExtent = d3.extent(this.times, d => d.name);
        const minValue = d3.min(this.times, d => d.value)
        const maxValue = d3.extent(this.times, d => d.value);
        this.xScale.domain(dateExtent)
        .range([0,this.w]);
        this.yScale.domain(maxValue)
        .range([this.h,0]);
        this.svg.select('g.y-axis')
        .transition()
        .duration(1000)
            .call((this.yAxis));
        this.svg.select("g.x-axis")
        .transition()
            .duration(1000)
            .call((this.xAxis))
        .selectAll('text')
        .style('text-anchor', 'left')
        .attr('font-size', '1.2rem')
        .attr('transform', 'rotate(-45)')
        this.svg.select('.line-path')
        .datum(this.times)
        .transition()
        .duration(1000)
        .attr('d', this.lineGenerator);
        return this.svgRef
    }
}