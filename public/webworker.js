importScripts('./skulpt.min.js');
importScripts('./skulpt-stdlib.js');

console.log('web worker started');



this.addEventListener('message', (message) => {

    const code = message.data;
    Sk.configure({
        output: (output) => {
            postMessage(output);
        },
        read: (x) => {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
        },
        inputfun: (prompt) => {
            return 'foo';
        },
        inputfunTakesPrompt: false,
    });

    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, code, true);
    });
    myPromise.then(function (mod) {
        // console.log('success');
    },
        function (err) {
            console.log(err.toString());
            postMessage(err.toString())
        });


});

