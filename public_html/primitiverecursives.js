function primobj(obj, type, degree, children) {
    obj.type = type;
    obj.degree = degree;
    obj.describe = describePrimobj;
    obj.children = children;
    obj.index = -1;
}

function prNul() {
    primobj(this, "nul", 1, []);
    this.tostring = function() {
        return "nul";
    };
    this.calc = function(x) {
        return [0];
    };
}

function prSucc() {
    primobj(this, "succ", 1, []);
    this.tostring = function() {
        return "succ";
    };
    this.calc = function(x) {
        return [parseInt(x[0]) + 0x01];
    };
}

function prProjection(n, i) {
    primobj(this, "p", n, []);
    this.pick = i;
    this.tostring = function() {
        return "p[" + this.degree + "," + this.pick + "]";
    };
    this.calc = function(x) {
        return x[this.pick - 1];
    };
}

function unroll(ht) {
    var result = new Array();
    while (typeof (ht) !== 'undefined') {
        if (typeof (ht.head) !== 'undefined') {
            result.push(ht.head);
        }
        ht = ht.tail;
    }
    return result;
}

function prComposite(f, gs) {
    this.f = f;
    gs = unroll(gs);
    this.gs = gs;
    primobj(this, "cn", gs[0].degree, gs.concat([f]));
    var deg = this.degree;
    var gn = this.gs.length;
    if (f.degree != gn) {
        throw "The degree of the first function of the composite must be equal to the number of functions of the composition minus one.";
    }
    for (var i = 0x00; i < gn; i++) {
        var gi = gs[i];
        if (gi.degree != deg) {
            throw "The degrees of all functions of the composite function must have the same degree.";
        }
    }
    this.tostring = function() {
        return "cn[" + this.f.tostring() + "," + this.gs.map(function(x) {
            return x.tostring();
        }).join(",") + "]";
    };
    this.calc = function(x) {
        return f.calc(this.gs.map(function(y) {
            return y.calc(x);
        }));
    };
}

function prRecursion(f, g) {
    primobj(this, "pr", f.degree + 1, [f, g]);
    this.f = f;
    this.g = g;
    this.tostring = function() {
        return "pr[" + this.f.tostring() + "," + this.g.tostring() + "]";
    };
}

function describePrimobj() {
    var res = "";
    if (this.degree > 1) {
        res = "<sup>" + this.degree + "</sup>";
    }
    return "&#x2115;" + res + "&#8594;&#x2115;";
}

function prFeedback(eid, fid, tid, iid, outid, errid, infid) {
    var str = document.getElementById(eid).value;
    prparse(str);
    if (prResult === null) {
        $("#" + fid).attr('class', 'has-error');
        $("#" + tid).html('Invalid expression');
        var errors = "";
        for (var i = 0; i < prError_cnt; i++) {
            errors += "<br>Parse error near <code>" + str.substr(prError_off[i], 30) + "</code>, expecting " + prError_la[i].map(function(x) {
                return "<code>" + x + "</code>";
            }).join(", ");
        }
        $("#" + errid).show();
        $("#" + errid).html("<strong>Trouble understanding what you say:</strong>" + errors);
        $("#" + outid).hide();
        $("#" + infid).hide();
    } else {
        $("#" + fid).attr('class', '');
        $("#" + tid).html(":t (" + prResult.tostring() + ") = " + prResult.describe());
        $("#" + errid).hide();
        $("#" + outid).show();
        $("#" + infid).show();
        $("#" + outid).html("<strong>output:</strong> " + prResult.calc(document.getElementById(iid).value.split(" ")).join(" "));
    }
}

function prLazyEvaluate() {
    return null;
}

function prParseInput(str) {
    return [3, 5, 7, 12];
}

function setWalkVector(content, walkVector) {
    /*if(walkVector === null) {
     walkVector = 
     }*/
    var vdx = 20;
    var vxi = -((content.length - 0x01) / 0x02) * vdx;
    walkVector.selectAll("g").remove();
    for (var i = 0; i < content.length; i++) {
        walkVector.append("text")
                .attr("dx", vxi)
                .attr("dy", ".35em").text(content[i]);
        vxi += vdx;
    }
    return walkVector;
}

function prPaintST(stdast, data) {

    var width = 600,
            height = 300;

    var tree = d3.layout.tree()
            .size([width - 20, height - 20]);
    var root = {},
            nodes = tree(root);

    root.parent = root;
    root.px = root.x;
    root.py = root.y;

    var diagonal = d3.svg.diagonal();

    d3.select("#" + stdast).selectAll("g").remove();
    var svg = d3.select("#" + stdast)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(10,10)");

    var node = svg.selectAll(".node"),
            link = svg.selectAll(".link");

    var durIntro = 250,
            durWalk = 750,
            timer = setInterval(introduceTree, durIntro);
    var evalStack = new Array();
    var clrs = d3.scale.category10();
    evalStack.push([data, root]);

    var vinp = prParseInput(null);
    var rtvctr = svg.append("g").style("fill", "#ff0000");
    setWalkVector(vinp, rtvctr);

    var walklocation = -0x01;

    function introduceTree() {
        if (evalStack.length <= 0) {
            clearInterval(timer);//if entire AST draw, stop!
            timer = setInterval(walkTree, durWalk);
            return;
        }

        var cur = evalStack.pop();

        // Add new element
        var newn = {id: nodes.length, type: cur[0].type}, //new element
        p = cur[1];//parent
        if (p.children)
            p.children.push(newn);
        else
            p.children = [newn];//add to the parent
        nodes.push(newn);//add node to the tree

        var curc = cur[0].children;
        var curn = curc.length;

        for (var i = 0; i < curn; i++) {
            evalStack.push([curc[i], newn]);
        }

        // Recompute the layout and data join.
        node = node.data(tree.nodes(root), function(d) {
            return d.id;
        });
        link = link.data(tree.links(nodes), function(d) {
            return d.source.id + "-" + d.target.id;
        });

        // Add entering nodes in the parent’s old position.
        var cnt = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.parent.px + "," + d.parent.py + ")";
                })
                .style("fill", function(d) {
                    return clrs(d.type)
                });
        var circle = cnt.append("circle")
//		  .attr("class", "node")
                .attr("r", 4);
        cnt.append("text")
                .attr("dx", 12)
                .attr("dy", ".35em").text(function(d) {
            return d.type
        });

        // Add entering links in the parent’s old position.
        link.enter().insert("path", ".node")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {x: d.source.px, y: d.source.py};
                    return diagonal({source: o, target: o});
                })
                .style("stroke", function(d) {
                    return clrs(d.source.type)
                });

        // Transition nodes and links to their new positions.
        var t = svg.transition()
                .duration(durIntro);

        t.selectAll(".link")
                .attr("d", diagonal);

        t.selectAll(".node")
                .attr("transform", function(d) {
                    d.px = d.x;
                    d.py = d.y;
                    return "translate(" + d.px + "," + d.py + ")";
                });
        rtvctr.transition().duration(durIntro).attr("transform", "translate(" + nodes[0x00].px + "," + nodes[0x00].py + ")");
    }

    function walkTree() {
        walklocation = (walklocation % (nodes.length - 0x01)) + 0x01;
        var t = svg;
        //alert(JSON.stringify(Object.keys(nodes[walklocation])));
        rtvctr.transition().duration(durIntro).attr("transform", "translate(" + nodes[walklocation].px + "," + nodes[walklocation].py + ")");
    }

}
