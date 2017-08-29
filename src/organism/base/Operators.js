/**
 * This file contains interface for available operators for some special
 * task. You have to inherit your operators class from this one.
 *
 * @author DeadbraiN
 */
import Num from '../Num';

export default class Operators {
    constructor(offsets, vars, obs) {
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and other operators.
         */
        this.offsets = offsets;
        /**
         * {Array} Available variables
         */
        this.vars = vars;
        /**
         * {Observer} Observer for sending events outside
         */
        this.obs = obs;
        //
        // We have to set amount of available operators for correct
        // working of mutations of operators.
        //
        Num.setOperatorAmount(this.size);
    }

    destroy() {
        this.offsets = null;
        this.vars    = null;
        this.obs     = null;
    }

    /**
     * Returns operators array. Should be overridden in child class
     * @abstract
     */
    get operators() {}

    /**
     * Returns siz (amount) of operators in operators array
     * @abstract
     */
    get size()      {}
}