/**
 * Digital Organisms Script - (DOS) is a simple language for VM.
 * This file contains all available operators implementation. For example:
 * for, if, variable declaration, steps, eating etc... User may override
 * this class for own needs and change operator list to custom.
 *
 * @author flatline
 */
const Helper       = require('./../../../../../../common/src/Helper');
const EVENTS       = require('./../../../../../src/share/Events').EVENTS;
const OConfig      = require('./../Config');
const EConfig      = require('./../../energy/Config');
const Operators    = require('./../../../../vm/Operators');
const Objects      = require('./../../objects/Objects');
const Organism     = require('./../../../plugins/organisms/Organism').Organism;
const Num          = require('./../../../../vm/Num');
const OFFSX        = require('./../../../../../../common/src/Directions').OFFSX;
const OFFSY        = require('./../../../../../../common/src/Directions').OFFSY;
const OBJECT_TYPES = require('./../../../../view/World').OBJECT_TYPES;

const NORMALIZE_NO_DIR = Helper.normalizeNoDir;
/**
 * {Number} World object types
 */
const EMPTY            = 0;
const ENERGY           = 1;
const ORGANISM         = 2;
const OBJECT           = 3;
/**
 * {Function} Is created to speed up this function call. constants are run
 * much faster, then Helper.normalize()
 */
const IN_WORLD              = Helper.inWorld;

