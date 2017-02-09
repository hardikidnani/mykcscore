
var g1=null;
var g2=null;
var g3=null;
var g4=null;


(function(){
      $("#typed").typed({
        //strings: ["transforms data into action. ^1500", "scores content. ^1000","makes content marketing great. ^1000"],
        stringsElement:$('#typed-strings'),
        typeSpeed: 100,
        backDelay:800,
        loop:true,
        contentType: 'html'

    //  back-dekay : 500
      });
  });


function openData(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function tabactive(evt,tabname)
{
  //tablinks = document.getElementsByClassName("tablinks");

   document.getElementById(tabname).style.display = "block";
  evt.currentTarget.className += " active"
   
  //document.getElementById(tabname).style.display = "block";
  //evt.currentTarget.className += " active";

}

(function() {

        [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
          new CBPFWTabs( el );
        });

      })();




function showDiv() {
   document.getElementById('hide').style.display = "block";
}


function setVisibility(id, visibility) {
document.getElementById(id).style.display = visibility;
}


window.onload=function(){
  //document.getElementById("runscore").style.display='none';
 //document.getElementById("reportrange").style.display='none';
  //document.getElementById("kcsimg").style.display='none';

}
(document).ready(function() {
			loadClients();
    
      console.log("S1 step");
    
		})
		
		loadClients = function(){

			$.ajax({
				type: 'GET',
				url: '/clients',
				success: generateClientDropdown
			})
		}

     


generateClientDropdown = function(result) {
		var html = '';
			$('#clients').html('<option>Please select<option>');
			for (var i=0; i < result.results.items.length; i++) {
				var clientObj = result.results.items[i];
				$('#clients').html($('#clients').html() + '<option value="' + clientObj.id + '">' + clientObj.name + '</option>');
        $('#clients option:selected').css('background-color');

       

			}
			
			$('#clients').change(function() {
				var option = $(this).find('option:selected').val();
				$('#profiles-container').html('<select id="profiles" class="ndesign"><option>Loading profiles...</option></select>');
         $('#clients').css('background-color','white');


        
				$.ajax({
					type: 'GET',
					url: '/profile',
					data:{'clientid':option},
          beforeSend:function(){
            $('#rimg').show();
          },
					success: [generateProfileDropdown],
            complete: function(){
            $('#rimg').hide();
          } 
				});
			});
		}
		
generateProfileDropdown = function(result) {
			var html = '';
			$('#profiles').html('<option >Please Select</option>');
			for (var i=0; i < result.results.items.length; i++) {
				var profileObj = result.results.items[i];
				$('#profiles').html($('#profiles').html() + '<option value="' + profileObj.accountId + ':' + profileObj.id +'">'+ profileObj.name + '</option>');
        //$('#profiles').html($('#profiles').html() + '<option value="' + profileObj.accountId +'">'+ +'</option>');
				//console.log(profileObj);
         $('#pname').html('<h6>' + profileObj.name + '</h6>');
         //console.log(profileObj.name);

			}
			//console.log(profileObj);
			$('#profiles').change(function() {
				var option = $(this).find('option:selected').val();//document.getElementById('profiles').value;//
       //var option = event.target.value;
				$('#views-container').html('<select id="views" class="ndesign"><option>Loading views...</option></select>');

        //console.log(profileObj.accountId);
        //console.log(profileObj.id);
        option1=option.split(":")
        //console.log(option1[0]);
         //console.log(option1[1]);
        //console.log(option);
        //$('#rimg').show();
				$.ajax({
					url: '/views',
					data: {'dprofile':option1[0],'wp':option1[1]},
					type: 'GET',
            beforeSend:function(){
            $('#simg').show();
          },

					success: [generateViewDropdown],
            complete: function(){
           $('#simg').hide();
          } 
				});
			});	

      //var prname = $("#profiles").find('option:selected').innerHTML;
      //console.log(prname);


		}




