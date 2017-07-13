/**
 * Implements organism's code logic.
 * TODO: explain here code, byteCode, one number format,...
 *
 * @author DeadbraiN
 * TODO: may be this module is redundant
 * TODO: think about custom operators callbacks from outside. This is how
 * TODO: we may solve custom tasks
 */
import Config   from './../global/Config';
import Helper   from './../global/Helper';
import Observer from './../global/Observer';
import Num      from './Num';

/**
 * {Function} Just a shortcut
 */
const VAR               = Num.getVar;
const BITS_OF_CONDITION = Num.BITS_PER_OPERATOR + Num.BITS_PER_VAR * 3;

export default class Code extends Observer {
    constructor(codeEndCb) {
        super();
        /**
         * {Object} These operator handlers should return string, which
         * will be added to the final string script for evaluation.
		 * TODO: rewrite this to configuration, where callbacks and template functions will be
		 * TODO: e.g.: _onPi: `v${VAR(num, 0)}=pi` (check speed of such strings)
         */
        this._OPERATORS_CB = {
            0 : this._onVar.bind(this),
            //1: this._onFunc.bind(this),
            1 : this._onCondition.bind(this),
            2 : this._onLoop.bind(this),
            3 : this._onOperator.bind(this),
            4 : this._not.bind(this),
            5 : this._onPi.bind(this),
            6 : this._onTrig.bind(this),
            7 : this._onLookAt.bind(this),
            8 : this._eatLeft.bind(this),
            9 : this._eatRight.bind(this),
            10: this._eatUp.bind(this),
            11: this._eatDown.bind(this),
            12: this._stepLeft.bind(this),
            13: this._stepRight.bind(this),
            14: this._stepUp.bind(this),
            15: this._stepDown.bind(this),
            16: this._fromMem.bind(this),
            17: this._toMem.bind(this),
            18: this._myX.bind(this),
            19: this._myY.bind(this)
        };
        this._OPERATORS_CB_LEN = Object.keys(this._OPERATORS_CB).length;
        /**
         * {Array} Available conditions for if operator. Amount should be
         * the same like (1 << BITS_PER_VAR)
         */
        this._CONDITIONS = ['<', '>', '==', '!='];
		/**
		 * {Array} Available operators for math calculations
		 */
		this._OPERATORS = [
		    '+', '-', '*', '/', '%', '&', '|', '^', '>>', '<<', '>>>', '<', '>', '==', '!=', '<=' 
		];
		this._TRIGS = ['sin', 'cos', 'tan', 'abs'];

        /**
         * {Function} Callback, which is called on every organism
         * code iteration. On it's end.
         */
        this._onCodeEnd = codeEndCb;
        /**
         * {Array} Array of offsets for closing braces. For 'for', 'if'
         * and all block operators.
         */
        this._offsets   = [];
        this._byteCode  = [];
        this._code      = [];
        this._gen       = null;
        Num.setOperatorAmount(this._OPERATORS_CB_LEN);
        this.compile();
    }

    get size() {return this._byteCode.length;}
	get operators() {return this._OPERATORS_CB_LEN;};

    compile(org) {
        const header1 = 'this.__compiled=function* dna(org){const rand=Math.random,pi=Math.PI;';
        const vars    = this._getVars();
        const header2 = ';while(true){yield;';
        const footer  = ';this._onCodeEnd()}}';

        this._code = this._compileByteCode(this._byteCode);
        eval(header1 + vars + header2 + this._code.join(';') + footer);

        this._gen = this.__compiled(org);
    }

    run() {
        this._gen.next();
    }

    destroy() {
        this._byteCode  = [];
        this._code      = [];
        this._offsets   = [];
        this._gen       = {next: () => {}};
        this.__compiled = null;
    }

	/**
	 * Clones both byte and string code from 'code' argument
	 * @param {Code} code Source code, from which we will copy
	 */
    clone(code) {
        this._code     = code.cloneCode();
        this._byteCode = code.cloneByteCode();
    }

	/**
	 * Is used for clonning string code only. This is how you
	 * can get separate copy of the code.
	 * @return {Array} Array of strings
	 */
    cloneCode() {
        return this._code.slice();
    }

	/**
	 * Is used for clonning byte code only. This is how you
	 * can get separate copy of the byte code.
	 * @return {Array} Array of 32bit numbers
	 */
    cloneByteCode() {
        return this._byteCode.slice();
    }

	/**
	 * Inserts random generated number into the byte code at random position
	 */
    insertLine() {
        this._byteCode.splice(Helper.rand(this._byteCode.length), 0, Num.get());
    }

    updateLine(index, number = Num.get()) {
        this._byteCode[index] = number;
    }

	/**
	 * Removes random generated number into byte code at random position
	 */
    removeLine() {
        this._byteCode.splice(Helper.rand(this._byteCode.length), 1);
    }

    getLine(index) {
        return this._byteCode[index];
    }

