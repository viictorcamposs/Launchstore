// Arquivo sem relevância para o projeto do Launchstore

const printDouble = ( number, number2 ) => 
new Promise ( ( resolve, reject ) => {
    setTimeout(
        () => {
            const result = number * 2 
            resolve ( result + number2 )
        }, 
        Math.floor(Math.random() * 100) + 1
    )
})

// 5, 10, 22, 1, 89 / 5, 12, 20, 150, 5

async function printAll () {
    let results = await printDouble (5, 0)
    console.log ( results ) // = 10 
    
    results = await printDouble (12, results)
    console.log ( results ) // 24 + 10 = 34
    
    results = await printDouble (20, results)
    console.log ( results ) // 40 + 34 = 74
    
    results = await printDouble (150, results)
    console.log ( results ) // 300 + 74 = 374
    
    results = await printDouble (5, results)
    console.log ( results ) // 10 + 374 = 384
} 

printAll()


/*
    async function printAll () {
        let result = await printDouble (5, 0)
        console.log ( result ) // = 10

        result = await printDouble ( 12, result ) 
        console.log ( result ) // 24 + 10 = 34

        result = await printDouble ( 2, result )
        console.log ( result ) // 4 + 34 = 38
    }

    printAll ()
*/

/*
    function printAll () {
        printDouble (5)
        .then ( result => {
            console.log ( result )
            return printDouble (10)
        })
        .then ( result => {
            console.log ( result )
            return printDouble (22)
        })
        .then ( result => { 
            console.log ( result )
            return printDouble (1)
        })
        .then ( result => {
            console.log ( result )
            return printDouble (89)
        })
        .then ( result => {
            console.log ( result )
        })
    }

    printAll ()
*/

/*
    // resolução com modo de uso com callback queue 
    function printAll () {
        printDouble ( 5, ( result ) => {
            console.log ( result )
            printDouble ( 10, ( result ) => {
                console.log ( result )
                printDouble ( 22, ( result ) => {
                    console.log ( result )
                    printDouble ( 1, ( result ) => {
                        console.log ( result )
                        printDouble ( 89, ( result ) => {
                            console.log ( result )
                        })
                    })
                })
            }) 
        })
    }

    printAll ()
*/