generateViewDropdown = function(result) {

			var html = '';
			$('#views').html('<option>Please Select</option>');
			for (var i=0; i < result.results.items.length; i++) {
				var viewObj = result.results.items[i];

				$('#views').html($('#views').html() + '<option value="' + viewObj.id + '">' + viewObj.name + '</option>');

      }

      var prname = $("#profiles").find('option:selected').text();
       var reg = /[:.*+?^${}()|[\]\\\s\/-]/g
       prname=prname.replace(reg,"");
      //var psname = prname.replace("\/\/","");
      //var psname = prname.replace("/[^a-zA-Z0-9_-]+/g", "hello");
     // var psname = prname.replace("[.*+?^${}()|[\]\\\s\/]","fuck");
     // console.log(typeof prname);
      console.log("prname"+ prname);

      //var test1="h xrdik.good.  boy://fuck:_the free world";
     
      ///var ftest=test1.replace("/[.*+?^${}()|[\]\\\s\/]/g","");
      //var ftest=test1.match(reg);
      //test1=test1.replace(reg,"");
      //console.log(test1);
      $('#views').change(function(){
        //console.log("trial");

        $("#runscore").show();
        $("#reportrange").show();
        $("#reportrange").css('display','inline-block');


      });

        

       $.ajax({
          url: '/segments',
          data: {'prname':prname},
          type: 'GET',
            beforeSend:function(){
            $('#simg').show();
          },

          success: [generateSegTable],
            complete: function(){
           $('#simg').hide();
          } 
        });
      } 

$(function() {

    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
         var startd = start.format('YYYY-MM-DD');
         var endd = end.format('YYYY-MM-DD');
         console.log("1 model working ");
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);
    console.log("2nd model working");
    cb(start, end);
    
});

	
generateScoresTable = function(result) {
			var html = '<table id="scores-table"><br><tr><th>Page</th><th>Score</th></tr>';
			var parsed=JSON.parse(result.results);
			//html +='<p>'+parsed.length+'</p>';
			for (var i = 0; i < parsed.length; i++) {
				var scoreObj = parsed[i];
				html += '<tr><td>' + scoreObj.pageTitle + '</td><td>' + scoreObj.oms + '</td>' ;//+ scoreObj.sessions + '</td><td>' + scoreObj['B.Sessions'] + '</td><td>' + scoreObj.users + '</td><td>' +  scoreObj['B.Users'] +'</td></tr>';
			}
			html+= '</table>';
			$('#scores-container').html(html);
		}

generateSegTable = function(result) {
     var html = '';
     console.log("plan ga");
     //var parsed=JSON.parse(result.results);
     //console.log(parsed);
     console.log(result.results);
      $('#segments').html('<option>Please select<option>');

      for (var i=0; i < result.results.length; i++) {
        var segments = result.results[i];
        $('#segments').html($('#segments').html() + '<option value="' + segments.id + '">' + segments.name + '</option>');
        $('#segments option:selected').css('background-color');

    }

       $('#segments').change(function() {
        var option = $(this).find('option:selected').val();
        console.log(option);

        //$('#profiles-container').html('<select id="profiles" class="ndesign"><option>Loading profiles...</option></select>');
         //$('#clients').css('background-color','white');

       });




  }

function benchmark(){

  
	var bstartd = moment(startd);
                bstartd.add(-90,'days');
              bstartd.format("YYYY-MM-DD");

	var bendd = moment(endd);
                bendd.add(-1,'days');
                bendd.format("YYYY-MM-DD");

                console.log("3rd model working");
}

function runscore(result) {
 
var html = '';
				var viewid=document.getElementById("views").value;
        //alert("press");
       // d3.select("#chart").selectAll("svg").remove();
       // var data=JSON.parse(result.results);
        //console.log(viewid);
        console.log("one mored date trial");
				var dateRange = document.getElementById("rangeValue").innerHTML;
                var split = dateRange.split(" - ");
                var startd = split[0].trim();
                var endd = split[1].trim();
             	
				var bstartd = moment(startd);
                bstartd.add(-90,'days');
              	bstartd.format("YYYY-MM-DD");
              	console.log(bstartd);
              	var bs=bstartd.format("YYYY-MM-DD");
              	console.log(bs);

				var bendd = moment(endd);
                bendd.add(-1,'days');
                bendd.format("YYYY-MM-DD");
                var be=bendd.format("YYYY-MM-DD");
                console.log(be);
                console.log(bendd);

        //var segid=document.getElementById("segments").innerHTML;
        var segid=$('#segments').find('option:selected').val();
        console.log(segid);

          var proc = new Date().getTime();

				$('#scores-container').html(' ');
        $('#limg').show();
				$.ajax({
					url: '/prog',
					data: {'profileid':viewid,'bstartd':bs,'bendd':be,'startd':startd,'endd':endd,'sid':segid},
					type: 'GET',
					success: [generated2graph],
          complete: function(){
            $('#limg').hide();
          } 


           

				});	

}

var proc = new Date().getTime();
function AJAXSuccessFunction() {
    console.log(new Date().getTime() - proc);
}


