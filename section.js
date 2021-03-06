    //visualisations

    //let svg
    let svg, map, corals, modern_traits
    let categoryColorScale, categoryLegend
    let categoryColorScale2, categoryLegend2
    let nodes

    const margin = {
      left: 170,
      top: 50,
      bottom: 50,
      right: 20
    }
    const width = 1000 - margin.left - margin.right
    const height = 950 - margin.top - margin.bottom

    const categories = ["Data Deficient", "Least Concern", "Near Threatened", "Vulnerable", "Endangered", "Critically Endangered"]
    const x1 = [50, 250, 450, 650, 850, 900]
    const y1 = [50, 50, 50, 100, 100, 200]
    const cols = ["#767676FF", "#155F83FF", "#8A9045FF", "#FFA319FF", "#800000FF", "black"]
    const threat_categories = ["Data Deficient", "Not Threatened", "Threatened"]
    const threat_cols = ["#767676FF", "#155F83FF", "#800000FF"]

    var posCenters = {
      "Data Deficient": {
        x: width / 3,
        y: height / 3
      },
      "Least Concern": {
        x: 2 * width / 3,
        y: height / 3
      },
      "Near Threatened": {
        x: width,
        y: height / 3
      },
      "Vulnerable": {
        x: width / 3,
        y: 2 * height / 3
      },
      "Endangered": {
        x: 2 * width / 3,
        y: 2 * height / 3
      },
      "Critically Endangered": {
        x: width,
        y: 2 * height / 3
      }
    };

    var posCenters2 = {
      "Data Deficient": {
        x: width / 3,
        y: height / 2
      },
      "Not Threatened": {
        x: 2 * width / 3,
        y: height / 2
      },
      "Threatened": {
        x: width,
        y: height / 2
      }
    };

    //Create all the scales and save to global variables

    function createScales() {
      categoryColorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(cols)

      categoryColorScale2 = d3.scaleOrdinal()
        .domain(threat_categories)
        .range(threat_cols)
    }

    function createLegend(x, y) {
      let svg = d3.select('#legend')

      categoryLegend = d3.legendColor()
        .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
        .shapePadding(10)
        .scale(categoryColorScale)


      svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)
        .call(categoryLegend);
    }

    function createLegend3(x, y) {
      let svg = d3.select('#legend3')

      categoryLegend = d3.legendColor()
        .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
        .shapePadding(10)
        .scale(categoryColorScale)


      svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)
        .call(categoryLegend);
    }

    function createLegend2(x, y) {
      let svg = d3.select('#legend2')

      categoryLegend2 = d3.legendColor()
        .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
        .shapePadding(10)
        .scale(categoryColorScale2)


      svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)
        .call(categoryLegend2);
    }

    //load coordinates for plotting on map: modern corals
    d3.csv("/data/traits_iucn.csv", function(data) {
      modern_traits = data
      drawInitial()
    })

    function drawInitial() {
      // creating legend for IUCN categories
      createScales()
      createLegend(20, 50)
      createLegend2(20, 50)
      createLegend3(20, 50)


      let svg = d3.select("#vis")
        .append('svg')
        .attr('width', 1000)
        .attr('height', 950)
        .attr('opacity', 1)

      // make circles
      nodes = svg.append("g")
        .selectAll("circle")
        .data(modern_traits)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", "darkgrey")
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 0)

      // Features of the forces applied to the nodes:
      simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width * 0.75).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1)) // Force that avoids circle overlapping
        .alpha(0.4).alphaTarget(0.2)
        .velocityDecay(0.01);

      // Apply these forces to the nodes and update their positions.
      // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
      simulation
        .nodes(modern_traits)
        .on("tick", function(d) {
          nodes
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            })
        })

      //Initialises the text and rectangles, and sets opacity to 0 for IUCN
      svg.selectAll('.cat-rect')
        .data(categories).enter()
        .append('rect')
        .attr('class', 'cat-rect')
        .attr('x', d => posCenters[d].x + 1000)
        .attr('y', d => posCenters[d].y + 150)
        .attr('width', 160)
        .attr('height', 30)
        .attr('opacity', 0)
        .attr('fill', 'grey')

      svg.selectAll('.lab-text')
        .data(categories).enter()
        .append('text')
        .attr('class', 'lab-text')
        .attr('opacity', 0)
        .text(function(d) {
          return d;
        })
        .raise()

      svg.selectAll('.lab-text')
        .attr('x', d => posCenters[d].x + 80 + 1000)
        .attr('y', d => posCenters[d].y + 150 + 20 + 1000)
        .attr('font-family', 'Domine')
        .attr('font-size', '12px')
        .attr('font-weight', 700)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')

        //Initialises the text and rectangles, and sets opacity to 0 for Threatened
        svg.selectAll('.threat-rect')
          .data(threat_categories).enter()
          .append('rect')
          .attr('class', 'threat-rect')
          .attr('x', d => posCenters2[d].x + 1000)
          .attr('y', d => posCenters2[d].y + 150)
          .attr('width', 160)
          .attr('height', 30)
          .attr('opacity', 0)
          .attr('fill', 'grey')

          svg.selectAll('.threat-text')
            .data(threat_categories).enter()
            .append('text')
            .attr('class', 'threat-text')
            .attr('opacity', 0)
            .text(function(d) {
              return d;
            })
            .raise()

          svg.selectAll('.threat-text')
            .attr('x', d => posCenters2[d].x + 80 + 1000)
            .attr('y', d => posCenters2[d].y + 150 + 20 + 1000)
            .attr('font-family', 'Domine')
            .attr('font-size', '12px')
            .attr('font-weight', 700)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
    }

    function draw1() {
      let svg = d3.select('#vis').select('svg')

      d3.selectAll("circle")
        .transition()
        .attr("duration", function(d, i) {
          return 100 + i * 0
        })
        .style("fill", "darkgrey")
    }


    function draw2() {
      createLegend(20, 50)
      let svg = d3.select('#vis').select('svg')

      d3.selectAll("circle")
        .transition()
        .duration(400)
        .style("fill", function(d) {
          return categoryColorScale(d.redlistCategory)
        })
        .transition().duration(100)
        .attr('r', 10)

      simulation
        .force('x', d3.forceX()
          .x(width / 2))
        .force('y', d3.forceY().y(height / 2))
        .force("collide", d3.forceCollide().strength(.05).radius(30).iterations(5)) // Force that avoids circle overlapping

      simulation.alpha(0.4).alphaTarget(0.2).velocityDecay(0.2).restart();

      svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0)
        .attr('x', d => posCenters[d].x+1000)

      svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .attr('x', d => posCenters[d].x + 80+1000)
        .attr('y', d => posCenters[d].y + 150 + 20+1000)
        .attr('opacity', 0)

    }

    function draw3() {

      let svg = d3.select('#vis').select('svg')


      svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 2)
        .attr('r', 6)
        .style("fill", function(d) {
          return categoryColorScale(d.redlistCategory)
        })


      // Reset the x force of the simulation
      simulation.force('x', d3.forceX().strength(0.1)
        .x(function xPos(d) {
          return posCenters[d.redlistCategory].x;
        }))
      simulation
        .force('y', d3.forceY().strength(0.1).y(function yPos(d) {
          return posCenters[d.redlistCategory].y;
        }))
        .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1)) // Force that avoids circle overlapping
      simulation.alpha(0.6).alphaTarget(0.4).velocityDecay(0.2).restart();

