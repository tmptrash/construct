import Jasmine from 'jasmine';
 
const jasmine = new Jasmine();
jasmine.loadConfigFile('client/jasmine/spec/jasmine.json');
jasmine.execute();