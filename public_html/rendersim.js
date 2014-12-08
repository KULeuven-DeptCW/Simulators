/**
 * Creates a new render sim instance. A render sim instance is an object
 * that leads some kind of own life in an <svg> object.
 * 
 * A rendersim has the following attributes:
 *  - svg: The svg node to which the sim belongs.
 *  - g: The g node in the 
 *  - agenda: A list of tasks that are executed. Such tasks are functions that take at most one parameter (the node itself), in some cases, the functions thus will need to be curried.
 *  - taskTime: the number of milliseconds between starting two tasks. A second task will start, even if the previous one was not fully completed.
 *  - alive: boolean indicating wherther the sim has a thread that handles tasks. Don't set this value to a new value
 * 
 * A rendersim has the following methods:
 *  - move: move the object to a certain point at the <svg> object.
 *  - schedule: schedules a new function in the agenda. The task is scheduled first. The given function takes maximum one input: the object itself.
 *  - schedulerepaint: schedule a repaint command.
 *  - schedulemove: schedule a move to a certain location as the next step.
 *  - schedulekill: schedule a kill of this instance.
 *  - scheduleressurect: schedule a ressurect of this instance.
 *  - repaint: repaints the node. This is done by calling the paint function (a function one must implement oneself). The repaint function takes as input
 *             no parameters, the paint function takes as input one parameter: the <g> node.
 *  - kill: kills the sim, the object is no longer rendered, has no live thead nor an agenda. All attached resources will eventually be collected.
 *  - ressurect: opposite of kill, revive the render sim, because "Niemand gaat verloren".
 *  - fork: forks the given object as an instance (with the same paint) in the original <svg> object. The fork has an independent (and empty) agenda. An additional
 *          parameter can fill the agenda with initial appointments.
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
    obj.taskTime = 750;
    obj.agenda = new Array();
    obj.kill = function() {
        obj.g.remove();
        obj.agenda = new Array();
    };
    obj.ressurect = function() {
        obj.g = svg.append("g");
        if(!obj.alive) {
            obj.alive = true;
            setTimeout(obj.live,1,obj);
        }
    };
    obj.paint = function (g) {};
    obj.repaint = function () {
        obj.g.selectAll().remove();
        obj.paint(obj.g);
    };
    obj.alive = false;
    obj.move = function(x, y, t) {
        if (t === null || t <= 0.0) {
            obj.g.attr("transform", "translate(" + x + "," + y + ")");
        } else {
            obj.g.transition().duration(t).attr("transform", "translate(" + x + "," + y + ")");
        }
    };
    obj.schedule = function(task) {
        obj.agenda.push(task);
        if(!obj.alive) {
            obj.alive = true;
            setTimeout(obj.live,1,obj);
        }
    };
    obj.schedulemove = function (x,y,t) {
        obj.schedule(function (c) {c.move(x,y,t);});
    };
    obj.schedulerepaint = function () {
        obj.schedule(function (c) {c.repaint();})
    }
    obj.schedulekill = function () {
        obj.schedule(function (c) {c.kill();})
    }
    obj.scheduleressurect = function () {
        obj.schedule(function (c) {c.ressurect();})
    }
    obj.live = function (ctx) {
        if(ctx.agenda.length > 0x00) {
            ctx.alive = true;
            var task = ctx.agenda.pop();
            setTimeout(obj.live,ctx.taskTime,ctx);
            task(ctx);
        } else {
            ctx.alive = false;
        }
    };
    obj.fork = function () {
        var cln = rendersim(obj.svg,null);
        
        return cln;
    };
    obj.ressurect();
    return obj;
}