// Show IUCN Text
      svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0.2)
        .attr('x', d => posCenters[d].x)

      svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(function(d) {
          return d;
        })
        .attr('x', d => posCenters[d].x + 80)
        .attr('y', d => posCenters[d].y + 150 + 20)
        .attr('opacity', 1)

        // hide threat Text
        svg.selectAll('.threat-rect').transition().duration(300).delay((d, i) => i * 30)
          .attr('opacity', 0)
          .attr('x', d => posCenters2[d].x+1000)

        svg.selectAll('.threat-text').transition().duration(300).delay((d, i) => i * 30)
          .attr('x', d => posCenters2[d].x+30+1000)
          .attr('y', d => posCenters2[d].y + 150 + 20)
          .attr('opacity', 0)
    }

    function draw4() {
      let svg = d3.select('#vis').select('svg')


      d3.selectAll("circle")
        .transition()
        .duration(400)
        .style("fill", function(d) {
          return categoryColorScale2(d.threat)
        })
        .transition().duration(400)

      // Reset the x force of the simulation
      simulation.force('x', d3.forceX().strength(0.1)
        .x(function xPos(d) {
          return posCenters2[d.threat].x;
        }))
      simulation
        .force('y', d3.forceY().strength(0.1).y(function yPos(d) {
          return posCenters2[d.threat].y;
        }))
        .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1)) // Force that avoids circle overlapping
      simulation.alpha(0.6).alphaTarget(0.4).velocityDecay(0.2).restart();

// hide IUCN
      svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0)
        .attr('x', d => posCenters[d].x + 1000)

      svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(function(d) {
          return d;
        })
        .attr('x', d => posCenters[d].x + 80 + 1000)
        .attr('y', d => posCenters[d].y + 150 + 20 + 1000)
        .attr('opacity', 1)

// show Threats
        svg.selectAll('.threat-rect').transition().duration(300).delay((d, i) => i * 30)
          .attr('opacity', 0.2)
          .attr('x', d => posCenters2[d].x-50)

          svg.selectAll('.threat-text').transition().duration(300).delay((d, i) => i * 30)
            .text(function(d) {
              return d;
            })
            .attr('x', d => posCenters2[d].x+30)
            .attr('y', d => posCenters2[d].y + 150 + 20)
            .attr('opacity', 1)
    }
    //Array of all the graph functions
    //Will be called from the scroller functionality

    let activationFunctions = [
      draw1,
      draw2,
      draw3,
      draw4
    ]

    //All the scrolling function
    //Will draw a new graph based on the index provided by the scroll


    let scroll = scroller()
      .container(d3.select('#graphic'))
    scroll()

    let lastIndex, activeIndex = 0

    scroll.on('active', function(index) {
      d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function(d, i) {
          return i === index ? 1 : 0.1;
        });

      activeIndex = index
      let sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
      let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
      scrolledSections.forEach(i => {
        activationFunctions[i]();
      })
      lastIndex = activeIndex;

    })

    scroll.on('progress', function(index, progress) {
      if (index == 2 & progress > 0.7) {

      }
    })