    _compileByteCode(byteCode) {
        const len         = byteCode.length;
        const operators   = this._OPERATORS_CB;
		const yieldPeriod = Config.codeYieldPeriod;
        let   code        = new Array(len);
        let   offsets     = this._offsets;
        let   operator;

        for (let i = 0; i < len; i++) {
            operator = operators[Num.getOperator(byteCode[i])](byteCode[i], i, len);
            //
            // This code is used for closing blocks for if, for and other
            // blocked operators.
            //
            if (offsets[offsets.length - 1] === i && offsets.length > 0) {
                operator = operator + '}';
                offsets.pop();
            }
			//
			// Every yieldPeriod 'yield' operator will be inserted into the code
			//
			if (i % yieldPeriod === 0 && i > 0) {operator = operator + ';yield';}
            code[i] = operator;
        }
        if (offsets.length > 0) {
		    code[code.length - 1] += ('}'.repeat(offsets.length));
		}

        return code;
    }

    /**
     * Generates default variables code. It should be in ES5 version, because
     * speed is important. Amount of vars depends on Config.codeVarAmount config.
     * @returns {String} vars code
     * @private
     */
    _getVars() {
        const vars  = Config.codeVarAmount;
        let   code  = new Array(vars);
        const range = Config.codeVarInitRange;
        const half  = range / 2;
        const rand  = `=rand()*${range}-${half}`;

        for (let i = 0; i < vars; i++) {
            code[i] = `let v${i}${rand}`;
        }

        return code.join(';');
    }

    /**
     * Parses variable operator. Format: let = const|number. Num bits format:
     *   BITS_PER_OPERATOR bits - operator id
     *   BITS_PER_VAR bits  - destination var index
     *   BITS_PER_VAR bits  - assign type (const (half of bits) or variable (half of bits))
     *   BITS_PER_VAR bits  - variable index or all bits till the end for constant
     *
     * @param {Num} num Packed into number code line
     * @return {String} Parsed code line string
     */
    _onVar(num) {
        const var1    = VAR(num, 1);
        const isConst = var1 > Num.HALF_OF_VAR;

        return `v${VAR(num, 0)}=${isConst ? Helper.rand(Num.BITS_WITHOUT_2_VARS) : ('v' + var1)}`;
    }

    _onFunc(num) {
        return '';
    }

    _onCondition(num, line, lines) {
        const var3    = Num.getBits(num, BITS_OF_CONDITION, Num.BITS_OF_TWO_VARS);
        this._offsets.push(line + var3 < lines ? line + var3 : lines - 1);
        return `if(v${VAR(num, 0)}${this._CONDITIONS[VAR(num, 2)]}v${VAR(num, 1)}){`;
    }

    _onLoop(num, line, lines) {
        const var3    = Num.getBits(num, BITS_OF_CONDITION, Num.BITS_OF_TWO_VARS);
        const index   = line + var3 < lines ? line + var3 : lines - 1;
		const var0Str = 'v' + VAR(num, 0);
		const var1Str = 'v' + VAR(num, 1);
		const var2Str = 'v' + VAR(num, 2);

        this._offsets.push(index);
        return `for(${var0Str}=${var1Str};${var0Str}<${var2Str};${var0Str}++){yield`;
    }

    _onOperator(num) {
        return `v${VAR(num, 0)}=v${VAR(num, 1)}${this._OPERATORS[Num.getBits(num, Num.BITS_OF_THREE_VARS, Num.BITS_OF_TWO_VARS)]}v${VAR(num, 2)}`;
    }

    _not(num) {
        return `v${VAR(num, 0)}=!v${VAR(num, 1)}`;
    }

    _onPi(num) {
        return `v${VAR(num, 0)}=pi`;
    }
	
	_onTrig(num) {
		return `v${VAR(num, 0)}=Math.${this._TRIGS[VAR(num, 1)]}(v${VAR(num, 2)})`;
	}

    _onLookAt(num) {
        return `v${VAR(num, 0)}=org.lookAt(v${VAR(num, 1)},v${VAR(num, 2)})`;
    }

    _eatLeft(num) {
		return `v${VAR(num, 0)}=org.eatLeft(v${VAR(num, 1)})`;
    }

	_eatRight(num) {
		return `v${VAR(num, 0)}=org.eatRight(v${VAR(num, 1)})`;
    }
	
	_eatUp(num) {
		return `v${VAR(num, 0)}=org.eatUp(v${VAR(num, 1)})`;
    }
	
	_eatDown(num) {
		return `v${VAR(num, 0)}=org.eatDown(v${VAR(num, 1)})`;
    }
	
	_stepLeft(num) {
		return `v${VAR(num, 0)}=org.stepLeft()`;
    }
	
	_stepRight(num) {
		return `v${VAR(num, 0)}=org.stepRight()`;
    }
	
	_stepUp(num) {
		return `v${VAR(num, 0)}=org.stepUp()`;
    }
	
	_stepDown(num) {
		return `v${VAR(num, 0)}=org.stepDown()`;
    }
	
	_fromMem(num) {
		return `v${VAR(num, 0)}=org.fromMem()`;
	}
	
	_toMem(num) {
		return `org.toMem(v${VAR(num, 0)})`;
	}
	
	_myX(num) {
		return `v${VAR(num, 0)}=org.myX()`;
	}
	
	_myY(num) {
		return `v${VAR(num, 0)}=org.myY()`;
	}
}