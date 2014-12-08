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
 *  - kill: kills the sim, the object is no longer rendered, has no live thead nor an agenda. All attached resources will eventually be collected.
 * 
 * @param {svg-node} svg The svg node to which this object must be added.
 * @param {type} obj The given object to convert into a rendersim, if not effective, a new object is created.
 * @returns {rendersim} The rendersim obj. If the given obj was not effective, a new render sim object is generated.
 */
function rendersim (svg,obj) {
    if(obj === null) {
        obj = new Object();
    }
    obj.svg = svg;
    obj.agenda = new Array();
    return obj;
}