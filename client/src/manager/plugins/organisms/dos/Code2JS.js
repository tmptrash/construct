/**
 * This class is used only for code visualization from byte code to human
 * readable form (JS compatible syntax). It uses Code2JS base class as
 * a parent.
 *
 * @author flatline
 */
const Num         = require('./../../../../vm/Num');
const Helper      = require('./../../../../../../common/src/Helper');
const BaseCode2JS = require('./../../../../vm/Code2JS');

class Code2JS extends BaseCode2JS {
    constructor(manager) {
        super();

        this._manager = manager;
        /**
         * {Object} These operator handlers should return string representation
         * of numeric based byte vm.
         */
        this.operators[0b101100] = this._onLookAt.bind(this);
        this.operators[0b101101] = this._onStep.bind(this);
        this.operators[0b101110] = this._onDir.bind(this);
        this.operators[0b101111] = this._onMyX.bind(this);
        this.operators[0b110000] = this._onMyY.bind(this);
        this.operators[0b110001] = this._onEat.bind(this);
        this.operators[0b110010] = this._onPut.bind(this);
        this.operators[0b110011] = this._onEnergy.bind(this);
        this.operators[0b110100] = this._onPick.bind(this);
        this.operators[0b110101] = this._onSay.bind(this);
        this.operators[0b110110] = this._onListen.bind(this);
        this.operators[0b110111] = this._onCheck.bind(this);
        this.operators[0b111000] = this._onMyEnergy.bind(this);
        this.operators[0b111001] = this._onMyAge.bind(this);
        //
        // API of the Manager for accessing outside. (e.g. from Console)
        //
        Helper.setApi(manager.api, 'toJS', (code) => this.format(code), 'Converts byte code array into human readable JavaScript based code. This function is low level. For using it you have to get organism\'s virtual machine reference and then use it\'s code property. For example: man.api.toJS(man.api.organisms.getOrganism(\'128\').vm.code). This example will find organism with id \'128\' and shows his byte code.');
    }

    destroy() {
        super.destroy();
        this._manager = null;
    }

    _onLookAt(num)   {return `v${Num.getVar0(num)}=lookAt(v${Num.getVar1(num)},v${Num.getVar2(num)})`}
    _onStep()        {return `step()`}
    _onDir(num)      {return `dir(v${Num.getVar0(num)})`}
    _onMyX(num)      {return `v${Num.getVar0(num)}=myX()`}
    _onMyY(num)      {return `v${Num.getVar0(num)}=myY()`}
    _onEat(num)      {return `eat(v${Num.getVar0(num)})`}
    _onPut(num)      {return `put(v${Num.getVar0(num)})`}
    _onEnergy(num)   {return `energy()`}
    _onPick(num)     {return `pick(v${Num.getVar0(num)})`}
    _onSay(num)      {return `say(v${Num.getVar0(num)})`}
    _onListen(num)   {return `v${Num.getVar0(num)}=listen()`}
    _onCheck(num)    {return `v${Num.getVar0(num)}=check()`}
    _onMyEnergy(num) {return `v${Num.getVar0(num)}=myEnergy()`}
    _onMyAge(num)    {return `v${Num.getVar0(num)}=myAge()`}
}

module.exports = Code2JS;