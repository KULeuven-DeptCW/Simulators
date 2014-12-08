/**
 * Creates a new render sim instance. A render sim instance is an object
 * that leads some kind of own life in an <svg> object.
 * 
 * A rendersim has the following attributes:
 *  - svg: The svg node to which the sim belongs.
 *  - g: The g node in the 
 *  - agenda: A list of tasks that are executed. Such tasks are functions that take at most one parameter (the node itself), in some cases, the functions thus will need to be curried.
 * 
 * A rendersim has the following methods:
 *  - move: move the object to a certain point at the <svg> object.
 *  - schedule: schedules a new function in the agenda. The task is scheduled first. The given function takes maximum one input: the object itself.
 *  - repaint: repaints the node. This is done by calling the paint function (a function one must implement oneself). The repaint function takes as input
 *             no parameters, the paint function takes as input one parameter: the <g> node.
 *  - kill: kills the sim, the object is no longer rendered, has no live thead nor an agenda. All attached resources will eventually be collected.
 *  - ressurect: opposite of kill, revive the render sim, because "Niemand gaat verloren".
 * 
 * @param {svg-node} svg The svg node to which this object must be added, must be effective.
 * @param {type} obj The given object to convert into a rendersim, if not effective, a new object is created.
 * @returns {rendersim} The rendersim obj. If the given obj was not effective, a new render sim object is generated.
 */
function rendersim(svg, obj) {
    if (obj === null) {
        obj = new Object();
    }
    obj.svg = svg;
    obj.kill = function() {
        obj.g.remove();
    };
    obj.ressurect = function() {
        obj.g = svg.append("g");
        obj.agenda = new Array();
    };
    obj.paint = function (g) {};
    obj.repaint = function () {
        obj.g.selectAll().remove();
        obj.paint(obj.g);
    };
    obj.move = function(x, y, t) {
        if (t === null || t <= 0.0) {
            obj.g.attr("transform", "translate(" + x + "," + y + ")");
        } else {
            obj.g.transition().duration(t).attr("transform", "translate(" + x + "," + y + ")");
        }
    };
    obj.schedule = function(task) {
        obj.agenda.push(task);
    };
    obj.ressurect();
    return obj;
}