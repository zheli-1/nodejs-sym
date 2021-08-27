var randomstrinit = require("randomstring");
var randomnum = require('random');
var boolGen = require('random-boolean-generator');


const fs = require('fs');

// Require your NPM library
var libs = [];
var args = process.argv.slice(2);

console.log("liblist:" + args[0]);

try {
    // read contents of the file
    var path = args[0].toString();
    const data = fs.readFileSync(path, 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // print all lines
    lines.forEach((line) => {
        console.log(line);
        libs.push(line);
    });
} catch (err) {
    console.error(err);
}

//get arguments names from any function
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}

/**
 * Expands an object/function to explore all properties
 
 * @param {any} target The object to be expanded. 
 */
function Expand(target) {
    var properties = [];

    for (let i in target) {
        if (typeof target[i] === "function") {
            // console.log('Pushing ' + target[i].name);
            //skip function with no function name 
            if (target[i].name != 'deprecated') {
                properties.push(i);
            }
        }
    }

    //debug print property
    // console.log(properties);

    for (var functionIndex = 0; functionIndex < properties.length; functionIndex++) {
        var targetFunction = properties[functionIndex];
        // console.log('Testing ' + targetFunction + ' ' + target[targetFunction]);
        // console.log('targetFunction ' + targetFunction);
        // console.log('targetFunction name ' + target[targetFunction].name);
        // console.log('target[targetFunction] ' + target[targetFunction].length);

        //constructing args for functions under test
        var arg_names = getParamNames(target[targetFunction]);

        var construct_args = [];
        var sym_index = 0;
        var length = randomnum.int((min = 1), (max = 10));
        var init_string = 'initial stringxslke';
        for (var argsNameIndex = 0; argsNameIndex < arg_names.length; argsNameIndex++) {
            if (arg_names[argsNameIndex] == 'str') {

                sym_index = argsNameIndex;
                init_string = randomstrinit.generate({
                    length: length
                });

                construct_args[argsNameIndex] = init_string;

            } else if (arg_names[argsNameIndex] == 'padStr') {

                var pad_max = init_string.length;
                var pad_num = randomnum.int((min = 1), (max = pad_max));

                var pad_string = randomstrinit.generate({
                    length: pad_num,
                    charset: init_string
                });
                construct_args[argsNameIndex] = pad_string;

            } else if (arg_names[argsNameIndex] == 'characters') {

                var characters = randomstrinit.generate({
                    length: 1,
                    charset: '&^%*(#@#$'
                });
                construct_args[argsNameIndex] = characters;

            } else if (arg_names[argsNameIndex] == 'callback') {
                var arg_fun = function () { console.log("callback arguments"); };

                construct_args[argsNameIndex] = arg_fun;

            } else if (arg_names[argsNameIndex] == 'quoteChar') {
                construct_args[argsNameIndex] = ';';
            } else if (arg_names[argsNameIndex] == 'length') {

                var pad_max = init_string.length;
                var pad_num = randomnum.int((min = 1), (max = pad_max));
                construct_args[argsNameIndex] = pad_num;

            } else if (arg_names[argsNameIndex] == 'options') {

                // var options = { width: 2, seperator: '.', cut: false, trailingSpaces: true };
                var options = {parseFragmentIdentifier: true};

                construct_args[argsNameIndex] = options;
            } else if (arg_names[argsNameIndex] == 'decapitalize') {

                var swtich = boolGen.gen();
                construct_args[argsNameIndex] = swtich;

            } else if (arg_names[argsNameIndex] == 'trueValues') {

                construct_args[argsNameIndex] = true;
            } else if (arg_names[argsNameIndex] == 'falseValues') {

                construct_args[argsNameIndex] = 0;
            } else if (arg_names[argsNameIndex] == 'separator') {

                construct_args[argsNameIndex] = '*';
            } else if (arg_names[argsNameIndex] == 'qty') {
                construct_args[argsNameIndex] = 5;
            } else if (arg_names[argsNameIndex] == 'pattern') {
                construct_args[argsNameIndex] =  new Object();
            }else if (arg_names[argsNameIndex] == 'modifiers') {
                construct_args[argsNameIndex] = 'g';
            }else if (arg_names[argsNameIndex] == 'locale') {
                construct_args[argsNameIndex] = 'NO';
            }


            else {
                construct_args[argsNameIndex] = 'https://foo.bar?top=foo#bar';
            }

        }
        // console.log(construct_args);
        // console.log(construct_args[sym_index]);
        // console.log(sym_index);

        console.log('============running the function start===================');
        construct_args[sym_index] = 'jlsdkf';
        %SymbolicExecution(construct_args[sym_index]);
        var result;
        try{
            target[properties[functionIndex]](...construct_args);
        }catch(err){
            console.log('crete error/exception found\n');
        }
        // console.log(result);
        console.log('============running the function end=====================');
    }
}



// Creates the symbolic variable to explore all possible functions and constructing an object
// var switcher = symbolic Switcher initial -1;
console.log("libs length:"+libs.length);
for(var i = 0; i < libs.length -1; i++){
    var target = require(libs[i]);
    // console.log("target:"+libs[i]+'----'+target);
    Expand(target);
}