class OperatorsDos extends Operators {
    static compile() {
        const bitsPerOp = OConfig.codeBitsPerOperator;
        this.OPERATOR_AMOUNT = 26;
        //
        // IMPORTANT: don't use super here, because it breaks Operators
        // IMPORTANT: class internal logic. Operators.global will be point
        // IMPORTANT: to the Window
        //
        Operators.compile(this.OPERATOR_AMOUNT);

        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 3));
        this.LENS.push(Num.MAX_BITS -  bitsPerOp);
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS -  bitsPerOp);
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar * 2));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS - (bitsPerOp + OConfig.codeBitsPerVar));
        this.LENS.push(Num.MAX_BITS -  bitsPerOp);

        this._compileLookAt();   // 11
        this._compileStep();     // 12
        this._compileDir();      // 13
        this._compileMyX();      // 14
        this._compileMyY();      // 15
        this._compileEat();      // 16
        this._compilePut();      // 17
        this._compileEnergy();   // 18
        this._compilePick();     // 19
        this._compileRand();     // 20
        this._compileSay();      // 21
        this._compileListen();   // 22
        this._compileCheck();    // 23
        this._compileMyEnergy(); // 24
        this._compilePoison();   // 25
    }

    /**
     * Compiles all variants of lookAt operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx xx xx  4
     * number: 101011 00 01 00 01...
     * string: v0 = lookAt(v1, v0)
     */
    static _compileLookAt() {
        const bpv    = OConfig.codeBitsPerVar;
        const ops    = this._compiledOperators;
        const h      = Helper.toHexNum;
        const b      = Helper.toBinStr;
        const vars   = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                for (let v2 = 0; v2 < vars; v2++) {
                    eval(`OperatorsDos.global.fn = function lookAt(line) {
                        const vars  = this.vars;
                        const x     = (vars[${v1}] + .5) << 0;
                        const y     = (vars[${v2}] + .5) << 0;
                        vars[${v0}] = (IN_WORLD(x, y) ? (this._positions[x][y] <= 0 ? this._world.data[x][y] : this._positions[x][y].energy) : 0);
                        return ++line;
                    }`);
                    ops[h(`${'101011'}${b(v0, bpv)}${b(v1, bpv)}${b(v2, bpv)}`)] = this.global.fn;
                }
            }
        }
    }

    /**
     * Compiles all variants of 'step' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6
     * number: 101100...
     * string: step
     */
    static _compileStep() {
        eval(`OperatorsDos.global.fn = function step(line, num, org) {
            this._obs.fire(${EVENTS.STEP}, org, org.x, org.y, org.dirX, org.dirY);
            return ++line;
        }`);
        this._compiledOperators[Helper.toHexNum(`${'101100'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of 'dir' operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx
     * number: 101101 11...
     * string: dir(v3)
     */
    static _compileDir() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);
        const dirs     = OFFSX.length;

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function dir(line, num, org) {
                org.dir = ((this.vars[${v0}] + .5) << 0 >>> 0) % ${dirs};
                return ++line;
            }`);
            ops[h(`${'101101'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'myX' operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx
     * number: 101110 00...
     * string: v0 = myX()
     */
    static _compileMyX() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function myX(line, num, org) {
                this.vars[${v0}] = org.x;
                return ++line;
            }`);
            ops[h(`${'101110'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'myY' operator and stores they in
     * this._compiledOperators map. 'xx' means, that amount of bits
     * depends on configuration. '...' means, that all other bits are
     * ignored. Example:
     *
     * bits  :      6 xx
     * number: 101111 00...
     * string: v0 = myY()
     */
    static _compileMyY() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function myY(line, num, org) {
                this.vars[${v0}] = org.y;
                return ++line;
            }`);
            ops[h(`${'101111'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'eat' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx
     * number: 110000 01...
     * string: eat(v1)
     */
    static _compileEat() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function eat(line, num, org) {
                let eat      = this.vars[${v0}];
                if (eat <= 0) {return ++line}
                let x;
                let y;
                [x, y]       = NORMALIZE_NO_DIR(org.dirX, org.dirY);
                const victim = this._positions[x][y];
                
                if (victim === OBJECT_TYPES.POISON) {    // Poison found
                    this._positions[x][y] = 0;
                    this._world.setDot(x, y, 0);
                    org.destroy();
                    return ++line;
                }
                if (victim < 0) {return ++line}          // World object found. We can't eat objects
                if (victim === 0) {                      // Energy found
                    if ((eat = this._world.grabDot(x, y, eat)) > 0) {
                        if (org.energy + eat > OConfig.orgMaxEnergy) {eat = OConfig.orgMaxEnergy - org.energy}
                        org.energy += eat;
                        this._obs.fire(EVENTS.EAT_ENERGY, eat);
                    }
                    return ++line;
                }
                if (victim.energy <= eat) {              // Organism found
                    if (org.energy + victim.energy > OConfig.orgMaxEnergy) {return ++line}
                    this._obs.fire(EVENTS.KILL_EAT, victim);
                    org.energy += victim.energy;
                    //
                    // IMPORTANT:
                    // We have to do destroy here, to have a possibility for current
                    // (winner) organism to clone himself after eating other organism.
                    // This is how organisms compete for an ability to clone
                    //
                    victim.destroy();
                    return ++line;
                }
                
                if (org.energy + eat > OConfig.orgMaxEnergy) {return ++line}
                this._obs.fire(EVENTS.EAT_ORG, victim, eat);
                org.energy    += eat;
                victim.energy -= eat;
        
                return ++line;
            }`);
            ops[h(`${'110000'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'put' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx
     * number: 110001 01...
     * string: put(v1)
     */
    static _compilePut() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);
        const event    = EVENTS.PUT_ENERGY;

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function put(line, num, org) {
            return ++line;
                let put      = this.vars[${v0}];
                if (put <= 0) {return ++line}
                if (put > 0xffffff) {put = 0xffffff}
                let   x      = org.dirX;
                let   y      = org.dirY;
                if (!IN_WORLD(x, y)) {return ++line}
                if (this._world.data[x][y] !== 0) {return ++line}
                if (org.energy <= put) {
                    put = org.energy;
                    this._world.setDot(x, y, put);
                    this._obs.fire(${event}, put);
                    org.destroy();
                    return ++line;
                }
                
                this._world.setDot(x, y, put);
                this._obs.fire(${event}, put);
                org.energy -= put;
                return ++line;
            }`);
            ops[h(`${'110001'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'energy' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. If organism calls energy command near
     * only one energy object it will not be transformed to energy.
     * Example:
     *
     * bits  :      6 xx
     * number: 110010 01...
     * string: energy(v1)
     */
    static _compileEnergy() {
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;

        eval(`Operators.global.fn = function energy(line, num, org) {
            const poses  = this._positions;
            const world  = this._world;
            const energy = {1:[], 2:[], 3:[], 4:[], 5:[]};
            let   e      = 0;
            
            for (let x = org.x - 1, xlen = org.x + 2; x < xlen; x++) {
                for (let y = org.y - 1, ylen = org.y + 2; y < ylen; y++) {
                    if (IN_WORLD(x, y) && poses[x][y] <= OBJECT_TYPES.TYPE_ENERGY0 && poses[x][y] >= OBJECT_TYPES.TYPE_ENERGY4) {
                        e = -poses[x][y];
                        energy[e].push(x, y);
                        if (energy[e].length === 6) {
                            const xy = energy[e];
                            
                            world.setDot(xy[0], xy[1], Objects.getColor(e));
                            poses[xy[0]][xy[1]] = -(e+1);
                            world.setDot(xy[2], xy[3], 0);
                            poses[xy[2]][xy[3]] = 0;
                            world.setDot(xy[4], xy[5], 0);
                            poses[xy[4]][xy[5]] = 0;
                            return ++line;
                        }
                    }
                }
            }
            
            for (let e = 1, len = Math.abs(OBJECT_TYPES.TYPE_ENERGY4 - OBJECT_TYPES.TYPE_ENERGY0) + 1; e <= len; e++) {
                if (energy[e].length === 4) {
                    const xy  = energy[e];
                    const eat = (2**(e+1)) * Helper.getColor(EConfig.colorIndex);
                    
                    if (org.energy + eat <= OConfig.orgMaxEnergy) {
                        org.energy += eat;
                        world.setDot(xy[0], xy[1], 0);
                        poses[xy[0]][xy[1]] = 0;
                        world.setDot(xy[2], xy[3], 0);
                        poses[xy[2]][xy[3]] = 0;
                    }
                    return ++line;
                }
            }
            return ++line;
        }`);
        ops[h(`${'110010'}`)] = this.global.fn;
    }

    /**
     * Compiles all variants of 'pick' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx
     * number: 110011 01...
     * string: pick(v1)
     */
    static _compilePick() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);
        const dirs     = OFFSX.length;

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function pick(line, num, org) {
                const poses = this._positions;
                const world = this._world;
                const x     = org.dirX;
                const y     = org.dirY;
                if (IN_WORLD(x, y) && (poses[x][y] <= OBJECT_TYPES.TYPE_ENERGY0 && poses[x][y] >= OBJECT_TYPES.TYPE_ENERGY4 || poses[x][y] === 0 && world.data[x][y] > 0)) {
                    const dir = ((this.vars[${v0}] + .5) << 0 >>> 0) % ${dirs};
                    const dx  = org.x + OFFSX[dir];
                    const dy  = org.y + OFFSY[dir];
                    if (IN_WORLD(dx, dy) && world.data[dx][dy] === 0) {
                        poses[dx][dy] = poses[x][y];
                        poses[x][y]   = 0;
                        world.setDot(dx, dy, world.data[x][y]);
                        world.setDot(x, y, 0);
                    }
                }
                return ++line;
            }`);
            ops[h(`${'110011'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'rand' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx xx
     * number: 110100 01 11...
     * string: v1 = rand(v3)
     */
    static _compileRand() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            for (let v1 = 0; v1 < vars; v1++) {
                eval(`Operators.global.fn = function rand(line) {
                    this.vars[${v0}] = Helper.rand(((this.vars[${v1}] + .5) << 0 >>> 0));
                    return ++line;
                }`);
                ops[h(`${'110100'}${b(v0, bpv)}${b(v1, bpv)}`)] = this.global.fn;
            }
        }
    }

    /**
     * Compiles all variants of 'say' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx
     * number: 110101 01...
     * string: say(v1)
     */
    static _compileSay() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function say(line, num, org) {
                let x = org.dirX;
                let y = org.dirY;
                IN_WORLD(x, y) && !(this._positions[x][y] <= 0) && (this._positions[x][y].msg = this.vars[${v0}]);
                return ++line;
            }`);
            ops[h(`${'110101'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'listen' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx
     * number: 110110 01...
     * string: v1 = listen()
     */
    static _compileListen() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function listen(line, num, org) {
                this.vars[${v0}] = org.msg;
                return ++line;
            }`);
            ops[h(`${'110110'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'check' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx
     * number: 110111 00...
     * string: v0 = check()
     */
    static _compileCheck() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function check(line, num, org) {
                const x = org.dirX;
                const y = org.dirY;
                if (!IN_WORLD(x, y)) {return ++line}
                
                if (this._positions[x][y] < 0) {
                    this.vars[${v0}] = this._positions[x][y];
                } else if (this._positions[x][y] === 0) {
                    this.vars[${v0}] = this._world.getDot(x, y) > 0 ? ENERGY : EMPTY;
                } else {
                    this.vars[${v0}] = ORGANISM;
                }
                
                return ++line;
            }`);
            ops[h(`${'110111'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'check' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Step direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6 xx
     * number: 111000 00...
     * string: v0 = myEnergy()
     */
    static _compileMyEnergy() {
        const bpv      = OConfig.codeBitsPerVar;
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;
        const b        = Helper.toBinStr;
        const vars     = Math.pow(2, bpv);

        for (let v0 = 0; v0 < vars; v0++) {
            eval(`Operators.global.fn = function myEnergy(line, num, org) {
                this.vars[${v0}] = org.energy;
                return ++line;
            }`);
            ops[h(`${'111000'}${b(v0, bpv)}`)] = this.global.fn;
        }
    }

    /**
     * Compiles all variants of 'poison' operator and stores they in
     * this._compiledOperators map. '...' means, that all other bits are
     * ignored. Poison direction depends on active organism's direction.
     * See Organism.dir property. Example:
     *
     * bits  :      6
     * number: 111001...
     * string: poison
     */
    static _compilePoison() {
        const ops      = this._compiledOperators;
        const h        = Helper.toHexNum;

        eval(`Operators.global.fn = function poison(line, num, org) {
            let   x = org.dirX;
            let   y = org.dirY;
            if (!IN_WORLD(x, y) || this._world.data[x][y] !== 0 || org.energy <= OConfig.orgPoisonValue) {return ++line}
            
            this._world.setDot(x, y, Helper.getColor(OConfig.orgPoisonColor));
            this._positions[x][y] = OBJECT_TYPES.POISON;
            if ((org.energy -= OConfig.orgPoisonValue) < 0) {org.destroy()}
            return ++line;
        }`);
        ops[h(`${'111001'}`)] = this.global.fn;
    }

    constructor(offs, vars, obs) {
        super(offs, vars, obs);
        /**
         * {Observer} Observer for sending external events
         */
        this._obs          = obs;
        this._world        = man.world;
        this._positions    = man.positions;
    }

    /**
     * Returns operators array. Should be overridden in child class
     * @abstract
     */
    get length() {return OperatorsDos.OPERATOR_AMOUNT}

    destroy() {
        super.destroy();

        this._world        = null;
        this._positions    = null;
        this._obs          = null;
    }
}

OperatorsDos.compile();

module.exports = OperatorsDos;