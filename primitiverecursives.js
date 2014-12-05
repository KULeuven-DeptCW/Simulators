function primobj (obj,type,degree) {
	obj.type = type;
	obj.degree = degree;
	obj.describe = describePrimobj;
}

function prNul () {
	primobj(this,"nul",1);
	this.tostring = function () {return "nul";};
	this.calc = function (x) {return [0];};
}

function prSucc () {
	primobj(this,"succ",1);
	this.tostring = function () {return "succ";};
	this.calc = function (x) {return [parseInt(x[0])+0x01];};
}

function prProjection (n,i) {
    primobj(this,"p",n);
	this.pick = i;
	this.tostring = function () {return "p["+this.degree+","+this.pick+"]";};
	this.calc = function (x) {return x[this.pick-1];};
}

function prComposite (f,gs) {
    primobj(this,"cn",gs.head.degree);
    var deg = this.degree;
    this.gs = unroll(gs);
    var gi = gs;
    var od = 1;
    while(typeof(gi.tail) !== 'undefined') {
    	gi = gi.tail;
    	if(gi.degree != deg) {
    		throw "The degrees of all functions of the composite function must have the same degree.";
    	}
    	od++;
    }
    if(f.degree != od) {
    	throw "The degree of the first function of the composite must be equal to the number of functions of the composition minus one.";
    }
    this.f = f;
    this.tostring = function () {return "cn["+this.f.tostring()+","+this.gs.map(function (x) {return x.tostring();}).join(",")+"]";};
    this.calc = function (x) {return f.calc(this.gs.map(function (y) {return y.calc(x);}));};
}

function prRecursion (f,g) {
    primobj(this,"pr",f.degree+1);
    this.f = f;
    this.g = g;
    this.tostring = function () {return "pr["+this.f.tostring()+","+this.g.tostring()+"]";};
}

function describePrimobj () {
	var res = "";
	if(this.degree > 1) {
		res = "<sup>"+this.degree+"</sup>";
	}
	return "&#x2115;"+res+"&#8594;&#x2115;";
}

function prFeedback (eid,fid,tid,iid,outid,errid,infid) {
	var str = document.getElementById(eid).value;
	prparse(str);
	if(prResult === null) {
		$("#"+fid).attr('class','has-error');
		$("#"+tid).html('Invalid expression');
		var errors = "";
		for(var i = 0; i < prError_cnt; i++ ) {
			errors += "<br>Parse error near <code>" + str.substr( prError_off[i], 30 ) + "</code>, expecting " + prError_la[i].map(function (x) {return "<code>"+x+"</code>";}).join(", ");
		}
		$("#"+errid).show();
		$("#"+errid).html("<strong>Trouble understanding what you say:</strong>"+errors);
		$("#"+outid).hide();
		$("#"+infid).hide();
	} else {
		$("#"+fid).attr('class','');
		$("#"+tid).html(":t ("+prResult.tostring()+") = "+prResult.describe());
		$("#"+errid).hide();
		$("#"+outid).show();
		$("#"+infid).show();
		$("#"+outid).html("<strong>output:</strong> "+prResult.calc(document.getElementById(iid).value.split(" ")).join(" "));
	}
}

var width = 960,
    height = 500;

var tree = d3.layout.tree()
    .size([width - 20, height - 20]);

var root = {},
    nodes = tree(root);

root.parent = root;
root.px = root.x;
root.py = root.y;

var diagonal = d3.svg.diagonal();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(10,10)");

var node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

var duration = 750,
    timer = setInterval(update, duration);

function update() {
  if (nodes.length >= 500) return clearInterval(timer);

  // Add a new node to a random parent.
  var n = {id: nodes.length},
      p = nodes[Math.random() * nodes.length | 0];
  if (p.children) p.children.push(n); else p.children = [n];
  nodes.push(n);

  // Recompute the layout and data join.
  node = node.data(tree.nodes(root), function(d) { return d.id; });
  link = link.data(tree.links(nodes), function(d) { return d.source.id + "-" + d.target.id; });

  // Add entering nodes in the parent’s old position.
  node.enter().append("circle")
      .attr("class", "node")
      .attr("r", 4)
      .attr("cx", function(d) { return d.parent.px; })
      .attr("cy", function(d) { return d.parent.py; });

  // Add entering links in the parent’s old position.
  link.enter().insert("path", ".node")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: d.source.px, y: d.source.py};
        return diagonal({source: o, target: o});
      });

  // Transition nodes and links to their new positions.
  var t = svg.transition()
      .duration(duration);

  t.selectAll(".link")
      .attr("d", diagonal);

  t.selectAll(".node")
      .attr("cx", function(d) { return d.px = d.x; })
      .attr("cy", function(d) { return d.py = d.y; });
}

