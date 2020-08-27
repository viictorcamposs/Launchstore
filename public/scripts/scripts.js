const Mask = {
    apply ( input, func ) {
        setTimeout ( () => {
            input.value = Mask[func]( input.value ) 
        }, 0)
    },
    formatBRL ( value ) {
        value = value.replace (/\D/g, "")

        return new Intl.NumberFormat ('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format ( value/100 )
    }
}