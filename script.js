const countyUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const eduUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let eduData;

const colSet = [
  { num: 57, col: "purple" },
  { num: 48, col: "rgb(191, 26, 191)" },
  { num: 39, col: "rgb(215, 52, 215)" },
  { num: 30, col: "rgb(246, 96, 246)" },
  { num: 21, col: "rgb(255, 143, 255)" },
  { num: 12, col: "rgb(255, 178, 255)" },
  { num: 3, col: "rgb(255, 215, 255)" },
]
 
const paddingLeft = 200
const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip")
const drawMap = ()=>{
    const xScale = d3.scaleLinear().domain([d3.min(colSet,ele=>ele.num),d3.max(colSet,ele=>ele.num)+9]).range([1000-(32*7)-paddingLeft,1000-paddingLeft]);
    const xAxis= d3.axisBottom(xScale).tickValues([57,48,39,30,21,12,3,66]).tickFormat(t=>t+"%");
    d3.select("#legend").append("g").attr("transform","translate(0,20)").call(xAxis);
    d3.select("#legend")
    .selectAll("rect").data(colSet).enter().append("rect")
    .attr("width",32)
    .attr("height",16)
    .attr("x",d=>xScale(d.num))
    .attr("y",3)
    .attr("fill",d=>d.col);



    canvas.selectAll("path").data(countyData).enter().append("path")
    .attr("d",d3.geoPath())
    .attr("class","county")
    .attr("fill",d=>{
        let bachVal = eduData.find(county=>county.fips === d.id).bachelorsOrHigher;
        if(bachVal>=colSet[0].num){
            return colSet[0].col;
        }
        else if(bachVal>=colSet[1].num){
            return colSet[1].col;
        }
        else if(bachVal>=colSet[2].num){
            return colSet[2].col;
        }
        else if(bachVal>=colSet[3].num){
            return colSet[3].col;
        }
        else if(bachVal>=colSet[4].num){
            return colSet[4].col;
        }
        else if(bachVal>=colSet[5].num){
            return colSet[5].col;
        }
        else {
            return colSet[6].col;
        }
    })
    .attr("data-fips",d=>eduData.find(county=>county.fips === d.id).fips)
    .attr("data-education",d=>eduData.find(county=>county.fips === d.id).bachelorsOrHigher)
    .on("mouseover",(e,d)=>{
        const x = $(e.target).offset();
        const de = $(e.target).attr("data-education")
        const { area_name, state ,bachelorsOrHigher} = eduData.find((ele) => ele.fips === d.id)
        const str = `${area_name}, ${state}: ${bachelorsOrHigher}%`
        tooltip.attr("data-education",de)
        .style("opacity","1")
        .style("left",x.left+20 + "px")
        .style("top",x.top-40 + "px")
        .html(str)
    })
    .on("mouseout",d=>{
        tooltip.style("opacity","0")
        .style("left",0)
        .style("top",0)
    })
}


d3.json(countyUrl).then(data=>{
    countyData = topojson.feature(data,data.objects.counties).features;

    d3.json(eduUrl).then(data=>{
        eduData = data;

        drawMap();
    }).catch(err=>console.log(err))
}).catch(err=>console.log(err));