generated2graph=function(result){

  var setup = function(targetID){
  

  //Set size of svg element and chart
  setVisibility('d3-container', 'inline');
  var margin = {top: 0, right: 0, bottom: 0, left: 100},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    categoryIndent = 4*15 + 5,
    defaultBarWidth = 2000;

   var barHeight=30;
   var barPadding=30;
   var axisMargin=25;
   var leftMargin=12;


  //Set up scales

  var x = d3.scale.linear()
    .domain([0,defaultBarWidth])
    .range([0,width]);

var gap=30;
    var y = d3.scale.ordinal()
    .rangeRoundBands([0, height+3*gap], 0.1, 0.1);


  //Create SVG element
  d3.select(targetID).selectAll("svg").remove()
  var svg = d3.select(targetID).append("svg")
    .attr("width", width + margin.left + margin.right + 40)
    .attr("height", (height + gap * 3) + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //Package and export settings
  var settings = {
    margin:margin, width:width, height:height, categoryIndent:categoryIndent,
    svg:svg, x:x, y:y
  }
  return settings;
}

var redrawChart = function(targetID, newdata) {

  //Import settings
  var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent, 
  svg=settings.svg, x=settings.x, y=settings.y;

  //Reset domains
  y.domain(newdata.sort(function(a,b){
    return b.oms - a.oms;
  })
    .map(function(d) { return d.pageTitle; }));
  var barmax = d3.max(newdata, function(e) {
    return e.oms;
  });
  x.domain([0,barmax]);




  /////////
  //ENTER//
  /////////

  //Bind new data to chart rows 

  //Create chart row and move to below the bottom of the chart
  var chartRow = svg.selectAll("g.chartRow")
    .data(newdata, function(d){ return d.pageTitle})
    .style("fill", function(d, i){return d>70?"red":"steelblue";});

  var newRow = chartRow
    .enter()
    .append("g")
    .attr("class", "chartRow")
    .attr("transform", "translate(0," + height + margin.top + margin.bottom + ")")
    .on("click",function(d){

                            //showDiv();
                            //document.getElementById("defaultOpen");
                           //openData(event, 'gdetails');
                            openData( event,'gdetails' );

                            //window.alert("test");
                            
                            //tabactive(event,'gdetails');
                            setVisibility('allgraphs','inline-block');
                            setVisibility('toptenarticles','none');
                            //setVisibility('gdetails', 'inline');
                            //setVisibility('mbarchart', 'inline');
                            //setVisibility('chart2', 'inline');
                           // setVisibility('linkks', 'inline');

                          

                            data1=d3.select(this);
                            data1=d;

                            console.log(d.oms);

                            /*var s=d.oms;
                            if (s == d.oms)
                            {*/
                              //$('#adetails').html($('#adetails').html()  + d.oms +'&nbsp'+ d.pageTitle );
                             // window.alert($('#adetails').html());
                              $('#adetails').html(d.oms +'&nbsp'+ d.pageTitle ); 
                              //document.getElementById('adetails')=d.pageTitle;
                                                            //window.location.reload();                              
                            /*}
                            else
                            {
                            
                            setVisibility('adetails','none');

                            }*/

                           
                          nv.addGraph(function(){

                            
                            

                            var chart = nv.models.multiBarHorizontalChart()
                            .margin({top:30, right: 10, bottom: 30, left: 140}) 
                            .x(function(d) { return d.x })
                            .valueFormat(d3.format(".0f"))
                            .y(function(d) { return d.y })
                            //.yAxis.tickFormat(d3.format(',f'))
                            .valueFormat(d3.format(".0f"))
                            .showValues(true)  
                            .transitionDuration(1500)
                            .stacked(false)
                            .showControls(false).tooltips(false);

                           

                              
                            chart.yAxis.tickFormat(d3.format(',f'));

                             chart.yAxis.tickPadding(3);
                             chart.xAxis.tickPadding(3);
                          
                              sessionsincrease=data1.sessions-data1['B.Sessions'];
                              pageviewsincrease=data1.pageviews-data1['B.PageViews'];
                              uniquePageviewsincrease=data1.uniquePageviews-data1['B.UniquePVS'];
                              usersincrease=data1.users-data1['B.Users'];
                              brincrease=data1.bounceRate-data1['B.BounceRate'];
                              topincrease=data1.avgTimeOnPage-data1['B.TOP'];


             
                          d3.select('#mbarchart svg')
                           .attr('width',700)
                            .attr('height',300)
                            //.attr('viewBox','0 0 700 300')
                            //.attr('preserveAspectRatio', 'xMinYMin meet')
                           // .attr('transform','translate')

                            .datum([
                        {
                            key: "Performance",
                            visible: false,
                            color: "#51A351",
                        values:
                              [      
                                { x : "Sessions", y : data1.sessions},
                                { x : "Users", y : data1.users },
                                { x : "Pageviews", y : data1.pageviews},  
                                { x : "Unique Pageviews", y : data1.uniquePageviews }
                              ]
                          },
                          {
                            key: "Benchmark",
                            color: "#BD362F",
                            visible: true,
                            values:
                              [
                                { x : "Sessions", y : data1['B.Sessions']},
                                { x : "Users", y : data1['B.Users']},
                                { x : "Pageviews", y : data1['B.PageViews'] },  
                                { x : "Unique Pageviews", y : data1['B.UniquePVS']}
                              ]
                          },
                        ]).transition().duration(1500)
                            .call(chart)

                            nv.utils.windowResize(chart.update);
                            //nv.utils.windowResize(function(){ chart.update(); });

                             // console.log("exit"); 

                            return chart;

                          });


                          nv.addGraph(function() {
                            var margin = {top: 0, right: 0, bottom: 0, left: 0},
                            width = 700 - margin.left - margin.right,
                            height = 300 - margin.top - margin.bottom;
                          var chart = nv.models.discreteBarChart()
                          .x(function(d) { return d.label })    //Specify the data accessors.
                          .y(function(d) { return d.value })
                          //yAxis.tickFormat(function(d) { return d + "%"; })
                          .valueFormat(d3.format("0%"))
                          //.tickFormat(function(d) { return d + "%"; })
                          .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                          .tooltips(false)        //Don't show tooltips
                          .showValues(true)       //...instead, show the bar value right on top of each bar.
                                              
                            chart.yAxis.tickPadding(3);
                            chart.xAxis.tickPadding(3);
                        
                          chart.yAxis.tickFormat(d3.format("0%"));


                           
        

                          d3.select('#chart2 svg')
                          .attr('width',width)
                          .attr('height',height)
                          .datum([{
                            key: "Increase and Decrease",
                            values: [
                              { 
                                "label" : "Sessions" ,
                                "value" : sessionsincrease/data1['B.Sessions']
                              } , 
                              { 
                                "label" : "Pageviews" , 
                                "value" : pageviewsincrease/data1['B.PageViews']
                              } , 
                              { 
                                "label" : "Unique Pageviews" , 
                                "value" : uniquePageviewsincrease/data1['B.UniquePVS']
                              } , 
                              { 
                                "label" : "Users" , 
                                "value" : usersincrease/data1['B.Users']
                              },

                              { 
                                "label" : "Bounce Rate" , 
                                "value" : brincrease/data1['B.BounceRate']
                              },

                                { 
                                "label" : "Time On Page" , 
                                "value" : topincrease/data1['B.TOP']
                              }


                              ]
                          }])
                          .transition().duration(1500)
                          .call(chart);
                     

                          nv.utils.windowResize(chart.update);

                          return chart;
                          });

                          
                         
                            if(g1)
                              g1.refresh(data1.avgTimeOnPage);
                            else
                              generate(data1.avgTimeOnPage);

                             if(g2)
                              g2.refresh(data1.bounceRate);
                            else
                              generate2(data1.bounceRate);

                             if(g3)
                              g3.refresh(data1['B.BounceRate']);
                            else
                              generate3(data1['B.BounceRate']);


                             if(g4)
                              g4.refresh(data1['B.TOP']);
                            else
                              generate4(data1['B.TOP']);


                          function generate(gage){
                   
                            g1 = new JustGage({

                             id: 'g1',
                              value: data1.avgTimeOnPage,
                              min: 0,
                              max: 300,
                              pointer: true,
                              gaugeWidthScale: 0.6,
                              customSectors: [{
                                color: '#ff0000',
                                lo: 50,
                                hi: 100
                              }, {
                                color: '#00ff00',
                                lo: 0,
                                hi: 50
                              }],
                              counter: true,
                              title:"Performance",
                              refreshAnimationTime: 1000

                  
                            });
                          }

                          function generate2(gage){

                                g2 = new JustGage({
                                id: "g2",
                                value : data1.bounceRate,
                                min: 0,
                                max: 100,
                                symbol:'%',
                                decimals: 2,
                                title:"Performance",
                                gaugeWidthScale: 0.6,
                                customSectors: [{
                                  color : "#00ff00",
                                  lo : 0,
                                  hi : 50
                                },{
                                  color : "#ff0000",
                                  lo : 50,
                                  hi : 100
                                }],
                                counter: true,
                                refreshAnimationTime: 1000
                              });
                          }

                          function generate3(gage){

                                g3 = new JustGage({
                                id: "g3",
                                value : data1['B.BounceRate'],
                                min: 0,
                                max: 100,
                                symbol:'%',
                                decimals: 2,
                                title:"Expectation",
                                gaugeWidthScale: 0.6,
                                customSectors: [{
                                  color : "#00ff00",
                                  lo : 0,
                                  hi : 50
                                },{
                                  color : "#ff0000",
                                  lo : 50,
                                  hi : 100
                                }],
                                counter: true,
                                refreshAnimationTime: 1000
                              });

                          }

                          function generate4(gage){
                   
                            g4 = new JustGage({

                             id: 'g4',
                              value: data1['B.TOP'],
                              min: 0,
                              max: 300,
                              title:"Expectation",
                              pointer: true,
                              gaugeWidthScale: 0.6,
                              customSectors: [{
                                color: '#ff0000',
                                lo: 50,
                                hi: 100
                              }, {
                                color: '#00ff00',
                                lo: 0,
                                hi: 50
                              }],
                              counter: true,
                              refreshAnimationTime: 1000

                  
                            });
                          }

                          //scrolld();
                          document.getElementById('gtest').click();
        

    });

    
            

    

function colores_google(n) {
  var colores_g = ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"];
  return colores_g[n % colores_g.length];
}

var c20c = d3.scale.category20c();

function color_try(n)
{
var colorssss= ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"];
return colorssss;
}

var color2=d3.scale.ordinal()
.range(["#800026","#bd0026","#e31a1c","#fc4e2a","#fd8d3c","#feb24c","#fed976","#ffeda0","#ffeda1","#ffffcc"]);//(["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);

//(["#800026","#bd0026","#e31a1c","#fc4e2a","#fd8d3c","#feb24c","#fed976","#ffeda0","#ffffcc"]);

//
var color3 = d3.scale.ordinal()
    .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"]);
var barHeight=30;


  //Add rectangles
  newRow.insert("rect")
    .attr("class","bar")
    .attr("height",barHeight-1)
    .attr("width", 0)
   .style("fill", function(d) { return color2(d.oms); })
   .transition()
   .duration(4000);
   
    
  


  //Add value labels
  newRow.append("text")
    .attr("class","label")
    .attr("y", y.rangeBand()/2)
    .attr("x",0)
    .attr("opacity",0)
    .attr("dy","0em")
    .attr("dx","-2em")
    //.style("text-decoration","underline")
    .text(function(d){return d.oms;});
  
  //Add Headlines
  newRow.append("text")
    .attr("class","category")
    .attr("y", 40)
    .attr("x",0)
    .attr("dy",".35em")
    .style("text-decoration","underline")
    .style("cursor","pointer")
    .text(function(d){return d.pageTitle});
    //.text(function();


  //////////
  //UPDATE//
  //////////
  
  //Update bar widths
  chartRow.select(".bar").transition()
    .duration(4000)
    .attr("width", function(d) { return x(d.oms);})
    .attr("opacity",1);

  //Update data labels
  chartRow.select(".label").transition()
    .duration(4000)
    .attr("opacity",1)
    .tween("text", function(d) { 
    var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d.oms);
    return function(t) {
      this.textContent = Math.round(i(t));
    };
    });

  //Fade in categories
  chartRow.select(".category").transition()
    .duration(1600)
    .attr("opacity",1);


  ////////
  //EXIT//
  ////////


  //Fade out and remove exit elements
  chartRow.exit().transition()
    .style("opacity","0")
    .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
    .remove();


  ////////////////
  //REORDER ROWS//
  ////////////////

  var delay = function(d, i) { return 200 + i * 30; };

  chartRow.transition()
    .delay(delay)
    .duration(1000)
    .attr("transform", function(d){ return "translate(0," + y(d.pageTitle) + ")"; });
  //  .ease("bounce");
};



function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

//Pulls data
//Since our data is fake, adds some random changes to simulate a data stream.
//Uses a callback because d3.json loading is asynchronous
var pullData = function(settings,callback){
  
    var data=JSON.parse(result.results);
    console.log(data);
    var newData = data;
    data.forEach(function(d,i){
      var newValue = d.oms //+ Math.floor((Math.random()*5))
      //console.log(newValue);
      newData[i].oms = newValue //<= 0 ? 10 : newValue
    })

    newData = formatData(newData);

    callback(settings,newData);

   
}

//Sort data in descending order and take the top 10 values
var formatData = function(data){
    return data.sort(function (a, b) {
        return b.oms - a.oms;
      })
    .slice(0, 10);
}

//I like to call it what it does
var redraw = function(settings){
  pullData(settings,redrawChart)
}

//setup (includes first draw)
var settings = setup('#d3-container');
redraw(settings)

//Repeat every 3 seconds
//setInterval(function(){
  //redraw(settings)
//}, 3000);

}

