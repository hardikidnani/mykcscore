$(document).ready(function() {
			loadClients();
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
			$('#clients').html('<option>Choose a client<option>');
			for (var i=0; i < result.results.items.length; i++) {
				var clientObj = result.results.items[i];
				$('#clients').html($('#clients').html() + '<option value="' + clientObj.id + '">' + clientObj.name + '</option>');
			}
			
			$('#clients').change(function() {
				var option = $(this).find('option:selected').val();
				$('#profiles-container').html('<select id="profiles" class="form-control"><option>Loading profiles...</option></select>');
				$.ajax({
					type: 'GET',
					url: '/profile',
					data:{'clientid':option},
					success: generateProfileDropdown
				});
			});
		}
		
generateProfileDropdown = function(result) {
			var html = '';
			$('#profiles').html('<option>Choose a profile</option>');
			for (var i=0; i < result.results.items.length; i++) {
				var profileObj = result.results.items[i];
				$('#profiles').html($('#profiles').html() + '<option value="' + profileObj.accountId + '">'+ '<option value="' + profileObj.id + '">'+ profileObj.name + '</option>');
				//console.log(profileObj);
			}
			
			$('#profiles').change(function() {
				var option = $(this).find('option:selected').val();
				$('#views-container').html('<select id="views" class="form-control"><option>Loading views...</option></select>');
				$.ajax({
					url: '/views',
					data: {'dprofile':profileObj.accountId,'wp':profileObj.id},
					type: 'GET',
					success: [generateViewDropdown]
				});
			});			
		}


generateViewDropdown = function(result) {
			var html = '';
			$('#views').html('<option>Choose a View</option>');
			for (var i=0; i < result.results.items.length; i++) {
				var viewObj = result.results.items[i];
				//console.log(viewObj);
				$('#views').html($('#views').html() + '<option value="' + viewObj.id + '">' + viewObj.name + '</option>');
			}
			
			$('#views').change(function() {
				var option = $(this).find('option:selected').val();
				$('#scores-container').html('Loading scores...');
				$.ajax({
					url: '/prog',
					data: {'profileid':option},
					type: 'GET',
					//success: [generateScoresTable]
				});
			});			
		}

selectdate= function (result) {

    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {

        $('#reportrange span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
        var startd = start.format('YYYY-MM-DD');
         var endd = end.format('YYYY-MM-DD');
         var sd = new Date(startd);
         var ed = new Date(endd);
         console.log(typeof startd);
         console.log (typeof endd);
        console.log(startd);
    	console.log(endd);
    	console.log(sd);
    	console.log(ed);
         //console.log(startd);
          //console.log(endd);
      

   $.ajax({
     		url: '/prog',
			data: {'startd':startd,'endd':endd},
			type: 'GET',
			success: generateD2graph
		});
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

    cb(start, end);

    

};
		
		
		
generateScoresTable = function(result) {
			var html = '<table id="scores-table"><tr><th>Page</th><th>Score</th></tr>';
			var parsed=JSON.parse(result.results);
			//html +='<p>'+parsed.length+'</p>';
			for (var i = 0; i < parsed.length; i++) {
				var scoreObj = parsed[i];
				html += '<tr><td>' + scoreObj.pageTitle + '</td><td>' + scoreObj['One Metric Score'] + '</td></tr>';
			}
			html+= '</table>';
			$('#scores-container').html(html);
		}


generateD2graph = function(result){

	var margin = {top: 80, right: 180, bottom: 80, left: 180},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    var barPadding=2;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, .3);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(7,"");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data=JSON.parse(result.results)
  x.domain(data.map(function(d) { return d.pageTitle; }));
  y.domain([0, d3.max(data, function(d) { return d['One Metric Score']; })]);

  svg.append("text")
      .attr("class", "title")
      .attr("x", x(data[0].name))
      .attr("y", -26)
      .attr("text-align", "center")
      .text("One Metric Score");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll(".tick text")
      .call(wrap, x.rangeBand());

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.pageTitle); })
      .attr("width", x.rangeBand())
       .transition().delay(function (d,i){ return i * 600;})
 		.duration(800)
      .attr("y", function(d) { return y(d['One Metric Score']); })
      .attr("height", function(d) { return height - y(d['One Metric Score']); });

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

function type(d) {
  d['One Metric Score'] = +d['One Metric Score'];
  return d;
}
}